# Verification record — initial visual delivery

This records tests of **the new portfolio**, not tests of native Fairy, Mojo services or archived applications.

## Executed successfully

| Check | Result |
|---|---|
| TypeScript compilation and offline build | `node scripts/build-preview.mjs` completed; produced static and single-file editions |
| Pure camera/content tests | 9 passed, 0 failed |
| Standalone-bundle checks | 2 passed: real classic-script parsing; no external script/style dependencies; embedded CV |
| Static-server subpath checks | 5 real HTTP 200 responses, with HTML/CSS/JS/SVG/PDF MIME and payload checks under `/mingzhe-portfolio/` |
| Real Chromium interaction checks | 36 passed, 0 failed; recorded renderer: `software-3d` |
| Motion-control regression | 3 assertions passed after fixing an overly broad selector that also matched the HTML state attribute |
| Persisted-page lifecycle regression | Passed after preserving the rendering controller during a persisted `pagehide`; this is an event-handling simulation, not an end-to-end browser-cache navigation |

The browser suite verifies the actual document, visible headings and all nine records; camera Z moved from **7 to -25** and returned; EN/ZH controls; nine case dialogs with source and limitation sections; Escape and focus return; CV payload/file presence; 5/4/9 project filters; mobile overflow and navigation; reduced motion; and readable static fallback after simulated context failure. It observed no uncaught JavaScript errors.

Actual screenshots were inspected at 1440×1000 and 390×844; additional 768×1024 views were checked. Continuous camera travel was recorded from Chromium's screencast API. Screenshots used paused animation for legibility and repeatability; the tour uses moving scenes. Video encoding does not imply that every encoded frame was a newly rendered GPU frame.

## Environment and unverified paths

- This environment cannot install npm dependencies or download a repository archive. The provided package dependencies and GSAP adapter are source-level integration only. **`npm install` and the Vite/GSAP production build were not executed.** No fake lockfile was generated.
- The managed Chromium policy blocks HTTP/file navigation and exposes no WebGL context. Tests load the actual standalone HTML through `page.set_content`; policy was not changed. **GPU shader compilation, GPU frame rate and context restoration on physical hardware remain unverified.**
- The software fallback performs true mesh projection and triangle rasterization using the same camera and lower-detail geometry. Its shading/antialiasing is an approximation and is not a preview of exact GPU material quality.
- Desktop/file double-click launch, deployed-host navigation, actual browser back/forward cache, storage persistence on a real origin, mobile device performance and Safari/Firefox were not tested in this constrained browser.
- CV file content and data URI presence are checked; browser download UX must be checked in a normal browser. Clipboard has an honest fallback; system clipboard permissions vary.
- No Lighthouse score, WCAG certification, security audit certification, FPS guarantee, “perfect on all devices” claim or real project-release approval is made.
- No GitHub push or deployment was performed. External links use inspected source URLs but have not all been freshly fetched through a normal public-browser session.

## Before a public release

1. Open the standalone preview on the target Windows/macOS computer. Confirm `REAL-TIME RENDER` when WebGL is available and compare each chapter visually.
2. Install dependencies, run `npm run build`, preview `dist/`, and check the live GSAP backend, rapid/reverse scroll, deep-link reload and resizing.
3. Check real PDF download, email/copy, persistence, keyboard navigation, page return and reduced-motion behaviour in the intended browsers.
4. Review the owner-supplied biography and personal contribution wording. Replace labelled schematic graphics only with authentic screenshots/recordings when available.
5. Reintegrate original game assets from the old repository before offering a playable Dreambound link. Keep old server/native projects source-only until actual live URLs or releases are supplied.

## Commands

```sh
node scripts/build-preview.mjs
node scripts/test.mjs
node --test tests/bundle.test.mjs
python tests/browser.py
python tests/motion-control-regression.py
python tests/page-lifecycle.py
```

Browser result details are in `docs/verification/browser-results.json`. The separate tour is a 28.5-second MP4 recorded from the software renderer and preserves actual capture timing.
