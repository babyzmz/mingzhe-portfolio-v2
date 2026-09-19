# Systems in Motion Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement each task and verify the actual output.

**Goal:** Deliver a source-grounded cinematic bilingual portfolio and an offline runnable visual preview.

**Architecture:** Static semantic HTML with a modular TypeScript application. An original WebGL renderer reads a pure camera state; one motion controller owns that state, with native and GSAP adapters. Content and case studies are independent of rendering.

**Tech Stack:** TypeScript, WebGL, GSAP/ScrollTrigger (optional installed build), Vite, Node, Chromium/Playwright.

**Spec:** `docs/superpowers/specs/2026-09-18-portfolio-design.md`

## Global Constraints
No invented outcomes. Nine project records, all bilingual. No private repository paths, source text or font files in public assets. Offline preview uses native scroll backend and does not claim GSAP test coverage. No network writes.

### Task 1 — Content and camera contract
Files: `src/content.ts`, `src/state.ts`, `tests/state.test.mjs`, `tests/content.test.mjs`.
Interfaces: `sampleCamera(t): CameraPose`; `normaliseLocale(value): Locale`; `projects: Project[]`.
- [x] Write tests for finite camera endpoints, monotonic forward Z, reversibility, clamp; 9 unique projects with bilingual content, sources and non-invented statuses.
- [x] Run `node --test tests/*.test.mjs` and record failure before implementation.
- [x] Implement the pure modules; compile with `tsc --outDir .test-build` and rerun tests.

### Task 2 — Readable site and interactions
Files: `index.html`, `styles/site.css`, `styles/story.css`, `styles/responsive.css`, `src/main.ts`, `src/views.ts`.
Interfaces: `renderSite(locale): string`; events use `data-case`, `data-locale`, `data-motion`.
- [x] Add browser tests for language, nine projects, native modal, chapter links, CV and reduced motion.
- [x] Render complete semantic content before adding graphics; implement localStorage with try/catch, modal focus return and clipboard fallback.
- [x] Verify 390px and 1440px layouts.

### Task 3 — Spatial narrative
Files: `src/math.ts`, `src/geometry.ts`, `src/shaders.ts`, `src/scene.ts`, `src/motion.ts`, `src/gsap-adapter.ts`.
Interfaces: `createScene(canvas): {render(pose,time),resize(),dispose()}`; `MotionController` owns progress.
- [x] Verify actual rendered screenshots and assert camera Z advances/reverses in the browser.
- [x] Implement mesh buffers, matrix projection, polished procedural studio material, hero toroidal sculpture, Fairy optical eye, layered core, twin panels and workflow nodes.
- [x] Wire optional GSAP without two writers; native backend is the offline route.
- [x] Test renderer failure, reduced motion, reversal, and persisted lifecycle event handling; document native GPU restoration as unverified.

### Task 4 — Delivery
Files: `scripts/build-preview.mjs`, `scripts/serve.mjs`, `vite.config.ts`, `README.md`, `docs/VERIFICATION.md`, `docs/CONTENT_AUDIT.md`.
- [x] Build via installed TypeScript and native Node build script, without npm downloads.
- [x] Run full Chromium tests; inspect screenshots and fix visible errors.
- [x] Export screenshots and preview video; package source and ready-to-serve site without font binaries or private material.
- [x] Document exact verification scope and runtime/library restrictions; do not deploy.

## Final scope notes
The executed browser renderer was the labelled software 3D fallback. GPU context restoration and origin-based storage persistence are not certified by these checks. The optional installed GSAP/Vite path remains unexecuted. The case archive retains old project records, not missing original runtimes. Exact coverage is recorded in `docs/VERIFICATION.md`.
