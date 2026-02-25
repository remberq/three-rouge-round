# Architecture layers

## Goal

Keep the game logic deterministic + testable without Pixi.

## Proposed layers

- **rules/state** (`apps/web/src/game`): pure functions, deterministic state transitions.
- **render** (`apps/web/src/render`): Pixi scene graph + animation timing.
- **ui** (`apps/web/src/ui`): input mapping, overlays, menus (later).

## Notes

Renderer consumes snapshots/events produced by rules.
