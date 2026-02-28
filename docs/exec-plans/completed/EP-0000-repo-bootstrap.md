# EP-0000: Repo bootstrap + Harness Engineering

## Goal

Create a working scaffold for a PixiJS+TS web app and install a “repo-as-memory” harness:
- docs as system-of-record
- execution plans
- mechanical enforcement (docs-lint + CI)

## Non-goals

- Implement real match-3 rules.
- Implement combat systems.
- Build production art pipeline.

## Current state

- Empty repository.

## Approach

1. Create doc system-of-record (`docs/`), indices, and EP structure.
2. Add minimal web app (`apps/web`) using Vite + TS + Pixi v8.
3. Add quality gates: ESLint + Prettier + Vitest + TypeScript typecheck.
4. Add `scripts/docs-lint.mjs` and CI to enforce docs + checks.

## Decisions

- Use `pnpm` workspaces with a single app at `apps/web`.
- Keep game logic isolated under `apps/web/src/game` (pure) and rendering under `apps/web/src/render` (Pixi).

## Tasks

- [x] Create docs structure + indices.
- [x] Add EP skeleton and link from `docs/STATUS.md`.
- [x] Create Vite app under `apps/web`.
- [x] Add Pixi board placeholder (8x8).
- [x] Add eslint/prettier/vitest/typecheck scripts.
- [x] Implement docs-lint.
- [x] Add GitHub Actions CI.
- [x] Ensure all checks pass.

## Tests

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm docs:lint`
