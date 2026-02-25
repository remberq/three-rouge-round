---
name: spec-first
description: Before code changes, ensure there is an EP and docs are updated; treat docs as system-of-record.
---

# Spec-first workflow

1. Check `docs/STATUS.md` for active EPs.
2. If the work is non-trivial: create/update an EP in `docs/exec-plans/active/`.
3. Make changes.
4. Update `docs/WORKLOG.md` with decisions.
5. Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm docs:lint`.
