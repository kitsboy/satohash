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

/** Merge onboarding + marketing namespaces per locale. */
export function buildTranslationBundle(base, landing, faq) {
  return {
    ...base,
    landingPage: landing,
    faqPage: faq
  }
}

export const marketingByLang = {
  en: { landing: landingEn, faq: faqEn },
  es: { landing: landingEs, faq: faqEs },
  fr: { landing: landingFr, faq: faqFr },
  de: { landing: landingDe, faq: faqDe },
  pt: { landing: landingPt, faq: faqPt },
  sw: { landing: landingSw, faq: faqSw },
  zh: { landing: landingZh, faq: faqZh }
}
