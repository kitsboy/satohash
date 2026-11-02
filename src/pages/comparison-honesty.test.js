import { describe, expect, it } from 'vitest'
import de from '../i18n/marketing/pages.de.json'
import en from '../i18n/marketing/pages.en.json'
import es from '../i18n/marketing/pages.es.json'
import fr from '../i18n/marketing/pages.fr.json'
import pt from '../i18n/marketing/pages.pt.json'
import sw from '../i18n/marketing/pages.sw.json'
import zh from '../i18n/marketing/pages.zh.json'

const pages = { en, es, fr, de, pt, sw, zh }

describe('comparison and pending copy', () => {
  it('marks BOLT-12, multi-party, and Snapper as planned in every locale', () => {
    for (const [loc, page] of Object.entries(pages)) {
      for (const id of ['bolt12', 'multiParty', 'snapper']) {
        expect(page.comparisonPage.rows[id].satohash, loc + id).toBe('planned')
      }
      expect(page.comparisonPage.cellValues.planned, loc).toBeTruthy()
      expect(page.comparisonPage.rows.bitcoinAnchored.satohash, loc).toBe(true)
    }
  })

  it('uses one pending sentence on the done page and the proof card', () => {
    for (const [loc, page] of Object.entries(pages)) {
      const sentence = page.howProofWorks.statePendingBody
      expect(page.stampDonePage.pendingLine, loc).toBe(sentence)
      expect(page.proofCardPage.waitingBlock, loc).toBe(sentence)
      expect(sentence.toLowerCase()).not.toMatch(/60/)
    }
  })
})
