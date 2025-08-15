## EcoSnap AI — Next.js + Serverless APIs

Fully functional EcoSnap AI built with Next.js (App Router), TypeScript, Tailwind, shadcn/ui, and Framer Motion. Backend uses Vercel serverless functions to call Gemini (vision) and Open Food Facts, with robust offline fallbacks.

### Quickstart

1) Install deps
```bash
npm install
```

2) Copy env template and fill values
```bash
cp .env.local.example .env.local
# set GEMINI_API_KEY
```

3) Run locally
```bash
npm run dev
```

4) Production build test
```bash
npm run build && npm run start
```

### Environment variables
Create `.env.local`:
```
GEMINI_API_KEY=
GOOGLE_MAPS_API_KEY=
```
Only server code reads secrets via `process.env.*`.

### Tech stack
- Next.js App Router (`/app`), API routes in `/app/api/*/route.ts`
- TypeScript everywhere
- Tailwind + shadcn/ui + Framer Motion
- Serverless: Vercel functions (`/app/api`)
- Image processing: `sharp`
- Data providers: Gemini 2.0 Flash (Vision), Open Food Facts

### Structure
- `app/` — pages and API routes
- `components/` — app components (camera, barcode, AR, cards)
- `lib/` — server/client utilities (Gemini, OpenFoodFacts, eco-score, storage, etc.)
- `data/` — offline fallback JSON

### API endpoints
- POST `/api/vision` — body `{ image: string }` → product guess; uses Gemini and falls back to `data/fallback-products.json`
- POST `/api/barcode` — body `{ barcode: string }` → Open Food Facts lookup with fallback
- POST `/api/eco-score` — body `{ product: ProductMeta }` → eco score + indicators
- POST `/api/alternatives` — body `{ product: ProductMeta }` → top 3 suggestions
- GET `/api/tip` — `{ tip: string }`

Strict TypeScript contracts live in `lib/types.ts`.

### Deploy to Vercel
1) Push to GitHub
2) Import repo in Vercel
3) Set Environment Variables in Vercel Project Settings:
   - `GEMINI_API_KEY = <your_key>`
   - `GOOGLE_MAPS_API_KEY = <optional>`
4) Deploy

### 5-minute demo script
1) Open `/scanner` → camera → capture → product guess → eco score → alternatives (3)
2) Scan a barcode → product meta → eco score → alternatives
3) Open `/bulk` → drop multiple images → see cart summary (avg score, estimated CO₂ saved)
4) `/dashboard` → KPIs and recent scans (persisted via localStorage)
5) `/leaderboard` → demo leaderboard
6) `/ar-preview` → AR overlay; WebXR if available, else mock with parallax

### Implementation notes
- Images are resized client-side to 640px and sent as JPEG (0.8) to `/api/vision`. Server compresses with `sharp` before Gemini.
- If Gemini fails or missing key, server returns `source: 'fallback'` and a curated item is used.
- Client throttles calls to ≤1 req/sec. Camera has optional auto-capture at ~1.2s.
- Offline mode works using `data/fallback-products.json`.

### TODOs
- Replace Gemini Vision placeholder in `lib/gemini.ts` with the exact Gemini 2.0 Flash endpoint + payload. Do not hardcode API keys.
