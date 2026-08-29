#!/usr/bin/env python3
import json
d = json.load(open("transcript-en-full.json"))
seg = d["transcription"][0]
print("seg keys:", list(seg.keys()))
toks = seg.get("tokens", [])
print("num tokens:", len(toks))
if toks:
    print("token0:", toks[0])
    print("token1:", toks[1])
    print("token2:", toks[2])
