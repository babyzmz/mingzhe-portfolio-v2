# React Bits atmosphere integration — 2026-09-23

## Requested placement
- LightPillar: the existing five-station 3D story, softly shifted toward the models, no divider.
- CircularText: only the top-left navigation logo; original MZ remains fixed in the centre.
- BorderGlow + SpotlightCard: all nine `#work` project cards, muted accent on light surfaces; keyboard focus stays visible and touch never depends on hover.
- DarkVeil: shared viewport coordinates from `#about` through contact and footer. No added section and no separate footer stripe.

## Source and adaptation
The exact upstream React Bits files were fetched from commit `c5df8610c0b47d7cd805cda480baba402f7267c1`; per-file SHA256 is in `upstream.json`. The shader bodies are adapted, not replaced with unrelated gradients. The website is vanilla TypeScript, not React; the original React/Three/OGL lifecycle is replaced by a native WebGL controller. BorderGlow's rectangular edge proximity and cursor-angle logic is combined with SpotlightCard's local pointer radial gradient. CircularText uses letter positioning with CSS rotation, preserving the centre logo.

Copyright (c) 2026 David Haz, MIT + Commons Clause. Full upstream notice is included in source HTML and `public/third-party/react-bits-license.txt`. These adaptations are used as part of this website, not redistributed as a standalone component library.

## Resource bounds
One additional WebGL canvas serves both backgrounds (at most two contexts including existing model scene). Pillar uses 40 raymarch / 2 wave iterations on desktop and 24 / 1 on mobile; reduced canvas resolution is capped at 960×640. Additional background renders are limited to at most 30/s desktop and 24/s small viewports, independently from foreground model rendering. This is a budget, not a measured hardware-performance claim.

No background frames while `#work` is the only visible region, document is hidden, or a project/evidence dialog is open. Reduced motion gives a still background, stops the ring, and leaves card focus cues. WebGL failure/context loss exposes a static CSS fallback. Resizing and locale replacement reuse the persistent canvas. Public media, project data, CV and playable demo files are unchanged.

## Verification
- `npm run build:offline`
- `npm run build`
- `npm test`
- `node --test tests/bundle.test.mjs`
- `npm run privacy-check`
- `python tests/local-sync.browser.py --serve`
- `python tests/atmosphere.browser.py`
- `python tests/atmosphere.browser.py --fallback`

New rendering checks must run on the built site over HTTP. Local sandbox cannot navigate HTTP or acquire WebGL; its fallback captures are not GPU acceptance. GitHub-hosted Chromium/SwiftShader provides actual shader compile/draw validation, not physical-device frame-rate certification. Final run IDs and screenshot artifacts are recorded at delivery.
