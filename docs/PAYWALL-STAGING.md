# Paywall dry-run — staging only

Live remains `REQUIRE_LIGHTNING=false` until Cam flips it.

To preview paid UI **without charging anyone**:

```
VITE_PAYWALL_PREVIEW=1 npm run dev
```

The SPA may show a “staging paywall preview” banner. It must not POST invoices on production hosts.

Live flip (THOR only, Cam request): `REQUIRE_LIGHTNING=true` + rebuild/restart API.
