# Mingzhe — Systems in Motion · v2.1

A bilingual personal portfolio for Mingzhe Zhang / Richie. This edition combines a continuous five-chapter 3D narrative with nine source-aware project cases, a development-method section, education and internship history, and the supplied current CV.

## v2.1 — 项目展开与说明更新

Both “deeper look” and archive cards now open the same animated case-study reader. Opening follows the clicked source with opacity/scale/position motion; close, Escape and backdrop finish an exit transition before returning to the page. Inside the reader are a sticky chapter index, reading progress, section/card reveals, animated glossary expansion, previous/next project transitions and EN/ZH switching. Background 3D rendering is suspended during reading and resumed afterwards. Reduced-motion preferences are honoured.

All nine projects have expanded bilingual explanations: what it is, who it is for, an illustrative workflow, concrete capability descriptions, the owner's development involvement, glossary, evidence and limits. Early projects remain source-limited rather than receiving invented features. This is a local revision, not a deployed update.

The reader's real animations use the Web Animations API; they work in the single-file edition without the optional GSAP install or WebGL. Final executed coverage is recorded in `docs/VERIFICATION.md`.

## 先看效果 / Quick preview

Open **`Mingzhe-Portfolio-Preview.html`** in a modern desktop browser. The single file contains its CSS, application code and the supplied CV. It does not download a framework, model, font or texture to start. External GitHub and email links still need their normal applications or internet access.

Scroll through the five chapters. Use **EN / 中** to change language, the right-hand chapter rail to jump between scenes, and the lower-right button to pause motion. Project cards open full case studies with contribution scope, evidence and current limitations. The Fairy controls change a **visual interpretation**, not a live native Fairy session.

The page selects WebGL when available, then a labelled software 3D renderer, then a static CSS illustration. Software rendering uses the same meshes and camera path but lower-detail geometry and approximate lighting. It is not a GPU-performance preview. The motion toggle freezes continuous animation and substitutes discrete chapter views.

### Serve the ready-made static edition

With Node.js installed, run from this folder:

```sh
node scripts/serve.mjs
```

Open `http://127.0.0.1:8765/`. The server binds only to the local machine. `start-preview.bat` is included for Windows. The `preview/` folder can also be served by any ordinary static host.

### Develop the GSAP / Vite edition

An internet connection is required for the initial dependency installation:

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
```

The optional installed build uses **Vite + TypeScript + GSAP / ScrollTrigger**, together with the purpose-built WebGL renderer. The renderer is **not Three.js**. The GSAP adapter controls one shared scroll value; the native scroll path is used when that adapter is unavailable. Never write to the camera simultaneously from a second animation controller.

**Verification boundary:** package installation was unavailable in the build environment. The installed Vite/GSAP path is included in source, but it was not executed there. The working delivered preview uses the tested native-scroll backend. No npm lockfile is fabricated. After installation, retain the resulting lockfile and validate that build before deployment.

### Rebuild the dependency-free preview

With TypeScript installed locally or globally:

```sh
npm run build:offline
npm test
node --test tests/bundle.test.mjs
```

`build:offline` type-checks the source, creates `preview/`, pre-renders English content, and creates the self-contained HTML edition. This is the build path executed for the delivery.

## Content and architecture

| File | Responsibility |
|---|---|
| `src/content.ts` | EN/ZH copy; profile; all nine projects; public-safe evidence and limitations |
| `src/views.ts` | Semantic page, cards, chaptered case-study sheets and evidence notes |
| `src/case-dialog.ts` | Native modal lifecycle, real open/close/switch animations, reading navigation, glossary and focus |
| `src/case-ai-content.ts` | Four detailed bilingual AI application/system case studies |
| `src/case-archive-content.ts` | Five source-limited bilingual earlier project records |
| `src/case-types.ts`, `src/case-content.ts`, `src/case-labels.ts` | Shared article schema, registry and translated reader controls |
| `src/main.ts` | Locale, filters, modal focus, motion control, clipboard and page lifecycle |
| `src/state.ts` | Pure camera path and scroll-to-chapter mapping |
| `src/geometry.ts`, `src/math.ts` | Mesh generation and perspective mathematics |
| `src/scene-model.ts` | The five shared model groups and transformations |
| `src/shaders.ts`, `src/scene.ts` | WebGL materials, buffers, rendering and disposal |
| `src/software-scene.ts` | Labelled Canvas2D triangle-rasterization fallback using actual 3D meshes |
| `src/motion.ts`, `src/gsap-adapter.ts` | Single-owner scroll orchestration; native/optional GSAP adapter |
| `styles/` | Editorial layout, illustrations, responsive and motion-safe styles |
| `public/documents/` | User-supplied current CV PDF |
| `tests/` | Pure-state, content, offline-bundle and browser checks |

Five 3D stations: original optical sculpture → Fairy-inspired optical eye → MojoCore layers → MojoClaw/MojoAX panels → development-method nodes. The stations share one physical scene with decreasing Z coordinates. The copy stays as readable DOM text, not text baked into canvas.

## Source boundaries

Fairy has its own Core. MojoCore is the shared foundation for MojoClaw and MojoAX; the site does not depict Fairy as a MojoCore client. Private Mojo source code and internal repository paths are not distributed.

The earlier portfolio's five non-Fairy projects are retained. **Their original runtime files are not bundled here.** In particular, Dreambound links to its original source directory rather than a newly invented playable replacement. Old server-backed and native applications are described as project records, not embedded working apps. See `docs/CONTENT_AUDIT.md`.

All project art in the new site is a presentation illustration, not an application screenshot or production session recording. The downloadable CV contains the contact information supplied by its owner; the webpage omits the residential street address. No analytics trackers, external font files, credentials or fake usage metrics are included.

## Deployment

No repository push, remote change or deployment has been performed.

For the ready-made version, publish **the contents of `preview/`** at your static host's document root. All internal assets use relative paths so a repository subdirectory is supported. Preserve the original repository's `demos/` and other assets separately before replacing old pages; this ZIP is a new implementation, not a clone containing every old asset.

For the installed Vite version, publish `dist/` after running and checking `npm run build`. Vite's base is `./`. Test the target host path, external project links, PDF download and both locales before making it public. You do not need an API key.

## Browser tests

The suite uses Python Playwright and a locally available Chromium executable:

```sh
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

Set `CHROMIUM_PATH` for a different Chromium installation in the full browser suite. The build environment's policy blocks page navigation and WebGL; tests therefore load the actual standalone document with Playwright `set_content`. They do not change policy or claim GPU validation. Browser results and screenshots describe the renderer actually used. See `docs/VERIFICATION.md` for precise coverage and remaining release checks.
