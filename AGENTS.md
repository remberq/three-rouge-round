# AGENTS.md

This repo is a **browser 2D game** (match‑3 + turn-based roguelike combat).

## Start here

- Docs hub (system of record): `docs/INDEX.md`
- Current status + active execution plans: `docs/STATUS.md`
- Active plans: `docs/exec-plans/active/`
- Web entrypoint: `apps/web/src/main.ts`

## Rules of engagement (Harness)

- **Plans are first-class:** before serious changes, create/update an EP in `docs/exec-plans/active/`.
- Keep `AGENTS.md` short; put detail in `docs/`.
- `rules/state` must be deterministic + testable without Pixi.

## Dev commands

See `CONTRIBUTING.md`.
