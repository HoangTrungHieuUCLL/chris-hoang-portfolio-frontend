# Chris Hoang: Portfolio

Next.js (App Router, TypeScript, Tailwind) frontend for [chrishoang.dev](https://chrishoang.dev), an Apple-design-inspired personal portfolio. Talks to the FastAPI backend in `chris-hoang-portfolio-backend` for project data and the contact form.

## Local development

```bash
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at the backend
npm run dev
```

Runs at `http://localhost:3000`. Requires the backend (see the backend repo's `docker compose up`) for live project data; otherwise the Projects section falls back to an empty state.

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (e.g. `https://api.chrishoang.dev`) |

## Deployment

Deployed on [Railway](https://railway.app) from the `Dockerfile` (multi-stage build, Next.js standalone output). Set `NEXT_PUBLIC_API_URL` as a build-time variable in Railway pointing at the backend service's public URL.
