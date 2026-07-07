import landingEn from './landing.en.json'
import landingEs from './landing.es.json'
import landingFr from './landing.fr.json'
import landingDe from './landing.de.json'
import landingPt from './landing.pt.json'
import landingSw from './landing.sw.json'
import landingZh from './landing.zh.json'
import faqEn from './faq.en.json'
import faqEs from './faq.es.json'
import faqFr from './faq.fr.json'
import faqDe from './faq.de.json'
import faqPt from './faq.pt.json'
import faqSw from './faq.sw.json'
import faqZh from './faq.zh.json'
import pagesEn from './pages.en.json'
import pagesEs from './pages.es.json'
import pagesFr from './pages.fr.json'
import pagesDe from './pages.de.json'
import pagesPt from './pages.pt.json'
import pagesSw from './pages.sw.json'
import pagesZh from './pages.zh.json'

/** Merge onboarding + marketing namespaces per locale. */
export function buildTranslationBundle(base, landing, faq, pages) {
  return {
    ...base,
    landingPage: landing,
    faqPage: faq,
    ...pages
  }
}

export const marketingByLang = {
  en: { landing: landingEn, faq: faqEn, pages: pagesEn },
  es: { landing: landingEs, faq: faqEs, pages: pagesEs },
  fr: { landing: landingFr, faq: faqFr, pages: pagesFr },
  de: { landing: landingDe, faq: faqDe, pages: pagesDe },
  pt: { landing: landingPt, faq: faqPt, pages: pagesPt },
  sw: { landing: landingSw, faq: faqSw, pages: pagesSw },
  zh: { landing: landingZh, faq: faqZh, pages: pagesZh }
}
