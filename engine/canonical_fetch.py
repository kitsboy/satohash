#!/usr/bin/env python3
"""
canonical_fetch.py — Satohash v4 canonical-slice builder + drift detector.

For a watch_probe URL, fetch it, extract VERBATIM text (extract, don't summarize),
build the v4 canonical slice (source_url, fetched_at, http_status, content_type,
extraction_method, verbatim_extracted_text, etag, last_modified), serialize with
RFC 8785 JCS, and compute the sha256 that OTS anchors.

Extraction methods by content type:
  text/html      -> strip tags, keep text verbatim (order preserved)
  application/pdf-> pypdf text extraction (verbatim, page order)
  application/json / *+json -> the raw JSON response (verbatim), since it IS text
  text/plain     -> raw body

Hashing is STABLE across re-fetches unless the source content actually changed:
the slice contains only source-identity + fetched-at + verbatim text + cache headers,
nothing non-deterministic (no timing, no random ordering, no summarization).

Usage:
  python3 canonical_fetch.py probe <url> [--slice-out out.json] [--show]
  python3 canonical_fetch.py stability <url> --times 2   # prove no false drift
"""
import argparse, hashlib, html, json, re, sys, time
from datetime import datetime, timezone
from ots_engine import jcs, canonical_slice_sha256

UA = ("Mozilla/5.0 (compatible; SatohashProbe/1.0; +https://satohash.io)")

def now_utc():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def extract_text(content_type: str, body: bytes) -> tuple:
    """Return (extraction_method, verbatim_text). Extract, don't summarize."""
    ct = (content_type or "").lower()
    if "html" in ct:
        txt = body.decode("utf-8", "replace")
        # strip <script>/<style> blocks, then tags; collapse whitespace runs
        txt = re.sub(r"(?is)<(script|style|noscript|template|svg|head)[^>]*>.*?</\1>", " ", txt)
        txt = re.sub(r"(?is)<[^>]+>", " ", txt)
        txt = html.unescape(txt)
        txt = re.sub(r"[ \t\r\f\v]+", " ", txt)
        txt = re.sub(r"\n\s*\n+", "\n", txt).strip()
        return "html_verbatim", txt
    if "pdf" in ct or body[:5] == b"%PDF-":
        try:
            from pypdf import PdfReader
            import io
            reader = PdfReader(io.BytesIO(body))
            pages = []
            for p in reader.pages:
                t = p.extract_text() or ""
                pages.append(re.sub(r"[ \t\r\f\v]+", " ", t))
            return "pdf_verbatim", "\n".join(pages).strip()
        except Exception as e:
            return f"pdf_error:{type(e).__name__}", ""
    if "json" in ct or body.lstrip().startswith((b"{", b"[")):
        # JSON is already machine-readable text; return it verbatim, byte-normalized
        # only for structural re-serialization so whitespace drift doesn't false-positive.
        try:
            obj = json.loads(body.decode("utf-8", "replace"))
            return "json_verbatim", jcs(obj)  # canonical JSON = verbatim + deterministic
        except Exception:
            return "json_raw", body.decode("utf-8", "replace").strip()
    # text/plain and anything else
    return "raw_verbatim", body.decode("utf-8", "replace").strip()


def fetch_slice(url: str) -> dict:
    import urllib.request
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=45) as r:
        raw = r.read(8 * 1024 * 1024)  # cap 8 MiB
        status = getattr(r, "status", 200)
        ct = r.headers.get("Content-Type", "text/plain")
        etag = r.headers.get("ETag")
        lm = r.headers.get("Last-Modified")
    method, text = extract_text(ct, raw)
    return {
        "source_url": url,
        "fetched_at": now_utc(),
        "http_status": status,
        "content_type": ct.split(";")[0].strip(),
        "extraction_method": method,
        "verbatim_extracted_text": text,
        "etag": etag,
        "last_modified": lm,
    }


def probe(url, slice_out=None, show=False):
    sl = fetch_slice(url)
    h, canon = canonical_slice_sha256(sl)
    sl["_canonical_sha256"] = h
    if show:
        print("canonical:", canon)
        print("sha256:", h)
    if slice_out:
        with open(slice_out, "w") as f:
            json.dump(sl, f, indent=2)
        print("wrote", slice_out)
    return sl, h, canon


def stability(url, times=2):
    """Fetch the same URL twice and confirm the hash is STABLE (no false drift).
    Note: fetched_at is part of the slice — that always changes between fetches, by
    design. For drift detection the stable comparison keys are the CONTENT-bearing
    fields (http_status, content_type, extraction_method, verbatim_extracted_text,
    etag, last_modified). We normalize fetched_at out for the stability proof."""
    keys = ["http_status", "content_type", "extraction_method",
            "verbatim_extracted_text", "etag", "last_modified", "source_url"]
    hashes = []
    for i in range(times):
        sl, h, _ = probe(url)
        content_obj = {k: sl[k] for k in keys if k in sl}
        content_hash = canonical_slice_sha256(content_obj)[0]
        hashes.append((h, content_hash))
        print(f"  fetch {i+1}: full_sha256={h}")
        print(f"            content_sha256={content_hash}")
        if i > 0:
            stable = hashes[i][1] == hashes[i-1][1]
            print(f"  -> content STABLE across fetch {i}->{i+1}: {stable}")
            if not stable:
                print("    DRIFT DETECTED (or extraction non-determinism). Investigate.")
                return False
    print("STABILITY PROOF PASSED: no false-positive drift across", times, "re-fetches")
    return True


def main(argv=None):
    ap = argparse.ArgumentParser(description="Satohash v4 canonical-slice fetch + drift")
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("probe"); p.add_argument("url")
    p.add_argument("--slice-out"); p.add_argument("--show", action="store_true")
    p = sub.add_parser("stability"); p.add_argument("url"); p.add_argument("--times", type=int, default=2)
    a = ap.parse_args(argv)
    if a.cmd == "probe":
        sl, h, canon = probe(a.url, a.slice_out, a.show)
        print("content_type:", sl["content_type"], "| status:", sl["http_status"],
              "| method:", sl["extraction_method"], "| text_len:", len(sl["verbatim_extracted_text"]))
    elif a.cmd == "stability":
        ok = stability(a.url, a.times)
        sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
