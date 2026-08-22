#!/usr/bin/env python3
"""
ots_engine.py — Satohash v4 reusable OpenTimestamps stamp/upgrade/verify engine
                 + RFC 8785 canonical-slice hashing. The ecosystem trust spine.

Lifecycle:  stamp (parallel multi-calendar) -> upgrade (until mined to a block)
            -> verify (against Bitcoin blockchain, zero dependency on our servers).
Never delete a .ots file.

Ground-truth layer: OpenTimestamps (portable, protocol-level, Bitcoin-verifiable).
UX layer:           Satohash. This module is the reusable core both ride on.

Modes of use:
  python3 ots_engine.py stamp   <file>            # stamp a file against all calendars
  python3 ots_engine.py upgrade <file>.ots         # pull attestations toward a block
  python3 ots_engine.py verify  <file>.ots <orig>  # verify against the blockchain
  python3 ots_engine.py hash    <file>             # sha256 (what OTS anchors)
  python3 ots_engine.py slice   <slice.json>       # canonical-slice sha256 (JCS)
  python3 ots_engine.py jcs     <obj.json>         # print RFC 8785 canonical JSON

Canonical slice (v4 doctrine #3): stable JSON artifact
  {source_url, fetched_at, http_status, content_type, extraction_method,
   verbatim_extracted_text, etag, last_modified}
  serialized with RFC 8785 JCS deterministic key ordering, then sha256'd.
  STABLE across re-fetches unless the source itself changed (no false-positive drift).
"""
import argparse, hashlib, io, json, os, re, sys, threading, time
from queue import Queue
from datetime import datetime, timezone

# ---------------------------------------------------------------- RFC 8785 JCS
# Deterministic canonical JSON. Implemented in stdlib (portable, no deps).
# Handles: fixed key order (sorted), correct string escaping, number re-serialization.

_ESCAPES = {'"': '\\"', '\\': '\\\\'}
def _jcs_str(s: str) -> str:
    s = s.replace('\\', '\\\\').replace('"', '\\"')
    out = ['"']
    for ch in s:
        if ord(ch) < 0x20:
            out.append('\\u%04x' % ord(ch))
        else:
            out.append(ch)
    out.append('"')
    return ''.join(out)

def jcs_number(n) -> str:
    """Canonical number serialization: JSON.stringify-equivalent, no -0, no
    leading/trailing noise. Uses repr, then normalizes exponent form."""
    if isinstance(n, bool):
        raise TypeError("bool is not a JCS number")
    if n == 0:
        return "0"
    if isinstance(n, int):
        return str(n)
    # float: RFC 8785 requires JS JSON.stringify semantics — integral floats
    # serialize without a decimal point (1.0 -> "1"), matching JSON.parse of
    # the same value. Non-integral floats keep JS shortest-roundtrip repr.
    if isinstance(n, float) and float(n).is_integer():
        return str(int(n))
    # float
    r = repr(n)
    if 'e' in r or 'E' in r:
        m, e = re.split('[eE]', r)
        exp = int(e)
        # reconstruct normalized decimal form (rare path; floats rarely appear here)
        sign = '-' if m.startswith('-') else ''
        m = m.lstrip('-')
        if '.' in m:
            ip, fp = m.split('.')
        else:
            ip, fp = m, ''
        digits = ip + fp
        point_pos = len(ip) + exp
        if point_pos <= 0:
            r = sign + "0." + "0" * (-point_pos) + digits
        elif point_pos >= len(digits):
            r = sign + digits + "0" * (point_pos - len(digits))
        else:
            r = sign + digits[:point_pos] + "." + digits[point_pos:]
    return r

def jcs(value) -> str:
    """Return RFC 8785 JCS canonical JSON for a Python object."""
    if value is None:
        return "null"
    if value is True:
        return "true"
    if value is False:
        return "false"
    if isinstance(value, str):
        return _jcs_str(value)
    if isinstance(value, int):
        return jcs_number(value)
    if isinstance(value, float):
        return jcs_number(value)
    if isinstance(value, (list, tuple)):
        return "[" + ",".join(jcs(v) for v in value) + "]"
    if isinstance(value, dict):
        items = [(_jcs_str(str(k)), jcs(v)) for k, v in value.items()]
        items.sort(key=lambda kv: kv[0])
        return "{" + ",".join(k + ":" + v for k, v in items) + "}"
    # datetime -> ISO-8601 UTC
    if isinstance(value, datetime):
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return _jcs_str(value.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"))
    raise TypeError("cannot JCS-serialize %r" % type(value))


# ---------------------------------------------------------------- sha256 helpers
def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()

def canonical_slice_sha256(slice_obj: dict) -> str:
    """sha256 of the RFC 8785 canonical JSON of a canonical slice. This is the
    digest OTS anchors — the ground truth of 'this exact content existed at this
    time'. Stable across re-fetches unless the source actually changed."""
    canon = jcs(slice_obj)
    return sha256_bytes(canon.encode("utf-8")), canon


# ---------------------------------------------------------------- OTS calendar
CALENDARS = [
    "https://finney.calendar.eternitywall.com",
    "https://alice.btc.calendar.opentimestamps.org",
    "https://bob.btc.calendar.opentimestamps.org",
    # Optional 4th (calendar.catallaxy.com) is UNVERIFIED as of 2026-08-22
    # (no DNS A record). Re-check separately before enabling.
]

from opentimestamps.core.op import OpSHA256
from opentimestamps.core.timestamp import DetachedTimestampFile, Timestamp
from opentimestamps.core.serialize import BytesSerializationContext
from opentimestamps.calendar import RemoteCalendar


def _submit_one(url, msg, q, timeout):
    try:
        cal = RemoteCalendar(url)
        t = cal.submit(msg, timeout=timeout)
        q.put(("ok", url, t))
    except Exception as e:
        q.put(("err", url, str(e)[:200]))


def stamp_file(fname, calendars=None, timeout=30, min_attest=2,
               backoff=(5, 15, 30), max_retries=1):
    """Stamp a file against all calendars in PARALLEL. Merges every successful
    attestation into one .ots. Requires >= min_attest attestations to write.
    Retries a full pass on transient failures with backoff. Returns path."""
    calendars = calendars or CALENDARS
    with open(fname, "rb") as f:
        dt = DetachedTimestampFile.from_fd(OpSHA256(), f)
    msg = dt.timestamp.msg

    successes, failures, attestations = [], [], []
    for attempt in range(max_retries + 1):
        q = Queue()
        threads = [threading.Thread(target=_submit_one,
                                    args=(u, msg, q, timeout)) for u in calendars]
        for t in threads: t.start()
        results = []
        for _ in calendars:
            try:
                results.append(q.get(timeout=timeout + 5))
            except Exception as e:
                results.append(("err", "queue-timeout", str(e)))
        for t in threads: t.join(timeout=2)
        for kind, url, val in results:
            if kind == "ok":
                try:
                    attestations.append(val)
                    successes.append(url)
                except Exception as e:
                    failures.append((url, str(e)[:120]))
            else:
                failures.append((url, val))
        if len(successes) >= min_attest:
            break
        if attempt < max_retries:
            delay = backoff[attempt % len(backoff)]
            print(f"  [retry {attempt+1}] only {len(successes)} attestation(s); "
                  f"sleeping {delay}s then retrying", file=sys.stderr)
            time.sleep(delay)

    if len(successes) < min_attest:
        return None, successes, failures

    # Merge each successful attestation into the detached timestamp. merge() unions
    # the Merkle paths, so the resulting proof verifies against every calendar that
    # answered. This mirrors the proven stamp_lib.py path.
    with open(fname, "rb") as f:
        dt = DetachedTimestampFile.from_fd(OpSHA256(), f)
    for att in attestations:
        dt.timestamp.merge(att)
    buf = BytesSerializationContext()
    dt.serialize(buf)
    out = fname + ".ots"
    with open(out, "wb") as f:
        f.write(buf.getbytes())
    return out, successes, failures


def upgrade_file(ots_fname, timeout=60):
    """Attempt to upgrade a .ots (pull pending attestations toward a block).
    Calendars from the proof are queried; backoff via `ots upgrade` CLI logic.
    Returns (ok:bool, msg:str). A fresh stamp is normally pending for 1-6h
    (up to ~24h) before a calendar commits it to a mined Bitcoin block."""
    import subprocess
    r = subprocess.run(["ots", "upgrade", ots_fname],
                       capture_output=True, text=True, timeout=timeout)
    out = (r.stdout + "\n" + r.stderr).strip()
    if "Upgraded" in out or "Attestation" in out and "Success" in out:
        return True, out
    if "Pending confirmation" in out or "pending" in out.lower():
        return False, out
    if "Already" in out:
        return True, out
    return False, out


def verify_file(ots_fname, orig_file, timeout=120):
    """Verify a .ots against the Bitcoin blockchain for the given original file.
    exit 0 == verified, exit 1 == pending, else error. Returns (verified:bool, pending:bool, msg)."""
    import subprocess
    r = subprocess.run(["ots", "verify", "-f", orig_file, ots_fname],
                       capture_output=True, text=True, timeout=timeout)
    msg = (r.stdout + "\n" + r.stderr).strip()
    if r.returncode == 0:
        return True, False, msg
    if "Pending confirmation" in msg or "not confirmed" in msg:
        return False, True, msg
    if "verification failed" in msg.lower() or "invalid" in msg.lower():
        return False, False, msg
    return False, False, msg


# ---------------------------------------------------------------- CLI
def main(argv=None):
    ap = argparse.ArgumentParser(description="Satohash v4 OTS engine + canonical hashing")
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("stamp", help="stamp a file (parallel multi-calendar)")
    p.add_argument("file"); p.add_argument("--min-attest", type=int, default=2)

    p = sub.add_parser("upgrade", help="upgrade a .ots toward a block")
    p.add_argument("ots")

    p = sub.add_parser("verify", help="verify .ots against the blockchain")
    p.add_argument("ots"); p.add_argument("orig")

    p = sub.add_parser("hash", help="sha256 of a file")
    p.add_argument("file")

    p = sub.add_parser("slice", help="canonical-slice sha256 (JCS) of a slice JSON")
    p.add_argument("slice_json")

    p = sub.add_parser("jcs", help="print RFC 8785 canonical JSON of a JSON file")
    p.add_argument("obj_json")

    a = ap.parse_args(argv)
    if a.cmd == "stamp":
        out, ok, fail = stamp_file(a.file, min_attest=a.min_attest)
        print(f"successes ({len(ok)}):")
        for u in ok: print("   ", u)
        if fail:
            print("failures:")
            for u, e in fail: print("   ", u, "->", e)
        if out:
            print("WROTE", out, os.path.getsize(out), "bytes")
        else:
            print("FEWER THAN", a.min_attest, "ATTESTATIONS — no .ots written", file=sys.stderr)
            sys.exit(1)
    elif a.cmd == "upgrade":
        ok, msg = upgrade_file(a.ots)
        print(msg)
        sys.exit(0 if ok else 1)
    elif a.cmd == "verify":
        ver, pend, msg = verify_file(a.ots, a.orig)
        print(msg)
        if ver: print("VERIFIED against Bitcoin blockchain.")
        elif pend: print("PENDING — not yet in a mined block.")
        sys.exit(0 if ver else 1)
    elif a.cmd == "hash":
        print(sha256_file(a.file))
    elif a.cmd == "slice":
        with open(a.slice_json) as f:
            obj = json.load(f)
        h, canon = canonical_slice_sha256(obj)
        print("canonical:", canon)
        print("sha256:", h)
    elif a.cmd == "jcs":
        with open(a.obj_json) as f:
            obj = json.load(f)
        print(jcs(obj))


if __name__ == "__main__":
    main()
