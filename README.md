# Personal Growth OS

A daily training system for communication, confidence, leadership, thinking and networking.
**Learn something. Practise it. Apply it. Reflect. Get better. Come back tomorrow.**

Mobile-first web app (installable PWA) built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Drizzle ORM and PostgreSQL (Neon in production, embedded PGlite locally).

- Architecture, ERD, API, auth/RBAC strategy, risks and test plan: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- Database schema: [`src/server/db/schema.ts`](src/server/db/schema.ts) · migrations in [`drizzle/`](drizzle)

## Quick start (no setup needed)

```bash
npm install
npm run db:setup      # migrate + seed into ./.data/pglite (real Postgres in WASM)
npm run dev           # http://localhost:3000
```

Register at `/register`. To get the admin panel, either add your email to `SUPER_ADMIN_EMAILS` in `.env.local` **before** registering, or run `npm run admin:grant -- you@example.com SUPER_ADMIN` (stop the dev server first when using PGlite).

## Production (Neon)

1. Create a Neon project and copy both connection strings into the environment:
   `DATABASE_URL` (pooled, `-pooler` host) and `DATABASE_URL_UNPOOLED` (direct).
2. `npm run db:setup` — applies migrations over the direct connection and seeds content (idempotent; never overwrites CMS edits unless run with `-- --force`).
3. Set `APP_URL`, `SUPER_ADMIN_EMAILS`, and optionally `ANTHROPIC_API_KEY`, `GOOGLE_CLIENT_ID/SECRET`, `RESEND_API_KEY`, `CRON_SECRET` (see [`.env.example`](.env.example)).
4. `npm run build && npm start`, and schedule `GET /api/cron/notifications` (e.g. every 15 min) with `Authorization: Bearer $CRON_SECRET`.

Secrets are only read on the server; nothing sensitive is exposed to the browser.

## Optional integrations

| Variable | Without it | With it |
|---|---|---|
| `ANTHROPIC_API_KEY` | Coach answers from the content library ("playbook mode"); simulators follow a script; feedback comes from the rules engine | Claude coach that knows the learner's plan, progress and missions (streaming); simulators improvise in character; AI-written feedback on conversations and presentations |
| `GOOGLE_CLIENT_ID/SECRET` | Google button hidden | Sign in with Google (PKCE) |
| `RESEND_API_KEY` | Emails (password reset, reminders) are printed to the server log | Real email delivery |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm test` | Unit + integration tests (Vitest, in-memory Postgres) |
| `npm run test:e2e` | Playwright end-to-end suite at 390×844 (`E2E_PROD=1` to run against the production build) |
| `npm run typecheck` · `npm run lint` | Static checks |
| `npm run db:generate` | New migration from schema changes |
| `npm run db:migrate` · `db:seed` · `db:setup` | Database |
| `npm run admin:grant -- <email> <ROLE>` | Grant SUPER_ADMIN, ADMIN, CONTENT_MANAGER or COACH |

## Content

45 original lessons across 5 journeys (Communication Mastery, Confident Presence, Lead the Room, Sharper Thinking, Connect with Anyone), 22 practice tools and 24 library resources, all editable in the admin CMS. Expert insights paraphrase established work with attribution; there are no invented quotes or statistics.
