#!/usr/bin/env python3
"""Build English subtitle files (.vtt + .srt) for the Satohash E0 explainer.

Source of truth is the SAME word-level whisper transcript and the SAME polished
caption phrases + proportional word-slice alignment used by the family's
generate_captions.py (the burned-in captions in the silent variant). Reusing
that mapping guarantees the external subtitle track matches the on-screen
captions word-for-word and second-for-second -- no re-recording, no re-encode.

Usage:
    python3 make_subtitles.py            # writes satohash-explainer-en.{vtt,srt}

Read-only with respect to the video: nothing is transcoded.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TRANSCRIPT = os.path.join(HERE, "transcript-en.json")
OUT_STEM = os.path.join(HERE, "satohash-explainer-en")

# Polished caption phrases, in VO order (verbatim from generate_captions.py "en"
# -- whisper mangles proper nouns, so we never ship raw whisper text).
PHRASES = [
    "We can't read it. We can't lose it. We never had it.",
    "That's the honest line at the heart of Satohash.",
    "Every dispute over who did what, and when,",
    "comes down to one question: can you prove your version of events",
    "without asking anyone to take your word for it?",
    "For centuries, the answer was a notary, a lawyer, a registry —",
    "some trusted third party to vouch for a date.",
    "Satohash is the founding bet that this middleman is no longer necessary.",
    "OpenTimestamps anchors a fingerprint of your file into the Bitcoin blockchain.",
    "Permanently. Verifiably. No company between your document and the proof.",
    "Your file never leaves your device. Only a hash touches the chain.",
    "Once it's in a block, that timestamp can't be altered, backdated,",
    "or quietly removed. Not by Satohash. Not by anyone.",
    "What we prove today is when a file existed — not who made it.",
    "Authorship is the next chapter.",
    "Your proof is portable: it outlives Satohash itself,",
    "and it can be checked years later with open tools.",
    "Don't take our word for it. Verify this yourself.",
    "Free, open tools. No account. No KYC.",
    "Satohash. Proof of truth, on Bitcoin.",
]


def clean_words(words):
    """Drop punctuation-only tokens; merge split contractions (can 't -> can't)."""
    out, i = [], 0
    while i < len(words):
        t = words[i]["text"]
        if re.fullmatch(r"[\W_]+", t):
            i += 1
            continue
        if t in ("'t", "'s", "'re", "'ve", "'ll", "'d", "n't") and out:
            out[-1]["text"] += t
            out[-1]["end"] = words[i]["end"]
            i += 1
            continue
        out.append(dict(words[i]))
        i += 1
    return out


def fmt(ts, sep):
    if ts < 0:
        ts = 0.0
    h = int(ts // 3600)
    m = int((ts % 3600) // 60)
    s = ts % 60
    return f"{h:02d}:{m:02d}:{s:06.3f}".replace(".", sep)


def main():
    with open(TRANSCRIPT) as f:
        words = clean_words(json.load(f))
    total_w = len(words)

    counts = [len(re.findall(r"[A-Za-z0-9]+", p)) for p in PHRASES]
    total_ph = sum(counts)
    ratio = [c / total_ph for c in counts]

    bounds = [0.0]
    for r in ratio:
        bounds.append(bounds[-1] + r * total_w)
    bounds = [round(b, 3) for b in bounds]

    cues = []
    for i, p in enumerate(PHRASES):
        i0 = int(bounds[i])
        i1 = min(max(int(bounds[i + 1]) - 1, i0), total_w - 1)
        start = words[i0]["start"]
        end = words[i1]["end"]
        if end <= start:
            end = start + 1.0
        cues.append((start, end, p))

    # enforce monotonic, non-overlapping cues (a cue may start at the previous end)
    for i in range(1, len(cues)):
        ps, pe, pt = cues[i - 1]
        s, e, t = cues[i]
        if s < pe:
            cues[i] = (round(pe, 3), max(e, round(pe + 0.2, 3)), t)

    vtt = ["WEBVTT", ""]
    srt = []
    for n, (s, e, t) in enumerate(cues, 1):
        vtt += [f"{n}", f"{fmt(s, '.')} --> {fmt(e, '.')}", t, ""]
        srt += [f"{n}", f"{fmt(s, ',')} --> {fmt(e, ',')}", t, ""]

    vtt_path = OUT_STEM + ".vtt"
    srt_path = OUT_STEM + ".srt"
    with open(vtt_path, "w") as f:
        f.write("\n".join(vtt).rstrip() + "\n")
    with open(srt_path, "w") as f:
        f.write("\n".join(srt).rstrip() + "\n")

    print(f"words={total_w} cues={len(cues)}")
    print(f"first cue start={cues[0][0]:.3f}s last cue end={cues[-1][1]:.3f}s")
    for n, (s, e, t) in enumerate(cues, 1):
        print(f"  {n:2d} [{s:6.2f}-{e:6.2f}] {t}")
    print(f"wrote {vtt_path}")
    print(f"wrote {srt_path}")


if __name__ == "__main__":
    sys.exit(main())
