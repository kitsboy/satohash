#!/usr/bin/env python3
"""Validate the generated EN subtitle files (structure + timing)."""
import re, sys, os
d = os.path.dirname(os.path.abspath(__file__))
vtt = open(os.path.join(d, "satohash-explainer-en.vtt")).read()
srt = open(os.path.join(d, "satohash-explainer-en.srt")).read()

def tosec(ts):
    ts = ts.replace(",", ".")
    h, m, s = ts.split(":")
    return int(h) * 3600 + int(m) * 60 + float(s)

def parse_vtt(t):
    assert t.startswith("WEBVTT"), "missing WEBVTT header"
    out = []
    for b in [x for x in t.strip().split("\n\n")[1:] if x.strip()]:
        lines = b.split("\n")
        m = re.fullmatch(r"(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})", lines[1])
        assert m, f"bad vtt timestamp: {lines[1]}"
        out.append((lines[0], m.group(1), m.group(2), "\n".join(lines[2:])))
    return out

def parse_srt(t):
    out = []
    for b in [x for x in t.strip().split("\n\n") if x.strip()]:
        lines = b.split("\n")
        m = re.fullmatch(r"(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})", lines[1])
        assert m, f"bad srt timestamp: {lines[1]}"
        out.append((lines[0], m.group(1), m.group(2), "\n".join(lines[2:])))
    return out

vc, sc = parse_vtt(vtt), parse_srt(srt)
print(f"vtt cues={len(vc)} srt cues={len(sc)}")
assert [c[3] for c in vc] == [c[3] for c in sc], "text mismatch between vtt and srt"
assert [c[0] for c in vc] == [str(i) for i in range(1, len(vc) + 1)], "vtt numbering"
assert [c[0] for c in sc] == [str(i) for i in range(1, len(sc) + 1)], "srt numbering"
prev = 0.0
ok = True
for i, (_, a, b, _) in enumerate(vc, 1):
    s, e = tosec(a), tosec(b)
    if s < prev - 1e-9:
        ok = False; print(f"OVERLAP at cue {i}")
    if e <= s:
        ok = False; print(f"non-positive duration at cue {i}")
    prev = e
print("monotonic non-overlapping:", ok)
print("first start %.3f  last end %.3f  (published video 90.600s)" % (tosec(vc[0][1]), tosec(vc[-1][2])))
print("last end <= video duration:", tosec(vc[-1][2]) <= 90.600)
print("vtt lines:", len(vtt.splitlines()), "srt lines:", len(srt.splitlines()))
print("longest cue %d chars, longest cue %.2fs" % (max(len(c[3]) for c in vc), max(tosec(c[2]) - tosec(c[1]) for c in vc)))
print("VALID" if ok else "INVALID")
