# Reviewed atmosphere candidate

Verified website source: `938e910b5711b995a6b697a70b2295770c6ef0cc`.
GitHub Actions: https://github.com/babyzmz/mingzhe-portfolio-v2/actions/runs/35816394971
Artifact retrieved and reviewed: `10731462093`.

- TypeScript, Vite production and standalone offline builds passed.
- 63 Node unit tests and 4 offline bundle checks passed.
- 56 actual HTTP WebGL atmosphere checks passed.
- 54 explicitly WebGL-disabled fallback checks passed.
- 58 existing footer, word-animation and responsive regression checks passed.
- No JavaScript errors or failed asset requests in those runs.
- Desktop and mobile screenshots were reviewed, including Chinese contact layout. The about image was captured mid-reveal; the new settled-capture check waits for complete text and asserts final opacity before recording screenshots.

The main publication independently requires fresh atmosphere, local-sync and Windows CI success, followed by Pages deployment and exact live asset SHA256 matching. See the publication run artifact's `live-result.json` for the deployed revision; this candidate record alone does not certify publication.

WebGL tests use Chromium/SwiftShader on a GitHub-hosted runner. They validate real shader compilation, rendering and interactions, not physical-device frame rates or Safari/iOS certification. Static CSS fallback is deliberately tested separately.

The reviewed website source keeps project descriptions, real media, downloads, demos and existing contact/word animations unchanged from the previous accepted release. Temporary source-intake/application workflows and patch payloads are excluded from main.
