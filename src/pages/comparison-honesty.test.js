import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import de from '../i18n/marketing/pages.de.json'
import en from '../i18n/marketing/pages.en.json'
import es from '../i18n/marketing/pages.es.json'
import fr from '../i18n/marketing/pages.fr.json'
import pt from '../i18n/marketing/pages.pt.json'
import sw from '../i18n/marketing/pages.sw.json'
import zh from '../i18n/marketing/pages.zh.json'
import { pageMeta } from '../seo/pageMeta'

const pages = { en, es, fr, de, pt, sw, zh }

describe('comparison and pending copy', () => {
  it('marks BOLT-12 and Snapper as planned, and does not show multi-party', () => {
    const pageDir = join(process.cwd(), 'src/pages')
    const comparison = readFileSync(join(pageDir, 'Comparison.jsx'), 'utf8')
    const pricing = readFileSync(join(pageDir, 'Pricing.jsx'), 'utf8')
    const stamp = readFileSync(join(pageDir, 'Stamp.jsx'), 'utf8')
    expect(comparison).not.toMatch(/'multiParty'/)
    expect(pricing).not.toMatch(/'multiParty'/)
    expect(stamp).not.toMatch(/Multi-Party|multiParty|co-signer/i)
    for (const [loc, page] of Object.entries(pages)) {
      for (const id of ['bolt12', 'snapper']) {
        expect(page.comparisonPage.rows[id].satohash, loc + id).toBe('planned')
      }
      expect(page.pricingPage.tiers.premium.features.join(' '), loc).not.toMatch(
        /multi-party|multipart|mehrparteien|pande nyingi|多方/i
      )
      expect(page.guidesPage.comingSoon.subtitle, loc).not.toMatch(
        /multi-party|multipart|mehrparteien|pande nyingi|多方/i
      )
      expect(`${pageMeta.pitch[loc].title} ${pageMeta.pitch[loc].description}`, loc).not.toMatch(
        /civic notary|notaire civique|bürger-notar|notari wa kijamii|公民公证|cívic/i
      )
      expect(page.execSummaryPage.brief.enterprises.p1, loc).not.toMatch(
        /multi-party|multipart|mehrparteien|pande nyingi|wahusika wengi|多方/i
      )
      expect(
        `${pageMeta.mobileSigner[loc].title} ${pageMeta.mobileSigner[loc].description}`,
        loc
      ).not.toMatch(/co-sign|co-firm|co-assin|cosign|联合签名|msaini wa pamoja/i)
      expect(page.comparisonPage.cellValues.planned, loc).toBeTruthy()
      expect(page.comparisonPage.rows.bitcoinAnchored.satohash, loc).toBe(true)
      expect(page.comparisonPage.columns.eth, loc).toBeUndefined()
      expect(page.comparisonPage.rows.bitcoinAnchored.eth, loc).toBeUndefined()
      expect(page.pricingPage.trust.zeroKnowledge, loc).not.toMatch(
        /zero-knowledge|conocimiento cero|connaissance nulle|零知识|ujuzi wa sifuri/i
      )
    }
  })

  it('homepage share text does not say forever or immutable', () => {
    for (const [loc, meta] of Object.entries(pageMeta.landing)) {
      const blob = `${meta.title} ${meta.description}`.toLowerCase()
      expect(blob, loc).not.toMatch(
        /forever|para siempre|für immer|immutable|zero-knowledge|in minutes/
      )
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
