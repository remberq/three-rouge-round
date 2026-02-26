# Architecture layers

## Goal

Keep the game logic deterministic + testable without Pixi.

## Proposed layers

- **rules/state** (`apps/web/src/game`): pure functions, deterministic state transitions.
- **render** (`apps/web/src/render`): Pixi scene graph + animation timing.
- **ui** (`apps/web/src/ui`): input mapping, overlays, menus (later).

## Notes

Renderer consumes snapshots/events produced by rules.

### Render is a consumer

- `apps/web/src/game/**` is deterministic rules/state.
- `apps/web/src/render/**` renders and plays animations based on `SwapResult` + combat events.
- Render must not re-compute matches, cascades, or damage.
