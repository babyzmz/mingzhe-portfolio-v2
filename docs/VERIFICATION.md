# Verification record — v2.1 animated project case studies

This tests **the portfolio website**, not native Fairy, Mojo services or archived app runtimes. The initial delivery report is retained at `verification/initial-delivery.md`.

## Executed against the revised standalone build

| Check | Result |
|---|---|
| TypeScript compilation and offline build | Completed; regenerated `preview/` and the standalone HTML |
| Module, bilingual content and camera-state tests | 12 passed, 0 failed |
| Standalone-bundle tests | 2 passed, 0 failed |
| Project-detail browser checks | 83 passed: core 25, EN 18, ZH 19, edge cases 5, responsive 16 |
| Rapid interaction and background-render checks | 5 passed |
| Existing homepage browser regression | 36 passed, 0 failed; renderer observed: `software-3d` |
| Motion-control selector regression | 3 assertions passed |
| Persisted-page lifecycle event regression | Passed; simulated lifecycle events, not real browser-cache navigation |
| Static-server subpath resources | 7 HTTP 200 responses with MIME/payload checks under `/mingzhe-portfolio/` |

Detail tests assert real running browser animations and changing computed transforms, not merely the existence of animation CSS. They cover both story and archive entry points; exit animation before native dialog closure; background scroll lock; focus return; all eighteen localized articles; chapter jumps and reading progress; staggered section reveals; animated glossary height; next/previous cases; locale replacement; Escape/backdrop; close during opening; and reduced motion. Responsive viewports: 320×720, 390×844, 768×1024 and 844×390.

The stress suite reproduced and then guarded a stale glossary-animation completion during rapid reversals. It also compares real canvas captures to verify that background rendering pauses while the reader is open and resumes afterwards. Keyboard focus remains inside the native modal.

The browser suite is split into five commands because a long combined invocation can exceed this tool environment's execution limit. The final counts above come from the completed partition result files, not interrupted attempts. Details are in `verification/v2.1/`.

## Visual evidence

Desktop and phone screenshots were inspected. The separately delivered `Mingzhe-Portfolio-v2.1-Details-Tour.mp4` is approximately 20 seconds of actual Chromium interactions, captured with browser screencast timestamps. It shows opening a Fairy case from the narrative, scrolling sections, glossary expansion/collapse, closing, opening MojoCore from the archive, next-project transitions and locale switching. Encoded video FPS is not a GPU rendering benchmark.

## Environment and remaining limits

- New reader motion uses browser Web Animations API and IntersectionObserver. It does not depend on WebGL, optional GSAP, network assets or model keys. **Animations were observed in the actual delivered standalone build**, including with the 3D renderer unavailable.
- Managed Chromium does not expose a WebGL context and restricts URL navigation. Tests load the actual standalone document with `page.set_content`; no policy was changed. Exact GPU materials, GPU shader compilation/frame rate and physical-device performance remain unverified.
- `npm install` and the Vite/GSAP production path were not executed for this revision. The offline TypeScript builder and native-scroll preview were executed. No invented dependency lockfile is supplied.
- HTTP subpath checks are real local HTTP resource requests, not a deployed-host browser navigation test. Double-click launch, real-origin persistence, physical mobile browsers, Safari/Firefox and browser back/forward cache need target-device acceptance.
- Source notes and example use flows do not certify native applications, model performance, live connectors, customer usage or a public Beta release. Original desktop/server/game runtime files are not included.
- No GitHub push, `main` update or deployment was performed. This is a replacement local delivery package.

## Reproduce

```sh
node scripts/build-preview.mjs
node scripts/test.mjs
node --test tests/bundle.test.mjs
python tests/details.browser.py core
python tests/details.browser.py cases-en
python tests/details.browser.py cases-zh
python tests/details.browser.py edge
python tests/details.browser.py responsive
python tests/details-stress.py
python tests/browser.py
python tests/motion-control-regression.py
python tests/page-lifecycle.py
```

Python browser tests require Playwright and a Chromium executable; the tested environment used `/usr/bin/chromium`. Consult each test for executable overrides. Start the local server with `node scripts/serve.mjs`; its optional `PREFIX` value is a path **without a trailing slash**, for example `/mingzhe-portfolio`.

## Before publication

Review the owner's contribution wording and disclosure boundaries, exercise both detail entrances on target devices, check live source links and CV download, then separately install/build/verify the intended Vite edition if using it. Keep early project records source-limited until actual runtimes, screenshots or verified releases are supplied.

---

## 2026-09-19 — real Windows runtime, real HTTP and real-project verification

This round moved the site from a display draft toward evidence-backed cases. All checks ran on the owner's Windows machine against real local servers; **no GitHub push, repository creation, Release, deployment or paid model call was performed**, and no media was published into `public/media/` (the approved-media registry is still empty by design).

### Portfolio site itself (installed Vite + GSAP, real HTTP)

Environment: Node.js v22.23.2, npm 10.9.8, installed Google Chrome 153 (Playwright drives the real Chrome executable, not `set_content`), WebGL renderer reported as `ANGLE (NVIDIA GeForce RTX 5060 Ti, D3D11)`.

| Check | Result |
|---|---|
| `npm run typecheck` | PASS, 0 errors |
| `npm test` (offline compile + node suites) | 41 passed, 0 failed |
| `node --test tests/bundle.test.mjs` | 4 passed, 0 failed |
| `node --test tests/serve-range.test.mjs` | 4 passed, 0 failed (200, 206, suffix range, 416) |
| `npm run build` (Vite) then `npm run build:offline` | Both PASS; three deliverables regenerated |
| `npm run privacy-check` (new gate) | PASS over `dist/`, `preview/`, standalone HTML — no `.handoff-private` references, local user paths, loopback URLs or secret patterns |
| `tests/browser.py` over real HTTP | PASS on both the offline static server (8765) and the Vite build under `/mingzhe-portfolio/` (8766) |
| `tests/details.browser.py cases-zh` over real HTTP | PASS on both servers |
| `tests/media-behavior.browser.py` (new) | 25/25 PASS on the Vite build |
| Single-file flag | Verified in a browser: the standalone single-file edition (served on a local port) exposes `window.__PORTFOLIO_SINGLE_FILE__=true` and suppresses real-media rendering; the networked build does not define the flag |

The media suite uses ffmpeg-generated fixtures (mp4 + poster) injected through a test-only `window.__PORTFOLIO_TEST_MEDIA__` seam; the production registry is untouched. It verifies over real HTTP: card/hero cover swap only for approved screenshots, withheld media never rendering, broken-media fallback state and message, gallery video never autoplaying, lightbox playback and seek with observed `206 Partial Content` + `Content-Range`, first Escape closing only the lightbox, second Escape closing the case, arrow navigation pausing the previous video, locale switch / project switch / scrolling out of view all pausing playback, and zero unexpected console errors. A real fallback bug was found and fixed in this round (the broken-media note kept its `hidden` attribute and never became visible).

The local static server now sends correct MIME types for media, `Accept-Ranges: bytes`, single-part `Range` (including suffix ranges), `416` for invalid ranges, and security headers; it binds to 127.0.0.1 only.

### Real project programs (evidence captured locally, not yet published)

| Project | What was actually run | Result | Public-facing status |
|---|---|---|---|
| Fairy | Real native Tauri/React desktop window (V3, branch `codex/fairy-stability-recovery`), driven through its DevTools protocol; PrintWindow frame recording | 31 native stills across Files, Obsidian, Preview, all Settings sections, responsive 399 px; 42 s real walkthrough (permissions gates, Skills/MCP, masked model keys, privacy statements, honest "browser worker stopped" state) | Candidates held privately pending owner approval and rail-crop decision; existing public repo link retained |
| Dreambound Realm | Local Canvas/WebGL2 original served over HTTP; full title → combat → death → run-end loop | PASS with zero console/HTTP errors; GPU renderer confirmed; non-trivial canvas pixels sampled | Reviewed static build restored locally into `public/demos/dreambound/` (the missing `js/core/game.js` included) and re-verified through the portfolio server; "Try it" stays hidden until the owner approves publishing the files |
| Mi Format Converter | The owner's already-built PyInstaller release exe was launched; all four modules navigated and captured via native window capture | PASS for image, video, m4s merge and PDF modules; bundled ffmpeg binary runs (`-version`) | Release/download not approved; GPL notice for bundled FFmpeg required; exe and ffmpeg SHA-256 recorded privately; end-to-end transcode test still pending |
| AI Tarot Reports | Next.js dev server, full form → shuffle → three-card draw → report API (201) → A–F report flow | PASS with the documented mock-polishing switch and in-memory store (no key, no paid call, no database) | Backend/deployment requirements documented; Postgres-backed persistent form not run; upstream favicon 404 and duplicate React key recorded as findings |
| Web Change | Isolated Python venv: unit tests, live fetch of a real external site, two-pass semantic monitor against a local fixture site; Vite renderer in real Chrome | pytest 8/8; semantic PriceDrop ¥329→¥299 (confidence 0.93) with alert written; renderer build green; 7 UI views captured | UI stills are renderer-only and must be captioned as such; Electron shell not captured because it unconditionally starts downloading multi-GB local models on boot (run was stopped); two packaging findings recorded, no changes made to that repository |
| Goodnight Store | UI-only Next.js build served and exercised in a browser | PASS: storefront, product cards, long page, zero errors; product images carry SAMPLE watermarks | Owner must choose between the UI-only build and the full backend build (the latter contains real secrets/data and was not read or run); no checkout/payment capabilities will be claimed |
| MojoCore / MojoClaw / MojoAX | Searched the authorised development root by name and content | No matching local source found | Blocked on owner-supplied paths; labelled architecture illustrations remain, no fabricated GUI evidence |

### Reproduce the local verification (Windows, PowerShell)

```powershell
npm ci
npm run typecheck
npm test
node --test tests/bundle.test.mjs
node --test tests/serve-range.test.mjs
npm run build
npm run build:offline
npm run privacy-check
# terminal A: node scripts/serve.mjs                         (preview, 8765)
# terminal B: $env:PORT='8766'; $env:PREFIX='/mingzhe-portfolio'; node scripts/serve.mjs --dir dist
$env:PORTFOLIO_TEST_URL='http://127.0.0.1:8765/';            python tests/browser.py
$env:PORTFOLIO_TEST_URL='http://127.0.0.1:8766/mingzhe-portfolio/'; python tests/browser.py
$env:PORTFOLIO_TEST_URL='http://127.0.0.1:8766/mingzhe-portfolio/'; python tests/details.browser.py cases-zh
python tests/media-behavior.browser.py   # expects both servers plus a single-file server on 8767; see script header
```

Python browser tests use Playwright with the installed Chrome (`browser_support.py` resolves well-known Chrome paths; `CHROMIUM_PATH` overrides). The earlier note about `/usr/bin/chromium` describes the original Linux delivery environment only.

### Still not verified / explicitly out of scope for this round

- No remote action of any kind: no repository created or pushed, no source made public, no Release, no Pages deployment, no iframe, no online demo button enabled.
- No public media: every real capture stays in the git-ignored private handoff area pending per-item approval, cropping and compression.
- MojoCore/Claw/AX need authorised source paths; the full Goodnight build needs an owner decision plus a secret scan; the Web Change Electron shell needs an opt-out gate for model downloads before capture; the Converter needs a real transcode test and FFmpeg licence text; Tarot needs a deployed database to be more than a local mock session.
- Safari/Firefox, physical mobile devices, signed installers and installer smoke tests remain unverified.

---

## 2026-09-19 (later) — public repository, GitHub Pages go-live and playable Dreambound demo

With the owner's explicit authorisation ("other required operations are authorised; continue completing the site"), the approved evidence and the recovered Dreambound build were published. MojoCore/Claw/AX remain private/illustrative; other local projects received preview-only integration with no changes to their own code or UI.

**Remote artefacts**

- Public repository: https://github.com/babyzmz/mingzhe-portfolio-v2 (default branch `main`; the old `babyzmz/mingzhe-portfolio` repository is untouched and remains the project record).
- Live site (GitHub Pages, build type `workflow`, manual `workflow_dispatch` only): https://babyzmz.github.io/mingzhe-portfolio-v2/
- Live playable demo: https://babyzmz.github.io/mingzhe-portfolio-v2/demos/dreambound/index.html
- Deployments (all `success`): Actions runs 35420414859 (initial), 35420729042 (demo link enabled), 35421261206 (evidence-synced copy), 35421982693 (standalone gating fix).
- CI workflow `.github/workflows/ci.yml` runs on push and is green on `main` (run 35421932940): it builds both editions before the bundle tests (which require their artifacts). The Pages workflow never deploys automatically.
- The standalone single-file edition is pre-rendered with the media gate (`renderSite(lang, {singleFile:true})`), so its offline HTML contains zero `./media/` references; bundle tests 4/4 and a real-browser smoke of the standalone file pass.

**What was published**

- 27 approved real screenshots plus one 1280×826 screen recording (`public/media/`, ~6 MB total). Fairy conversation rails are cropped or blurred; the Fairy walkthrough has its left rail box-blurred for its full duration; no chat content, keys, database dumps, `.env` files or model weights are included. Goodnight uses the UI-only build with SAMPLE-watermarked supplier imagery; Web Change stills are renderer-only; Tarot is explicitly the mock/in-memory mode; Converter stills show an empty workspace.
- The Dreambound static build (62 files, 8.54 MB), recovered from the local original including the `js/core/game.js` that returns 404 in the older public copy.
- `scripts/privacy-check.mjs` runs in CI and before deployment; a pre-push scan and the remote contents API confirmed `.handoff-private/` is neither tracked nor served.

**Live acceptance over the public internet (real Chrome 153, no mocks)**

| Check | Result |
|---|---|
| Anonymous GET/HEAD of home, media, demo, CV PDF | 200 |
| `Range: bytes=0-1023` on `walkthrough.mp4` via `curl.exe` | `206 Partial Content`, `Accept-Ranges: bytes`, `Content-Range: bytes 0-1023/211298` |
| Dreambound full loop on the live URL (WebGL ANGLE/D3D11) | Title → combat → HP 0 → Run Ended; ~15.4k non-dark canvas pixels; zero console errors and zero 4xx |
| `tests/browser.py` against the live URL | PASS |
| `tests/details.browser.py cases-zh` and `cases-en` against the live URL | PASS (assertions updated: Dreambound now shows one hosted demo button plus the quiet project-record link; other archive projects remain record-only) |
| Six-project gallery rendering check against the live URL | All hero images and gallery items decoded; zero console errors / failed responses; Fairy gallery contains 6 items including 1 video |
| Demo-link wiring check against the live URL | Dreambound case exposes exactly one primary "Live demo / 在线演示" link to the hosted demo plus the record link; Tarot exposes no demo button |
| `npm run typecheck` / `npm test` / build / `build:offline` / `privacy-check` | 0 errors; 41/41 node tests; all editions rebuilt; privacy gate PASS |

The case copy in `src/content.ts` was updated so descriptions match the verified evidence (Dreambound playable and hosted; Fairy real captures with blurred conversations; Web Change CLI + renderer evidence; Goodnight UI-only; Tarot local mock flow; Converter released exe launched, no transcode re-test). The site's source-notes panel states the same verification boundary.

**Still not done / explicitly not claimed**

- No Converter Release re-published (original release page offline; GPL notice for bundled FFmpeg required first); no end-to-end transcode re-test.
- No hosted Tarot/Goodnight/Web Change backend (database, payments, packaged Electron shell); no claims of live customers or services.
- Dreambound Unity 6 remake not built; character-art redistribution rights unconfirmed.
- MojoCore/Claw/AX source stays private; illustrations remain labelled.
- Safari/Firefox, physical mobile devices and signed installer smoke tests remain unverified.


