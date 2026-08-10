<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.giveabit.io · **Version:** 5.0.0-ELITE (Build 208) · **Updated:** 2026-08-10
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash — FINANCIALS (Approximate)

> **Disclaimer:** These are approximate projections for planning purposes only, not audited financial statements.

---

## Cost Structure (Monthly, Early Stage)

| Category | Estimated Monthly Cost | Notes |
|---|---|---|
| Cloudflare Pages hosting | $0–$20 | **In use today** — static SPA at satohash.io |
| Domain (satohash.io) | ~$2 | **In use today** — annual ~$20, amortized |
| OTS Calendar node | $0 | Public calendar nodes are free |
| Bitcoin node (optional, not in use) | $5–$30 | Future only — self-hosted node for extra verification |
| API server (optional, not in use) | $20–$80 | Future only — if forum/history/admin API is deployed |
| Email (transactional) | $0–$10 | Resend/SendGrid free tier |
| Redis (job queue) | $0–$15 | Future only — if backend job queue is added |
| Monitoring (Sentry) | $0–$26 | Free tier for small error volume |
| **Total (today)** | **~$2–$46/month** | Cloudflare + domain + optional Sentry |
| **Total (if all optional added)** | **~$27–$183/month** | Planning ceiling — not current spend |

---

## Revenue Projections

### Year 1 (Bootstrap / MVP)

| Month | Free Users | Paid Users | MRR | Notes |
|---|---|---|---|---|
| M1–M3 | 100 | 0 | $0 | Beta, word of mouth |
| M4–M6 | 500 | 10 | $290 | Product Hunt launch |
| M7–M9 | 1,500 | 35 | $1,015 | SEO gaining traction |
| M10–M12 | 3,000 | 80 | $2,320 | First enterprise deals |

**Year 1 Total Revenue (est.):** ~$15,000–$25,000

### Year 2 (Growth)

| Metric | Target |
|---|---|
| Paid subscribers | 500 |
| Enterprise accounts | 20 |
| API developer accounts | 200 |
| Monthly Recurring Revenue | ~$25,000 |
| Annual Recurring Revenue | ~$300,000 |

### Year 3 (Scale)

| Metric | Target |
|---|---|
| Paid subscribers | 2,000 |
| Enterprise accounts | 80 |
| MRR | ~$100,000 |
| ARR | ~$1.2M |

---

## Unit Economics

| Metric | Value |
|---|---|
| Cost per stamp (server) | ~$0.001 |
| Cost per stamp (OTS) | $0 |
| Average revenue per stamp | $0.01–$0.19 |
| Gross margin (software) | ~85–92% |
| CAC (estimated) | ~$15–$40 |
| LTV (Professional tier) | ~$348 (12 months) |
| LTV/CAC ratio | ~9–23x |

---

## Funding Requirements

### Bootstrap Phase (current)
- **$0 external funding required** — Cloudflare free tier + founder time
- Revenue-funded from first paid customer

### Seed Round (optional, Year 2)
- **Target:** $250,000–$500,000
- **Use:** Full-time engineering hire, marketing, legal integrations, Lightning node infrastructure
- **Dilution target:** 10–15%

---

## Break-Even Analysis

| Scenario | Monthly Costs | Required Paid Users | Price Tier |
|---|---|---|---|
| Minimum (bootstrap) | $150/mo | 6 | Professional ($29) |
| Comfortable (team of 2) | $8,000/mo | 276 | Professional |
| Scale (team of 5) | $40,000/mo | 133 Enterprise + misc | Mixed |

---

## Key Financial Risks

1. **Regulatory** — If timestamping services are classified as financial services in some jurisdictions, compliance costs rise
2. **Competition** — DocuSign / Adobe could add blockchain timestamping features
3. **Bitcoin network fees** — If fees spike dramatically, OTS costs could increase (mitigated by batch anchoring)
4. **Churn** — Legal/compliance workflows have high switching costs once embedded (favorable)

---

*Last updated: 2026-06-10 (handoff prep) | Contact: hello@giveabit.io*

**Note for handoff**: These are planning approximations only. Recent work added production-grade Docker/PM2/PWA paths, richer client-side offline + Lightning components, and Nostr integration — all of which improve the reliability and perceived value of the paid tiers without materially changing the cost structure above. Gross margins remain excellent due to the near-zero marginal cost of OTS anchoring via public calendars.
