#!/usr/bin/env python3
"""Merge product-loop A i18n keys into pages.{lang}.json. EN is SoT; others overlay."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "src/i18n/marketing"
EN_EXTRA = json.loads((Path(__file__).with_name("i18n-loop-a-en.json")).read_text())


def deep_merge(base: dict, extra: dict) -> dict:
    out = dict(base)
    for k, v in extra.items():
        if isinstance(v, dict) and isinstance(out.get(k), dict):
            out[k] = deep_merge(out[k], v)
        else:
            out[k] = v
    return out


# Full trees for non-EN. Same keys as EN extra.
TR = {}

TR["es"] = {
    "nav": {
        "government": "Gobierno",
        "batchHash": "Hash por lotes",
        "widgets": "Widgets",
        "stamp": "Sellar",
        "verify": "Verificar",
        "templates": "Plantillas",
        "pricing": "Precios",
        "more": "Más",
        "explainer": "Explicación",
        "docs": "Docs",
        "status": "Estado",
        "counsel": "Para abogados",
        "execSummary": "Resumen ejecutivo",
        "comparison": "Comparar",
        "features": "Funciones",
        "howItWorks": "Cómo funciona",
        "trust": "Confianza",
        "stampFree": "Sellar gratis",
        "closeMenu": "Cerrar menú",
        "openMenu": "Abrir menú",
        "bitcoinNotary": "Notaría Bitcoin",
        "primary": "Principal",
        "explorer": "Explorador",
        "batch": "Sello por lotes",
        "snapper": "Captura web",
        "protocolStats": "Estadísticas del protocolo",
    },
    "stampPage": {
        "fileNeverLeavesSend": "El archivo no sale de este dispositivo. Enviamos un SHA-256."
    },
    "stampDonePage": {
        "viewMempool": "Ver en mempool.space",
        "blockHeightMissing": "Altura de bloque aún no guardada — pending ≠ el problema; la confirmación está registrada.",
        "pendingTipTitle": "Pending no es confirmed",
        "pendingTipBody": "La huella está en los calendarios OpenTimestamps. NO está en un bloque Bitcoin hasta que el estado sea confirmed. Pending ≠ confirmed.",
    },
    "proofCardPage": {
        "kicker": "Tarjeta pública de prueba",
        "zeroJsKicker": "Tarjeta de prueba sin JS",
        "brandSub": "Prueba Bitcoin de existencia",
        "pendingNe": "PENDING ≠ CONFIRMED",
        "notConfirmed": "{{status}} · no confirmado",
        "confirmed": "CONFIRMED",
        "confirmedBlock": "CONFIRMED · bloque {{block}}",
        "titleConfirmed": "Confirmado en Bitcoin",
        "titlePending": "Pending no es confirmed",
        "fingerprint": "Huella SHA-256",
        "emptyFile": "Este resumen es el SHA-256 de un archivo vacío — una huella válida, a menudo usada como prueba de humo.",
        "neverLeaves": "Solo se envió una huella SHA-256. El archivo original no tuvo que salir del dispositivo. No hace falta confiar en Satohash — verifique con OpenTimestamps.",
        "imessage": "Comparta esta página en iMessage — la vista previa es una foto, no la app.",
        "otsCli": "ots-cli verify proof.ots",
        "interactiveVerify": "Verificación interactiva",
        "hardOpen": "Abrir tarjeta fija",
        "stampFile": "Sellar un archivo",
        "forCounsel": "Para abogados",
        "copyLink": "Copiar enlace de prueba",
        "copied": "Copiado",
        "share": "Compartir",
        "njump": "njump",
        "loading": "Cargando…",
        "footer": "Matemática independiente · OpenTimestamps → Bitcoin ·",
        "statusLink": "Estado",
        "noscript": "Abra esta URL en satohash.io para la tarjeta sin JS, o use ots-cli.",
        "recorded": "Satohash registró esta huella.",
        "recordedAt": "Satohash registró esta huella a las {{time}}.",
        "anchored": "Bitcoin la ha anclado.",
        "anchoredBlock": "Bitcoin la ha anclado en el bloque {{block}}.",
        "calendarsHave": "Los calendarios tienen el resumen. Un bloque Bitcoin aún no lo incluye. Pending no es confirmed.",
        "calendarsLine": "Calendars · alice · bob · finney",
    },
    "counselPage": {
        "metaTitle": "Para abogados",
        "metaDesc": "Qué es — y qué no es — un sello Satohash / OpenTimestamps para lectores de eIDAS, ESIGN y UETA.",
        "kicker": "Para abogados · una página",
        "title": "Qué prueba un sello Satohash",
        "lede": "Prueba anclada en Bitcoin de existencia en un momento, no de identidad, consentimiento ni validez jurídica del documento subyacente.",
        "print": "Imprimir / guardar PDF",
        "itIs": "Sí es",
        "is1": "Una huella SHA-256 calculada en el cliente. El archivo no tiene que salir del dispositivo.",
        "is2": "Un recibo OpenTimestamps que los calendarios más tarde incluyen en una transacción Bitcoin.",
        "is3": "Verificable de forma independiente con ots-cli o cualquier biblioteca OTS contra calendarios públicos o su propio nodo Bitcoin.",
        "is4": "Compatible en espíritu con ESIGN / UETA (EE. UU.) y los sellos de tiempo electrónicos eIDAS — una atestación matemática de existencia previa, no una comisión notarial.",
        "itIsNot": "No es",
        "not1": "Prueba de que una persona concreta autoró, firmó o consintió el archivo.",
        "not2": "Prueba de que el archivo es verdadero, lícito, admisible o completo.",
        "not3": "Por sí solo, un acto notarial estatal ni un servicio de confianza cualificado.",
        "not4a": "Finalidad instantánea en Bitcoin.",
        "not4b": "Pending significa enviado a calendarios.",
        "not4c": "Confirmed significa que un bloque Bitcoin incluye la atestación.",
        "footer": "Satohash es la superficie de producto. La cadena de confianza es OpenTimestamps + prueba de trabajo Bitcoin. El abogado debe verificar el .ots de forma independiente.",
        "verifyLink": "Verificar una prueba",
    },
    "watchPage": {
        "fullTitle": "Corte completo",
        "teaserTitle": "Teaser",
        "fullAria": "Explicación Satohash de 80 segundos con voz",
        "teaserAria": "Explicación Satohash de 10 segundos con voz",
        "kicker": "~{{seconds}}s · Kimi",
        "titleBefore": "Séllalo en",
        "titleHighlight": "Bitcoin",
        "subtitle": "El archivo se queda en el dispositivo. La huella se sella. Bitcoin ancla la prueba. El corte educativo largo es el principal; el teaser de 10s sigue aquí.",
        "lengthAria": "Duración de la explicación",
        "playExplainer": "Reproducir explicación",
        "readyToStamp": "¿Listo para sellar?",
        "playAgain": "Volver a reproducir",
        "stampFree": "Sellar gratis",
        "pendingNe": "Pending ≠ confirmed",
        "pendingBodyBefore": "Pending",
        "pendingBodyMid": "significa que los calendarios tienen la huella.",
        "confirmedWord": "Confirmed",
        "pendingBodyAfter": "significa que un bloque Bitcoin la incluye. No trate pending como final.",
        "play": "Reproducir",
        "pause": "Pausa",
        "restart": "Reiniciar",
        "muteTitle": "Silenciar / activar audio del vídeo",
        "soundOff": "Sin sonido",
        "soundOn": "Con sonido",
        "board": "Guion {{title}}",
        "videoFile": "Archivo de vídeo:",
        "voBaked": "VO incluida.",
        "fullHookTitle": "Gancho",
        "fullHookLine": "¿Tiene un archivo que debe existir ahora — y ser demostrable para siempre? Satohash lo sella en Bitcoin. De forma permanente. Gratis.",
        "fullProblemTitle": "Problema",
        "fullProblemLine": "Enviarse una copia por correo no es prueba. Satohash toma la huella del archivo y le da un recibo que no se puede falsificar.",
        "fullHowTitle": "Cómo funciona",
        "fullHowLine": "Un clic. Sin cuenta. Sin monedero. Calendarios independientes, luego un bloque Bitcoin. La prueba es suya para siempre.",
        "fullBatchTitle": "Lotes",
        "fullBatchLine": "¿Una carpeta de documentos? Séllalos por lotes. Cada archivo obtiene su propia prueba independiente.",
        "fullVerifyTitle": "Verificar",
        "fullVerifyLine": "Vuelva más tarde, introduzca el sello. Calendarios y Bitcoin coinciden — insignia verde. Confíe, pero verifique.",
        "fullCtaTitle": "CTA",
        "fullCtaLine": "Nada que instalar. Nada que comprar. Selle su primer archivo gratis en satohash.io.",
        "shortHookTitle": "Gancho",
        "shortHookLine": "¿Un archivo que debe existir — y ser demostrable para siempre?",
        "shortPrivacyTitle": "Privacidad",
        "shortPrivacyLine": "El archivo no sale de su dispositivo. Solo se sella una huella.",
        "shortAnchorTitle": "Bitcoin",
        "shortAnchorLine": "Calendarios independientes. Un bloque Bitcoin. Una prueba que nadie puede falsificar.",
        "shortCtaTitle": "CTA",
        "shortCtaLine": "Gratis. Sin cuenta. Séllalo en satohash.io.",
    },
}

# Remaining locales filled below in the same shape; start from EN then overlay.


def load_pages(lang: str) -> dict:
    return json.loads((PAGES / f"pages.{lang}.json").read_text())


def save_pages(lang: str, data: dict) -> None:
    path = PAGES / f"pages.{lang}.json"
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


OVERLAYS = {
    "es": ["i18n-loop-a-es-rest.json"],
    "fr": ["i18n-loop-a-fr.json"],
    "de": ["i18n-loop-a-de.json"],
    "pt": ["i18n-loop-a-pt.json"],
    "sw": ["i18n-loop-a-sw.json"],
    "zh": ["i18n-loop-a-zh.json"],
}


def main() -> None:
    langs = ["en", "es", "fr", "de", "pt", "sw", "zh"]
    here = Path(__file__).parent
    for lang in langs:
        data = load_pages(lang)
        merged = deep_merge(data, EN_EXTRA)
        if lang in TR:
            merged = deep_merge(merged, TR[lang])
        for name in OVERLAYS.get(lang, []):
            overlay = json.loads((here / name).read_text())
            merged = deep_merge(merged, overlay)
        save_pages(lang, merged)
        print(f"patched pages.{lang}.json")


if __name__ == "__main__":
    main()
