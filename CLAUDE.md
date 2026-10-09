# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Setup & commands

```
npm i
npm run prisma:generate   # regenerate Prisma client into src/generated/prisma
npm run db:init           # prisma db push (no migrations dir used — schema pushed directly)
npm run dev               # nodemon src/index.ts
npm run build              # prisma generate && tsc
npm run prisma:studio
```

Requires `DATABASE_URL` in `.env` (postgres connection string) and optional `PORT`. No test suite, no lint script configured.

Server runs at `http://localhost:<PORT>`, Swagger UI at `/api-docs`, raw OpenAPI JSON at `/api-docs/openapi.json`.

## Architecture

Layered, one stack per feature — **routes → validate(zod) → controller → service → repository → prisma**. Five features: `auth`(user), `gym`, `plan`, `member`, `payment`, each with matching files under `models/`, `validators/`, `controllers/`, `services/`, `repositories/`. All plain exported functions, no classes. Don't collapse layers when adding endpoints — follow the existing split even for trivial CRUD.

- **Prisma schema is split** across `prisma/schema/*.prisma` (one file per model + `base.prisma` for generator/datasource), not a single `schema.prisma`. `prisma.config.ts` points at the `prisma/schema` directory. Generated client goes to `src/generated/prisma` (gitignored) — regenerate with `npm run prisma:generate` after schema changes.
- **No migrations workflow** — schema changes go via `prisma db push` (`npm run db:init`), not `prisma migrate`.
- **Auth is hand-rolled**, not `jsonwebtoken`/`bcrypt`: `src/utils/jwt.ts` builds/verifies HS256 JWTs manually with `crypto.createHmac`; `src/utils/crypto.ts` does PBKDF2-SHA512 password hashing. `JWT_SECRET` env var, falls back to a hardcoded default if unset. Tokens carry no expiry.
- `authenticate` middleware (`src/middlewares/auth.ts`) sets `req.user` from the bearer token; applied per-router via `router.use(authenticate)` in gym/plan/member/payment routes (auth routes are public). `requireRole("owner")` gates gym/plan write endpoints. Role model is just `"owner" | "staff"`; staff are scoped to their own `gym_id`, owners can act across branches or filter by `?gym_id=`.
- **Money fields are `Decimal(10,2)`**; convert with `Number(...)` before arithmetic/JSON, as done throughout services/repositories.
- **Money-moving operations run inside `prisma.$transaction`** in the service layer (`member.service.ts:registerMember`, `assignPlanToMember`; `payment.service.ts:renewMembership`) — each mutates the member row and writes a corresponding `Payment` row (`payment_type: "registration"` or `"plan"`) atomically. Follow this pattern for any new flow that touches both a member/plan state and a payment record.
- **Soft-delete for Gym/Plan** (`is_active = false`), **hard-delete for Member** (cascades to Payments via the Prisma relation's `onDelete: Cascade`). Keep this distinction when adding delete endpoints.
- **Swagger docs are registered inline in each route file** via `registry.registerPath(...)` from `src/config/swaggerRegistry.ts`, right next to the route definitions — not centralized. New endpoints should add their registration in the same file as the route.
- WhatsApp reminder links (`payment.service.ts`) are built with a hardcoded India (`91`) country-code prefix assumption for 10-digit phone numbers.
