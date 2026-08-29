#!/usr/bin/env python3
"""Build compositions/scene-NN.html for the Satohash E0 film (both languages).

Usage: python3 generate_scenes.py en|es
Reads DESIGN tokens, emits 8 scenes into <project>/compositions/ with
gsap.from() entrances only. Scene text is per-language.
"""
import os, sys, json

LANG = sys.argv[1] if len(sys.argv) > 1 else "en"
HERE = os.path.dirname(os.path.abspath(__file__))
COMP = os.path.join(HERE, LANG, "compositions")
os.makedirs(COMP, exist_ok=True)

FONT_IMPORT = ('@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap");')

# ---- Scene content per language -------------------------------------------------
# Each scene: id, kicker, title lines [(text, class)], plus optional elements
def T(**kw): return kw

SCENES = {
 "en": [
  T(id="scene-01", kick="Satohash · the founding idea",
    title=["We can't read it.", "We can't lose it.", "We never had it."],
    titlecls="hook"),
  T(id="scene-02", kick="The question",
    title=["That's the honest line", "at the heart of Satohash."],
    sub="Every dispute over who did what, and when, comes down to one question:",
    sub2="can you prove your version of events — without asking anyone to take your word for it?",
    bigq="?"),
  T(id="scene-03", kick="The old way",
    title=["For centuries, the answer was", "a notary, a lawyer, a registry."],
    sub="Some trusted third party to vouch for a date.",
    seals=["NOTARY","LAWYER","REGISTRY"]),
  T(id="scene-04", kick="The founding bet",
    title=["That middleman is", "no longer necessary."],
    sub="OpenTimestamps anchors a fingerprint of your file into the Bitcoin blockchain.",
    sub2="Permanently. Verifiably. No company between your document and the proof.",
    chain=True),
  T(id="scene-05", kick="Your document, never yours to hand over",
    title=["Your file never leaves", "your device."],
    sub="Only a hash touches the chain.",
    sub2="Once it's in a block, that timestamp can't be altered, backdated, or quietly removed. Not by Satohash. Not by anyone.",
    lock=True),
  T(id="scene-06", kick="The honest gap — said out loud",
    title=["What we prove today is", "when a file existed."],
    sub="Not who made it. Authorship is the next chapter.",
    sub2="Your proof is portable: it outlives Satohash itself, and it can be checked years later with open tools.",
    gap=True),
  T(id="scene-07", kick="The standing invitation",
    title=["Don't take our word for it."],
    sub="Verify this yourself.",
    chips=["Free, open tools","No account","No KYC"],
    badge=True),
  T(id="scene-08", kick="",
    title=["Satohash."],
    sub="Proof of truth, on Bitcoin.",
    tagline="No one owns truth, so no one should gate proof of it.",
    endcard=True),
 ],
 "es": [
  T(id="scene-01", kick="Satohash · la idea fundacional",
    title=["No podemos leerlo.", "No podemos perderlo.", "Nunca lo tuvimos."],
    titlecls="hook"),
  T(id="scene-02", kick="La pregunta",
    title=["Esa es la línea honesta", "en el corazón de Satohash."],
    sub="Toda disputa sobre quién hizo qué, y cuándo, termina en una sola pregunta:",
    sub2="¿puedes probar tu versión de los hechos — sin pedirle a nadie que te crea?",
    bigq="?"),
  T(id="scene-03", kick="La forma antigua",
    title=["Durante siglos, la respuesta era", "un notario, un abogado, un registro."],
    sub="Un tercero de confianza que diera fe de una fecha.",
    seals=["NOTARIO","ABOGADO","REGISTRO"]),
  T(id="scene-04", kick="La apuesta fundacional",
    title=["Ese intermediario", "ya no es necesario."],
    sub="OpenTimestamps ancla la huella de tu archivo en la cadena de bloques de Bitcoin.",
    sub2="De forma permanente y verificable. Ninguna empresa entre tu documento y la prueba.",
    chain=True),
  T(id="scene-05", kick="Tu documento, nunca lo entregas",
    title=["Tu archivo nunca sale", "de tu dispositivo."],
    sub="Solo un hash toca la cadena.",
    sub2="Una vez que está en un bloque, ese sello no puede alterarse, ni retrotraerse, ni eliminarse en silencio. Ni por Satohash. Ni por nadie.",
    lock=True),
  T(id="scene-06", kick="La brecha honesta — dicho en voz alta",
    title=["Lo que probamos hoy es", "cuándo existió un archivo."],
    sub="No quién lo hizo. La autoría es el próximo capítulo.",
    sub2="Tu prueba es portátil: sobrevive al propio Satohash y puede verificarse años después con herramientas abiertas.",
    gap=True),
  T(id="scene-07", kick="La invitación permanente",
    title=["No nos creas por nuestra palabra."],
    sub="Verifícalo tú mismo.",
    chips=["Herramientas libres y abiertas","Sin cuenta","Sin KYC"],
    badge=True),
  T(id="scene-08", kick="",
    title=["Satohash."],
    sub="Prueba de la verdad, en Bitcoin.",
    tagline="Nadie es dueño de la verdad, así que nadie debería controlar la prueba de ella.",
    endcard=True),
 ],
}

CSS = """
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:1920px; height:1080px; overflow:hidden; margin:0; background:#0e1c2a; }
#root { width:1920px; height:1080px; position:relative; overflow:hidden;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  background:
    radial-gradient(1200px 700px at 70% 15%, #14283c 0%, #0e1c2a 48%, #0a1420 100%);
}
#root::before { content:""; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(900px 520px at 15% 82%, rgba(56,189,248,0.10) 0%, transparent 58%),
    radial-gradient(760px 460px at 86% 12%, rgba(240,180,41,0.09) 0%, transparent 58%),
    radial-gradient(640px 420px at 50% 50%, rgba(139,92,246,0.05) 0%, transparent 60%);
}
.kicker { font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:28px;
  letter-spacing:0.14em; color:#38bdf8; text-transform:uppercase; position:relative; z-index:2; }
.kick { position:relative; z-index:2; }
.h1 { position:relative; z-index:2; text-align:center; margin-top:28px; }
.h1 .line { font-family:'Space Grotesk',sans-serif; font-weight:600; color:#f6f1e8; }
.h1 .line em { font-style:normal; color:#f0b429; }
.sub { position:relative; z-index:2; text-align:center; margin-top:30px; max-width:1400px; }
.sub .s1 { font-family:'Plus Jakarta Sans',sans-serif; font-weight:500; font-size:34px; color:#d4f0f8; line-height:1.35; }
.sub .s2 { font-family:'Plus Jakarta Sans',sans-serif; font-weight:600; font-size:34px; color:#a9c6d6; line-height:1.35; margin-top:14px; }
.mono { font-family:'JetBrains Mono',monospace; }
.gold { color:#f0b429; }
.sky { color:#38bdf8; }
.gr { color:#34d399; }
.vio { color:#8b5cf6; }
.mut { color:#9fb4c4; }
/* hook scene */
.hook-lines { display:flex; flex-direction:column; gap:18px; position:relative; z-index:2; text-align:center; }
.hook-lines .hl { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:70px; color:#f6f1e8; }
.hook-lines .hl:last-child em { font-style:normal; color:#f0b429; }
/* scene2 question */
.bigq { position:relative; z-index:2; margin-top:26px; font-family:'Space Grotesk',sans-serif;
  font-size:120px; font-weight:700; color:#f0b429; line-height:1; }
/* scene3 seals */
.seal-row { display:flex; gap:34px; position:relative; z-index:2; margin-top:40px; }
.seal { width:240px; height:150px; border-radius:18px;
  background:linear-gradient(135deg,#1b2f45,#14283c); border:2px solid rgba(159,180,196,0.35);
  display:flex; align-items:center; justify-content:center; color:#9fb4c4;
  font-family:'JetBrains Mono',monospace; font-size:26px; font-weight:600; letter-spacing:0.08em;
  box-shadow:0 18px 50px rgba(0,0,0,0.4); }
/* scene4 chain */
.chain-row { display:flex; align-items:center; gap:20px; position:relative; z-index:2; margin-top:44px; }
.chain-doc { width:230px; height:140px; border-radius:16px; padding:18px;
  background:linear-gradient(135deg,#1b2f45,#14283c); border:2px solid rgba(56,189,248,0.45);
  display:flex; flex-direction:column; justify-content:space-between; }
.chain-doc .cdl { font-size:14px; font-weight:700; color:#38bdf8; letter-spacing:0.06em; }
.chain-doc .cdl-lines { display:flex; flex-direction:column; gap:8px; }
.chain-doc .cdl-lines i { display:block; height:8px; border-radius:4px; background:rgba(246,241,232,0.35); }
.chain-doc .cdl-lines i:nth-child(2){ width:70%; }
.chain-arrow { font-size:44px; color:#38bdf8; }
.chain-hash { width:260px; height:140px; border-radius:16px; padding:18px;
  background:#14283c; border:2px solid rgba(240,180,41,0.5);
  display:flex; flex-direction:column; justify-content:center; gap:10px; }
.chain-hash .hlbl { font-size:14px; font-weight:700; color:#f0b429; letter-spacing:0.06em; }
.chain-hash .hh { font-size:20px; color:#f6f1e8; letter-spacing:0.02em; line-height:1.4; }
.chain-blocks { display:flex; gap:14px; }
.block { width:96px; height:96px; border-radius:20px;
  background:linear-gradient(135deg,#f0b429,#d89b1a); display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 34px rgba(240,180,41,0.45); }
.block .b { font-family:'Space Grotesk',sans-serif; font-size:40px; font-weight:700; color:#0e1c2a; }
.block.gap { opacity:0.28; }
.lock-row { display:flex; align-items:center; gap:24px; position:relative; z-index:2; margin-top:40px; }
.lock-dev { width:210px; height:130px; border-radius:16px;
  background:linear-gradient(135deg,#1b2f45,#14283c); border:2px solid rgba(56,189,248,0.45);
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; }
.lock-dev .ld { font-size:44px; }
.lock-dev .ldl { font-size:14px; font-weight:700; color:#38bdf8; letter-spacing:0.06em; }
.lock-hash { width:200px; height:130px; border-radius:16px; padding:16px;
  background:#14283c; border:2px solid rgba(240,180,41,0.5);
  display:flex; flex-direction:column; justify-content:center; gap:8px; }
.lock-hash .lhl { font-size:13px; font-weight:700; color:#f0b429; }
.lock-hash .lh { font-size:18px; color:#f6f1e8; letter-spacing:0.02em; }
.lock-arrow { font-size:40px; color:#38bdf8; }
.xrow { display:flex; gap:22px; position:relative; z-index:2; margin-top:34px; }
.xchip { font-family:'Plus Jakarta Sans',sans-serif; font-size:22px; font-weight:600; color:#fb7185;
  padding:14px 24px; border-radius:999px; background:rgba(251,113,133,0.10);
  border:1px solid rgba(251,113,133,0.4); }
/* scene6 gap */
.gap-row { display:flex; gap:26px; position:relative; z-index:2; margin-top:40px; }
.gap-card { width:300px; height:170px; border-radius:20px; padding:22px;
  background:linear-gradient(135deg,#1b2f45,#14283c); border:2px solid rgba(139,92,246,0.45);
  display:flex; flex-direction:column; justify-content:center; gap:10px; box-shadow:0 18px 50px rgba(0,0,0,0.4); }
.gap-card .gl { font-family:'Space Grotesk',sans-serif; font-size:30px; font-weight:600; color:#8b5cf6; }
.gap-card .gs { font-family:'Plus Jakarta Sans',sans-serif; font-size:22px; color:#c9aef7; line-height:1.3; }
/* scene7 verify */
.chip-row { display:flex; gap:24px; position:relative; z-index:2; margin-top:36px; }
.chip { display:flex; align-items:center; gap:14px; padding:18px 28px; border-radius:999px;
  background:linear-gradient(135deg,#1b2f45,#14283c); border:2px solid rgba(52,211,153,0.5);
  box-shadow:0 14px 40px rgba(0,0,0,0.4); }
.chip .chk { color:#34d399; font-size:26px; font-weight:800; }
.chip .ct { font-family:'Plus Jakarta Sans',sans-serif; font-size:26px; font-weight:600; color:#f6f1e8; }
.badge { position:relative; z-index:2; margin-top:38px; display:flex; align-items:center; gap:18px;
  padding:16px 30px; border-radius:999px; background:rgba(240,180,41,0.12);
  border:1px solid rgba(240,180,41,0.5); }
.badge .ring { width:16px; height:16px; border-radius:50%; background:#34d399; box-shadow:0 0 14px #34d399; }
.badge .bt { font-family:'Plus Jakarta Sans',sans-serif; font-size:24px; font-weight:600; color:#f6f1e8; }
.badge .bl { font-family:'JetBrains Mono',monospace; font-size:18px; color:#9fb4c4; margin-left:8px; }
/* endcard */
.end-logo { display:flex; flex-direction:column; align-items:center; gap:6px; position:relative; z-index:2; }
.brand-seal { width:112px; height:112px; border-radius:28px; margin-bottom:14px;
  background:linear-gradient(135deg,#f0b429,#d89b1a,#8b5cf6); display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 48px rgba(240,180,41,0.55); }
.brand-seal .bs { font-family:'Space Grotesk',sans-serif; font-size:54px; font-weight:700; color:#0e1c2a; }
.end-title { font-family:'Space Grotesk',sans-serif; font-size:96px; font-weight:700; color:#f6f1e8; text-align:center; }
.end-sub { font-family:'Plus Jakarta Sans',sans-serif; font-size:40px; font-weight:600; color:#f0b429; margin-top:12px; text-align:center; }
.end-tag { font-family:'Plus Jakarta Sans',sans-serif; font-style:italic; font-size:26px; color:#d4f0f8; margin-top:26px; text-align:center; max-width:1300px; line-height:1.4; }
.safe { position:absolute; bottom:34px; left:0; right:0; text-align:center;
  font-family:'Plus Jakarta Sans',sans-serif; font-size:16px; color:#7d92a3; z-index:2; line-height:1.4; padding:0 80px; }
"""

def body(sc):
    s = []
    s.append('<div id="root" data-composition-id="%s" data-width="1920" data-height="1080">' % sc["id"])
    if sc.get("kick"):
        s.append('  <div class="kick center" style="text-align:center;"><span class="kicker">%s</span></div>' % sc["kick"])
    if sc["id"] == "scene-01":
        s.append('  <div class="hook-lines">')
        for i, ln in enumerate(sc["title"]):
            if i == len(sc["title"])-1:
                s.append('    <span class="hl"><em>%s</em></span>' % ln)
            else:
                s.append('    <span class="hl">%s</span>' % ln)
        s.append('  </div>')
    elif sc["id"] == "scene-02":
        s.append('  <div class="h1">')
        for ln in sc["title"]:
            s.append('    <div class="line" style="font-size:64px;">%s</div>' % ln)
        s.append('  </div>')
        s.append('  <div class="sub"><div class="s1">%s</div><div class="s2">%s</div></div>' % (sc["sub"], sc["sub2"]))
        s.append('  <div class="bigq">%s</div>' % sc["bigq"])
    elif sc["id"] == "scene-03":
        s.append('  <div class="h1">')
        for ln in sc["title"]:
            s.append('    <div class="line" style="font-size:58px;">%s</div>' % ln)
        s.append('  </div>')
        s.append('  <div class="sub"><div class="s1">%s</div></div>' % sc["sub"])
        s.append('  <div class="seal-row">')
        for se in sc["seals"]:
            s.append('    <div class="seal">%s</div>' % se)
        s.append('  </div>')
    elif sc["id"] == "scene-04":
        s.append('  <div class="h1">')
        for ln in sc["title"]:
            s.append('    <div class="line" style="font-size:60px;">%s</div>' % ln)
        s.append('  </div>')
        s.append('  <div class="sub"><div class="s1">%s</div><div class="s2">%s</div></div>' % (sc["sub"], sc["sub2"]))
        s.append('  <div class="chain-row">')
        s.append('    <div class="chain-doc"><div class="cdl mono">DOCUMENT</div><div class="cdl-lines"><i></i><i></i><i></i></div></div>')
        s.append('    <div class="chain-arrow">&rarr;</div>')
        s.append('    <div class="chain-hash"><div class="hlbl mono">SHA-256 HASH</div><div class="hh">f8d2e0&hellip;9c41a7</div></div>')
        s.append('    <div class="chain-arrow">&rarr;</div>')
        s.append('    <div class="chain-blocks"><div class="block"><span class="b">821k</span></div><div class="block"><span class="b">821m</span></div><div class="block"><span class="b">821n</span></div></div>')
        s.append('  </div>')
    elif sc["id"] == "scene-05":
        s.append('  <div class="h1">')
        for ln in sc["title"]:
            s.append('    <div class="line" style="font-size:62px;">%s</div>' % ln)
        s.append('  </div>')
        s.append('  <div class="sub"><div class="s1">%s</div></div>' % sc["sub"])
        s.append('  <div class="lock-row">')
        s.append('    <div class="lock-dev"><span class="ld">&#128241;</span><span class="ldl mono">YOUR DEVICE</span></div>')
        s.append('    <div class="lock-arrow">&rarr;</div>')
        s.append('    <div class="lock-hash"><div class="lhl mono">HASH ONLY</div><div class="lh">f8d2e0&hellip;</div></div>')
        s.append('    <div class="lock-arrow">&rarr;</div>')
        s.append('    <div class="chain-blocks"><div class="block"><span class="b">&#11088;</span></div></div>')
        s.append('  </div>')
        s.append('  <div class="xrow"><span class="xchip">&#10005; altered</span><span class="xchip">&#10005; backdated</span><span class="xchip">&#10005; quietly removed</span></div>')
    elif sc["id"] == "scene-06":
        s.append('  <div class="h1">')
        for ln in sc["title"]:
            s.append('    <div class="line" style="font-size:60px;">%s</div>' % ln)
        s.append('  </div>')
        s.append('  <div class="sub"><div class="s1">%s</div><div class="s2">%s</div></div>' % (sc["sub"], sc["sub2"]))
        s.append('  <div class="gap-row">')
        s.append('    <div class="gap-card"><div class="gl">when</div><div class="gs">Proved today. Existence &amp; date.</div></div>')
        s.append('    <div class="gap-card"><div class="gl" style="color:#8b5cf6;">who</div><div class="gs">Next chapter. Authorship via your private key.</div></div>')
        s.append('  </div>')
    elif sc["id"] == "scene-07":
        s.append('  <div class="h1">')
        for ln in sc["title"]:
            s.append('    <div class="line" style="font-size:72px;">%s</div>' % ln)
        s.append('  </div>')
        s.append('  <div class="sub"><div class="s1">%s</div></div>' % sc["sub"])
        s.append('  <div class="chip-row">')
        for c in sc["chips"]:
            s.append('    <div class="chip"><span class="chk">&#10003;</span><span class="ct">%s</span></div>' % c)
        s.append('  </div>')
        s.append('  <div class="badge"><span class="ring"></span><span class="bt">Proof badge</span><span class="bl mono">f8d2e0&hellip; &middot; block 821,142</span></div>')
    elif sc["id"] == "scene-08":
        s.append('  <div class="end-logo">')
        s.append('    <div class="brand-seal"><span class="bs">&#36;</span></div>')
        s.append('    <div class="end-title">%s</div>' % sc["title"][0])
        s.append('    <div class="end-sub">%s</div>' % sc["sub"])
        s.append('    <div class="end-tag">%s</div>' % sc["tagline"])
        s.append('  </div>')
        s.append('  <div class="safe">Safe Harbour &middot; Educational &amp; informational only &middot; Not legal, financial, or investment advice &middot; Part of the Give A Bit family &mdash; Bitcoin sovereignty first.</div>')
    s.append('</div>')
    return "\n".join(s)

def timeline(sc, idx):
    t = []
    t.append('  const tl = gsap.timeline({paused:true});')
    k = 0.2
    if sc.get("kick"):
        t.append('  tl.from(".kick", {opacity:0, y:16, duration:0.5}, %s);' % k)
        k += 0.25
    if sc["id"] == "scene-01":
        t.append('  tl.from(".hl", {opacity:0, y:24, duration:0.7, stagger:0.28}, %s);' % k)
    elif sc["id"] == "scene-02":
        t.append('  tl.from(".h1 .line", {opacity:0, y:20, duration:0.7, stagger:0.2}, %s);' % k)
        t.append('  tl.from(".sub .s1", {opacity:0, y:18, duration:0.6}, %s);' % (k+0.6))
        t.append('  tl.from(".sub .s2", {opacity:0, y:18, duration:0.6}, %s);' % (k+1.0))
        t.append('  tl.from(".bigq", {opacity:0, scale:0, duration:0.5, ease:"back.out(2)"}, %s);' % (k+1.6))
    elif sc["id"] == "scene-03":
        t.append('  tl.from(".h1 .line", {opacity:0, y:20, duration:0.7, stagger:0.2}, %s);' % k)
        t.append('  tl.from(".sub .s1", {opacity:0, y:18, duration:0.6}, %s);' % (k+0.6))
        t.append('  tl.from(".seal", {opacity:0, scale:0.7, duration:0.5, ease:"back.out(1.6)", stagger:0.18}, %s);' % (k+1.0))
    elif sc["id"] == "scene-04":
        t.append('  tl.from(".h1 .line", {opacity:0, y:20, duration:0.7, stagger:0.2}, %s);' % k)
        t.append('  tl.from(".sub .s1", {opacity:0, y:18, duration:0.6}, %s);' % (k+0.6))
        t.append('  tl.from(".sub .s2", {opacity:0, y:18, duration:0.6}, %s);' % (k+1.0))
        t.append('  tl.from(".chain-doc", {opacity:0, x:-40, duration:0.7}, %s);' % (k+1.5))
        t.append('  tl.from(".chain-hash", {opacity:0, scale:0.85, duration:0.6}, %s);' % (k+1.9))
        t.append('  tl.from(".block", {opacity:0, scale:0, duration:0.5, ease:"back.out(2)", stagger:0.22}, %s);' % (k+2.4))
    elif sc["id"] == "scene-05":
        t.append('  tl.from(".h1 .line", {opacity:0, y:20, duration:0.7, stagger:0.2}, %s);' % k)
        t.append('  tl.from(".sub .s1", {opacity:0, y:18, duration:0.6}, %s);' % (k+0.6))
        t.append('  tl.from(".lock-dev", {opacity:0, x:-40, duration:0.6}, %s);' % (k+1.1))
        t.append('  tl.from(".lock-hash", {opacity:0, scale:0.85, duration:0.6}, %s);' % (k+1.6))
        t.append('  tl.from(".xchip", {opacity:0, y:14, duration:0.5, stagger:0.15}, %s);' % (k+2.1))
    elif sc["id"] == "scene-06":
        t.append('  tl.from(".h1 .line", {opacity:0, y:20, duration:0.7, stagger:0.2}, %s);' % k)
        t.append('  tl.from(".sub .s1", {opacity:0, y:18, duration:0.6}, %s);' % (k+0.6))
        t.append('  tl.from(".sub .s2", {opacity:0, y:18, duration:0.6}, %s);' % (k+1.0))
        t.append('  tl.from(".gap-card", {opacity:0, y:22, duration:0.6, stagger:0.3}, %s);' % (k+1.5))
    elif sc["id"] == "scene-07":
        t.append('  tl.from(".h1 .line", {opacity:0, y:20, duration:0.7, stagger:0.2}, %s);' % k)
        t.append('  tl.from(".sub .s1", {opacity:0, y:18, duration:0.6}, %s);' % (k+0.6))
        t.append('  tl.from(".chip", {opacity:0, y:18, duration:0.55, stagger:0.2}, %s);' % (k+1.2))
        t.append('  tl.from(".badge", {opacity:0, scale:0.9, duration:0.6, ease:"back.out(1.6)"}, %s);' % (k+1.9))
    elif sc["id"] == "scene-08":
        t.append('  tl.from(".brand-seal", {opacity:0, scale:0, duration:0.6, ease:"back.out(2)"}, %s);' % k)
        t.append('  tl.from(".end-title", {opacity:0, y:20, duration:0.7}, %s);' % (k+0.6))
        t.append('  tl.from(".end-sub", {opacity:0, y:16, duration:0.6}, %s);' % (k+1.0))
        t.append('  tl.from(".end-tag", {opacity:0, y:14, duration:0.6}, %s);' % (k+1.4))
        t.append('  tl.from(".safe", {opacity:0, y:10, duration:0.6}, %s);' % (k+1.8))
    t.append('  window.__timelines["%s"] = tl;' % sc["id"])
    return "\n".join(t)

for sc in SCENES[LANG]:
    html = f"""<!doctype html>
<html lang="{LANG}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
{FONT_IMPORT}
{CSS}
</style>
</head>
<body>
{body(sc)}
<script>
window.__timelines = window.__timelines || {{}};
{timeline(sc, 0)}
</script>
</body>
</html>"""
    out = os.path.join(COMP, sc["id"] + ".html")
    with open(out, "w") as f:
        f.write(html)
    print("wrote", out)

print("done", LANG)
