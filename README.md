# SYBORG Shop

Hybrid online/offline merch booth system for SYBORG Club events (any event, not just Pagsibol).

- `/` — Shop feed: scrollable catalog + in-feed ad videos, customers scan a QR to open on their phone.
- `/kiosk` — booth laptop screen: looping ad reel + live QR code + staff "mark sold" panel.

## One-time backend setup (Google Apps Script, free)
Club sheet: https://docs.google.com/spreadsheets/d/1AmVtBaCAnJR6Ws7HAgbKBjkHE_Z0-8EiWWO7UjRT6y4/edit

1. In that Sheet, create two tabs (exact names matter):
   - `Catalog`: header row `id, name, category, price, stock, imageUrl, series`
   - `Reservations`: header row `timestamp, itemId, name, contact, qty`
2. Extensions → Apps Script, paste in `apps-script/Code.gs`.
3. Deploy → New deployment → Web app. Execute as **Me**, access **Anyone**.
4. Copy the deployment URL into `.env` as `VITE_APPS_SCRIPT_URL` (see `.env.example`).

## Local dev
```
npm install
npm run dev
```

## Ad videos
Drop vertical clips into `public/ads/` as `reel-1.mp4`, `reel-2.mp4`, etc., and list them in
`src/pages/Shop.jsx` / `src/pages/Kiosk.jsx`.

## Deploy
Push to GitHub, import into Vercel, set `VITE_APPS_SCRIPT_URL` as an environment variable there too.
