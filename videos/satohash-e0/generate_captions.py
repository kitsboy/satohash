#!/usr/bin/env python3
"""Build <lang>/compositions/captions.html from whisper word timings.

Usage: python3 generate_captions.py en|es

POLISHED caption phrases (from the narration script, not raw whisper text —
whisper mangles proper nouns e.g. "Satal Hash" for "Satohash"). Aligns each
polished phrase to a proportional slice of the whisper word timeline so
captions stay synced to the actual VO. Unique track-index per group,
fade 0.25s in/out + hard kill at end. No CSS pre-hide.
"""
import os, sys, json, re

LANG = sys.argv[1] if len(sys.argv) > 1 else "en"
HERE = os.path.dirname(os.path.abspath(__file__))
tpath = os.path.join(HERE, f"transcript-{LANG}.json")
outpath = os.path.join(HERE, LANG, "compositions", "captions.html")
os.makedirs(os.path.dirname(outpath), exist_ok=True)

with open(tpath) as f:
    wwords = json.load(f)

# drop punctuation-only tokens and merge split contractions (can 't -> can't)
def clean_words(words):
    out, i = [], 0
    while i < len(words):
        t = words[i]["text"]
        if re.fullmatch(r"[\W_]+", t):  # punctuation only
            i += 1; continue
        if t in ("'t", "'s", "'re", "'ve", "'ll", "'d", "n't") and out:
            # merge contraction onto previous word
            prev = out[-1]
            prev["text"] += t
            prev["end"] = words[i]["end"]
            i += 1; continue
        out.append(dict(words[i])); i += 1
    return out

wwords = clean_words(wwords)

# --- Polished caption phrases per language (in VO order) --------------------
PHRASES = {
 "en": [
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
 ],
 "es": [
    "No podemos leerlo. No podemos perderlo. Nunca lo tuvimos.",
    "Esa es la línea honesta en el corazón de Satohash.",
    "Toda disputa sobre quién hizo qué, y cuándo,",
    "termina en una sola pregunta: ¿puedes probar tu versión de los hechos",
    "sin pedirle a nadie que te crea?",
    "Durante siglos, la respuesta era un notario, un abogado, un registro —",
    "un tercero de confianza que diera fe de una fecha.",
    "Satohash es la apuesta fundacional de que ese intermediario ya no es necesario.",
    "OpenTimestamps ancla la huella de tu archivo en la cadena de bloques de Bitcoin.",
    "De forma permanente y verificable. Ninguna empresa entre tu documento y la prueba.",
    "Tu archivo nunca sale de tu dispositivo. Solo un hash toca la cadena.",
    "Una vez que está en un bloque, ese sello no puede alterarse, ni retrotraerse,",
    "ni eliminarse en silencio. Ni por Satohash. Ni por nadie.",
    "Lo que probamos hoy es cuándo existió un archivo — no quién lo hizo.",
    "La autoría es el próximo capítulo.",
    "Tu prueba es portátil: sobrevive al propio Satohash,",
    "y puede verificarse años después con herramientas abiertas.",
    "No nos creas por nuestra palabra. Verifícalo tú mismo.",
    "Herramientas libres y abiertas. Sin cuenta. Sin KYC.",
    "Satohash. Prueba de la verdad, en Bitcoin.",
 ],
}

phrases = PHRASES[LANG]
nphr = len(phrases)

# proportional word-slice mapping: distribute whisper words across phrases by
# phrase word count ratio, so each phrase's start/end tracks the real narration.
ph_wordcount = [len(re.findall(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+", p)) for p in phrases]
total_ph = sum(ph_wordcount)
ph_ratio = [c / total_ph for c in ph_wordcount]

total_w = len(wwords)
# cumulative whisper-word boundaries
boundaries = [0.0]
for r in ph_ratio:
    boundaries.append(boundaries[-1] + r * total_w)
boundaries = [round(b, 3) for b in boundaries]

clips, timeline = [], []
for i, p in enumerate(phrases):
    i0 = int(boundaries[i])
    i1 = max(int(boundaries[i + 1]) - 1, i0)
    i1 = min(i1, total_w - 1)
    start = wwords[i0]["start"]
    end = wwords[i1]["end"]
    if end <= start:
        end = start + 1.0
    cid, inner = f"cap-{i}", f"cap-{i}-inner"
    clips.append(
        f'  <div id="{cid}" class="cap clip" data-start="{start:.3f}" data-duration="{max(end-start,0.5):.3f}" data-track-index="{i+2}"><div id="{inner}" class="cap-inner">{p}</div></div>'
    )
    timeline.append(f'  tl.from("#{inner}", {{opacity:0, y:8, duration:0.25}}, {start:.3f});')
    timeline.append(f'  tl.to("#{inner}", {{opacity:0, y:-8, duration:0.25}}, {max(end-0.25,start):.3f});')
    timeline.append(f'  tl.set("#{inner}", {{opacity:0}}, {end:.3f});')

FONT_IMPORT = ('@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap");')
css = FONT_IMPORT + """
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:1920px; height:1080px; overflow:hidden; margin:0; background:transparent; }
#root { width:1920px; height:1080px; position:relative; overflow:hidden; background:transparent; }
.cap { position:absolute; bottom:110px; left:50%; transform:translateX(-50%); max-width:1560px; }
.cap-inner { font-family:'Plus Jakarta Sans',sans-serif; font-size:40px; font-weight:600; color:#f6f1e8;
  text-align:center; line-height:1.25;
  background:rgba(10,20,32,0.80); padding:12px 28px; border-radius:14px;
  border:1px solid rgba(56,189,248,0.35);
  box-shadow:0 10px 40px rgba(0,0,0,0.4); }
"""

html = f"""<!doctype html>
<html lang="{LANG}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
{css}
</style>
</head>
<body>
<div id="root" data-composition-id="captions" data-width="1920" data-height="1080">
{chr(10).join(clips)}
</div>
<script>
window.__timelines = window.__timelines || {{}};
const tl = gsap.timeline({{paused:true}});
{chr(10).join(timeline)}
window.__timelines["captions"] = tl;
</script>
</body>
</html>
"""
with open(outpath, "w") as f:
    f.write(html)
print(f"wrote {outpath} with {len(phrases)} caption groups ({LANG})")
for i, p in enumerate(phrases):
    i0 = int(boundaries[i]); i1 = min(int(boundaries[i+1])-1, total_w-1)
    print(f"  [{wwords[i0]['start']:6.2f}-{wwords[i1]['end']:6.2f}] {p}")
