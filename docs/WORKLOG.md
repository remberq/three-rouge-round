# Worklog

Keep this short: decisions + noteworthy changes.

- 2026-02-25: Initialized repo scaffold and Harness Engineering structure (EP-0000).
- 2026-02-25: Implemented deterministic match-3 rules core (EP-0001): seeded RNG, swap validation, match detection, gravity+fill+cascades, and Vitest coverage.
- 2026-02-25: Implemented turn-based combat rules (EP-0002): event queue, stats/modifiers, damage formula (armor/marmor), enemy attacks every N turns, and match3→combat bridge (including harmful tiles).
- 2026-02-26: EP-0003 started: began render layer (Pixi) as a consumer + added match3 cascade movement mapping (drops/spawns) for precise animations.
