# Architecture (high level)

This repo keeps **game logic deterministic and testable** independently from rendering.

## Layers

- `apps/web/src/game/` — rules/state (deterministic). No Pixi. Unit tests in Vitest.
- `apps/web/src/render/` — PixiJS renderer (impure, time-based animation).
- `apps/web/src/ui/` — (later) UI glue (inputs, menus, HUD).

## References

- Docs hub: `docs/INDEX.md`
- Design: `docs/design-docs/index.md`
- State model: `docs/design-docs/state-model.md`
