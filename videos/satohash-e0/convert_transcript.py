#!/usr/bin/env python3
"""Convert whisper -ojf segment JSON into a word-level transcript.json
list of {text,start,end} (seconds) for the caption generator.

Uses per-token offsets (milliseconds) when present.
"""
import json, sys

src, dst = sys.argv[1], sys.argv[2]
with open(src) as f:
    d = json.load(f)

words = []
for seg in d["transcription"]:
    t0 = seg["offsets"]["from"] / 1000.0
    toks = seg.get("tokens", [])
    real = [t for t in toks if t.get("text","").strip() and not t["text"].startswith("[")]
    if not real:
        for w in seg["text"].split():
            words.append({"text": w, "start": round(t0,3), "end": round(t0+0.3,3)})
        continue
    for t in real:
        of = t.get("offsets")
        if of and of.get("from") is not None:
            st = of["from"] / 1000.0
            en = of["to"] / 1000.0
        else:
            st, en = t0, t0 + 0.25
        txt = t["text"].strip()
        if txt:
            words.append({"text": txt, "start": round(st,3), "end": round(en,3)})

with open(dst, "w") as f:
    json.dump(words, f, ensure_ascii=False, indent=1)
print(f"wrote {dst}: {len(words)} word tokens")
