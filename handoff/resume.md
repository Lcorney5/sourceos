# How to Resume Work

*(part of the [handoff folder](./README.md))*

- `npm install`, copy `.env.local.example` → `.env.local` and fill in real
  values.
- `npm run dev` — public pages work with no env vars; `/dashboard/*` needs
  Supabase configured. Sentry/PostHog are optional (no-op if unset).
- Before committing: `npx tsc --noEmit` then `npm run build` — both must be
  clean. Still no CI, these remain the only gate.
- Deploys are automatic on push to `main` via Vercel's GitHub integration.
- **Local tooling already present on this machine** (not project-scoped,
  don't reinstall): `ffmpeg` (installed via `winget install Gyan.FFmpeg`, add
  its bin dir to PATH manually in a fresh shell — see recent session history
  for the exact path), and a cached headless Chrome build used by the
  `hyperframes` npm package for video rendering.
