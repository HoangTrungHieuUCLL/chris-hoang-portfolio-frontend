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
| `LETTA_API_KEY` | Letta Cloud API key for the Pollux chat widget. Server-side only, never `NEXT_PUBLIC_`. |
| `LETTA_CHAT_AGENT_ID` | Chris's existing "Pollux" agent. Pre-filled in `.env.example`; don't point it at a different agent. |
| `LETTA_AUTO_APPROVE_TOOLS` | Tools Pollux may run without asking, comma-separated (or `*`). Left empty by default. |
| `POLLUX_COOKIE_SECRET` | Signs the per-visitor chat identity cookie. Generate with `openssl rand -hex 32`. Required. |
| `POLLUX_CHAT_RATE_LIMIT`, `POLLUX_CHAT_RATE_WINDOW_MS`, `POLLUX_CHAT_IP_RATE_LIMIT`, `POLLUX_BOOTSTRAP_RATE_LIMIT`, `POLLUX_BOOTSTRAP_RATE_WINDOW_MS` | Optional rate-limit tuning for the chat widget. Defaults in `.env.example` are reasonable. |

## Deployment

Deployed on [Railway](https://railway.app) from the `Dockerfile` (multi-stage build, Next.js standalone output). Set `NEXT_PUBLIC_API_URL` as a build-time variable in Railway pointing at the backend service's public URL. Set `LETTA_API_KEY`, `LETTA_CHAT_AGENT_ID`, and `POLLUX_COOKIE_SECRET` as **runtime** environment variables on the Railway service (the chat API routes read them at request time, not at build time - they don't need to be build-time args like `NEXT_PUBLIC_API_URL` does).

## Chat with Pollux

A floating chat widget (bottom-right corner, every page - `components/PolluxChatWidget.tsx`, added in `app/layout.tsx`) wired to Pollux, Chris's persistent Letta agent, built from the [Letta Agent SDK React Chat template](https://github.com/letta-ai/letta-agent-sdk-react-chat) and adapted for this site:

- **One continuous conversation per visitor**, not the template's multi-conversation sidebar - a floating widget doesn't need a conversation list, and it shrinks what has to be secured (see below).
- **The conversation ID is never sent by the client.** `app/api/chat/route.ts` reads it from (or writes it to) the caller's own signed, `HttpOnly` cookie only (`lib/security/visitor.ts`, HMAC-signed so a visitor can't forge or read another visitor's conversation). There is structurally no ID for a request to spoof.
- **Rate limited** (`lib/security/rate-limit.ts`, in-memory, per-visitor + per-IP) on both the chat and bootstrap routes, since this is a public, unauthenticated widget with no login.
- **The Letta API key never reaches the browser** - `app/api/chat/route.ts` runs with `export const runtime = "nodejs"`, and the browser only ever calls this app's own `/api/chat` route.

The full standalone version this was ported from (with its own deployment, multi-conversation UI, and more detailed security writeup) lives in `../pollux-chat/README.md` if useful as a reference; it's not part of this deployment.
