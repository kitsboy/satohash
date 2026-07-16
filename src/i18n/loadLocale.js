import { buildTranslationBundle } from './marketing/index.js'

const loaders = {
  en: () =>
    Promise.all([
      import('./translations/en.json'),
      import('./marketing/landing.en.json'),
      import('./marketing/faq.en.json'),
      import('./marketing/pages.en.json')
    ]),
  es: () =>
    Promise.all([
      import('./translations/es.json'),
      import('./marketing/landing.es.json'),
      import('./marketing/faq.es.json'),
      import('./marketing/pages.es.json')
    ]),
  fr: () =>
    Promise.all([
      import('./translations/fr.json'),
      import('./marketing/landing.fr.json'),
      import('./marketing/faq.fr.json'),
      import('./marketing/pages.fr.json')
    ]),
  de: () =>
    Promise.all([
      import('./translations/de.json'),
      import('./marketing/landing.de.json'),
      import('./marketing/faq.de.json'),
      import('./marketing/pages.de.json')
    ]),
  pt: () =>
    Promise.all([
      import('./translations/pt.json'),
      import('./marketing/landing.pt.json'),
      import('./marketing/faq.pt.json'),
      import('./marketing/pages.pt.json')
    ]),
  sw: () =>
    Promise.all([
      import('./translations/sw.json'),
      import('./marketing/landing.sw.json'),
      import('./marketing/faq.sw.json'),
      import('./marketing/pages.sw.json')
    ]),
  zh: () =>
    Promise.all([
      import('./translations/zh.json'),
      import('./marketing/landing.zh.json'),
      import('./marketing/faq.zh.json'),
      import('./marketing/pages.zh.json')
    ])
}

const cache = new Map()

/** Lazy-load a locale bundle (cached after first load). */
export async function loadLocaleBundle(code) {
  if (cache.has(code)) return cache.get(code)
  const load = loaders[code] || loaders.en
  const [base, landing, faq, pages] = await load()
  const bundle = buildTranslationBundle(base.default, landing.default, faq.default, pages.default)
  cache.set(code, bundle)
  return bundle
}
