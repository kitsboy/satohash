#!/usr/bin/env python3
import json
for lang in ["en", "es"]:
    w = json.load(open(f"transcript-{lang}.json"))
    print(f"--- {lang}: {len(w)} words ---")
    print([(x["text"], x["start"]) for x in w[:14]])
