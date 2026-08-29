#!/usr/bin/env python3
"""Build <lang>/index.html — root composition wiring scenes, captions, narration.

Usage: python3 generate_index.py en|es
Scene boundaries matched to the narration beats (per-language timings).
"""
import os, sys

LANG = sys.argv[1] if len(sys.argv) > 1 else "en"
HERE = os.path.dirname(os.path.abspath(__file__))
DUR = {"en": 90.6, "es": 91.6}[LANG]
WAV = {"en": "narration-en.wav", "es": "narration-es.wav"}[LANG]
MEDIA_DUR = {"en": 90.58, "es": 91.6}[LANG]

# scene (start, duration) — boundaries on narration pauses (see captions)
SCENES = {
 "en": [
    ("scene-01", 0.0,  6.0),
    ("scene-02", 6.0, 16.0),
    ("scene-03", 22.0, 8.0),
    ("scene-04", 30.0, 15.6),
    ("scene-05", 45.6, 16.8),
    ("scene-06", 62.4, 14.8),
    ("scene-07", 77.2, 9.8),
    ("scene-08", 87.0, 3.6),
 ],
 "es": [
    ("scene-01", 0.0,  5.5),
    ("scene-02", 5.5, 15.2),
    ("scene-03", 20.7, 8.6),
    ("scene-04", 29.3, 17.3),
    ("scene-05", 46.6, 16.3),
    ("scene-06", 62.9, 15.9),
    ("scene-07", 78.8, 8.2),
    ("scene-08", 87.0, 4.6),
 ],
}

scenes = SCENES[LANG]
hosts = []
fades = []
for i, (sid, st, dur) in enumerate(scenes):
    hosts.append(
        f'    <div id="host-{sid}" class="host" data-composition-id="{sid}" data-composition-src="compositions/{sid}.html" data-start="{st}" data-duration="{dur}" data-track-index="1"></div>'
    )
    # soft crossfade-in each scene a hair after its start (transition = entrance)
    fades.append(f'    [{st:.1f}, "{sid}"]')
fade_rows = "\n".join(fades)
host_rows = "\n".join(hosts)

# narration data-duration: match media length exactly (validate warns otherwise)
audio_dur = MEDIA_DUR

html = f"""<!doctype html>
<html lang="{LANG}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  html, body {{ width:1920px; height:1080px; overflow:hidden; margin:0; background:#0e1c2a; }}
  .host {{ position:absolute; inset:0; }}
</style>
</head>
<body>
  <div
    id="root"
    data-composition-id="main"
    data-start="0"
    data-duration="{DUR}"
    data-width="1920"
    data-height="1080"
  >
    <!-- Scenes (track 1) -->
{host_rows}

    <!-- Captions (track 3) -->
    <div id="host-captions" class="host" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="{DUR}" data-track-index="3"></div>

    <!-- Narration (track 20) -->
    <audio id="narration" data-start="0" data-duration="{audio_dur}" data-track-index="20" src="{WAV}" preload="auto"></audio>
  </div>

  <script>
    window.__timelines = window.__timelines || {{}};
    const tl = gsap.timeline({{ paused: true }});

    // Soft cinematic crossfades between scene hosts (transition = entrance).
    const fadeInAt = [
{fade_rows}
    ];
    fadeInAt.forEach(([t, id]) => {{
      tl.from("#host-" + id, {{ opacity: 0, duration: 0.8, ease: "sine.inOut" }}, t);
    }});

    window.__timelines["main"] = tl;
  </script>
</body>
</html>
"""
out = os.path.join(HERE, LANG, "index.html")
with open(out, "w") as f:
    f.write(html)
print(f"wrote {out}  duration={DUR}s")
