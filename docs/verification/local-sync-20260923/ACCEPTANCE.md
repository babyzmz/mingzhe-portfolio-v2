# Source integration acceptance — 2026-09-23

Verified source commit: `901793a375b1a95effb69d64bc8e5f789b35d879`.
Successful GitHub Actions run: https://github.com/babyzmz/mingzhe-portfolio-v2/actions/runs/35812296754
Artifact: `approved-local-sync-results` (10730221527).

Fresh checks passed: both production/offline builds, 59 Node tests, 4 bundle checks, privacy scan, and 58 actual Chromium HTTP checks at the GitHub Pages subpath. The browser result has `completed: true`, zero page errors and zero request failures. Checks include intermediate word-animation keyframes, the uploaded colour-fill headings, bilingual copy, contact replacement, responsive widths 320/390/768/1440, modal suspension, control pause and initial system reduced motion. First-render reduced-motion acceptance uses a separate browser process to avoid carrying the previous long-running WebGL scenario's resources into a cold-start test.

All five supplied build files are accounted for by `inputs.json` and the content-parity fixture. Site source changes were hash-checked after reconstruction; media, demos, CV and other approved resources are retained. Production source is committed, not merely a patched generated bundle.

Main is updated as one clean commit after acceptance. Temporary reference/apply workflows and their transport payload are excluded from main. `local-sync-verify.yml` rechecks the final main commit. The one-off publication workflow is restricted to the approved update's original parent and waits for the final main check before invoking the existing manual Pages workflow. Live publication is a separate check; its artifact records the Pages run and exact public bundle hashes rather than assuming a successful source push is a successful deployment.

No assertion is made about physical-GPU performance or every browser/device. The GitHub runner uses Chromium WebGL via SwiftShader. Native desktop products themselves were not revalidated by this portfolio change.
