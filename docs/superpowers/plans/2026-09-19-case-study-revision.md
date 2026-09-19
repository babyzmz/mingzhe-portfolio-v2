# Project case studies — revision plan

**Approved scope:** Address the owner's feedback that both project-detail entry points have no animation and too little understandable content. Retain the approved homepage narrative, all nine projects, offline edition and bilingual presentation.

## Diagnosis
- Both entry points call `showCase()` in `src/main.ts`.
- `showModal()` and `close()` currently have no transition lifecycle.
- `renderCase()` produces a small, text-only dialog based on one summary and short technical bullets.
- Existing tests check visibility and text presence, not real motion or understandable case-study structure.

## Execution
- [x] Add failing tests for actual opening/closing animation and bilingual case-study sections.
- [x] Create source-grounded, plain-language case-study copy for all nine projects. Expand the four ongoing AI projects; distinguish illustrative use flows from tested sessions. The original Dreambound HTML can be read; its referenced game JS was not present at the requested public path. Do not advertise a playable build.
- [x] Render a large, responsive editorial case sheet with original project art, reading navigation, functional explanations, illustrative workflow, developer contribution, glossary, evidence and limits.
- [x] Implement a reusable dialog controller with an opening/closing state machine, origin-aware entry, staggered reveals, section reveals within the dialog scroll container, animated project-to-project transitions and animated glossary expansion.
- [x] Preserve focus, page scroll, native modal semantics and reduced motion. Handle close-during-open, rapid project switches and destroyed animation promises.
- [x] Verify both homepage and archive entry points, 18 localized cases, keyboard/escape/backdrop, mobile layouts, disabled WebGL and offline build. Inspect screenshots and record real open/close/reading interactions.
- [x] Package updated standalone HTML, source and static site. Report only tests actually run; keep previous GPU/Vite limitations explicit.

## Boundaries
No native project runtime tests, private-source redistribution, fabricated screenshots, feature claims, credentials or deployment. No changes to upstream GitHub main.
