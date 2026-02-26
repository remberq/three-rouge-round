# EP-0003: Render + animations (Pixi consumer)

## Goal

Build a minimal but correct **render/animation layer** (PixiJS) that **consumes**:
- match-3 rules output
- combat resolver event queue

…and plays a coherent animation sequence for a player move:
1) swap
2) highlight matches
3) clear
4) drop
5) spawn
6) repeat for cascades
7) show damage + update HP HUD
8) show enemy attack

## Non-goals

- Fancy VFX/sound/polish.
- Menus/metaprogression.
- Rewriting match-3/combat rules.

## Current state

- Pixi placeholder board exists.
- match-3 rules engine exists.
- combat resolver exists (events + state).
- match-3 resolve steps currently include matches/clears/spawns, but **do not yet provide drop/spawn movement mappings** required for precise animation.

## Approach

- Add a render module structure under `apps/web/src/render/`:
  - `board/` (BoardView + TileSprite + input + layout)
  - `animations/` (queue + step builders + easing)
  - `hud/` (HP + turns)
- Keep render as consumer:
  - On swap intent: call `resolvePlayerMove`.
  - Build an animation script from `{ swapResult, events }`.
  - Update view incrementally; commit state only after queue completes.
- Extend match-3 output minimally if needed:
  - Add movement mappings to cascade steps (drops/spawns) so render can animate deterministically.

## Decisions

- Keep tile visual mapping in render only (colors/textures keyed by TileId).
- Input is disabled while animation queue is running.
- Start with simple tweens on Pixi ticker (no extra deps).

## Tasks

- [x] Create render folder structure per issue.
- [x] Implement BoardView (stable sprites; pooled; no per-frame recreation).
- [x] Implement input: click-select + drag-swap; emit swap intent.
- [x] Implement AnimationQueue + basic steps (swap, highlight, clear, drop, spawn, damage popup).
- [x] Implement HUD (hero/enemy hp + turnCount).
- [x] Wire `main.ts` to maintain `currentCombatState` and run queue.
- [x] Extend match-3 resolver step data to include drops/spawns mapping.
- [x] Update docs: `docs/design-docs/animation-pipeline.md` and `architecture-layers.md`.
- [x] Run gates: `pnpm lint/typecheck/test/docs:lint`.

## Tests

- Mostly smoke/manual in dev.
- Unit tests only for pure helpers (easing/layout calc) if needed.
