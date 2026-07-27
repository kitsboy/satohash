# satohash — Last Updated 2026-07-27 by Grok

Brief: Fix production SPA → api.satohash.io (was same-origin); honest stamp status + metrics  
Commit: `cee9227`  
SPA: GHA Deploy + host fallback; VITE_API_URL baked  
API: https://api.satohash.io (client_id store needs Docker rebuild)  
Smoke: /stamp?hash=9da88734…ee1b&ref=sherpacarta  
