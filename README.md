# BoDiGi IWork — Fullstack Scaffold (Odds Calculator + Video Portfolio)

This repo includes:
- Frontend (Vite + React): Odds Calculator + Video Portfolio
- Backend (Express + Drizzle + Neon/Supabase)
- Shared schema via `@shared/schema`

## Quick Start
```bash
npm i
cp .env.example .env
# set DATABASE_URL or SUPABASE_URL
npm run dev
```

Frontend: http://localhost:5173  
Backend:  http://localhost:3001

## GitHub Push
```bash
git init
git add .
git commit -m "feat: scaffold with odds calc + video portfolio"
git branch -M main
git remote add origin https://github.com/<YOU>/<REPO>.git
git push -u origin main
```

## Notes
- Do not edit `dist/` (build output).
- Update `public/portfolio.json` with your embed URLs.
