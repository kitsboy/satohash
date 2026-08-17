# Store apps (Capacitor) — not shipped

Scaffold only. Web PWA is the product today.

```bash
npm run build
npx cap add ios    # when Cam is ready
npx cap add android
npx cap sync
```

`capacitor.config.json` points at `dist/`. Do not change `VITE_API_URL` — store shells must still call `https://api.satohash.io`.
