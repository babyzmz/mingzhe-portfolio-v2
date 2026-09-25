# Mobile 3D story readability — 2026-09-25

## Scope

Owner requested local text protection in mobile 3D chapters without affecting the separated desktop layout. `styles/mobile-readability.css` adds a feathered dark-gradient pseudo-element, progressive 10px backdrop blur and modest text-contrast adjustments only within `#journey` below the existing 760px breakpoint. Foreground text and buttons are not blurred. The layer is pointer-transparent and does not change copy, button positions or document flow. It is not enabled for print or the work/about/contact sections.

No production TypeScript, project content, media, dependency versions, camera configuration or resume bytes changed. The existing offline preview is rebuilt from source. The dark gradient remains usable with blur disabled; the fallback without CSS masking also fades towards the model.

## Executed candidate verification

Source candidate including rebuilt standalone: `b1f0e6c266d843471d740b7bfb064d723c08cdf2`.

Run: https://github.com/babyzmz/mingzhe-portfolio-v2/actions/runs/36081704058
Artifact: `mobile-readability-acceptance` (`10842435633`).

- Both TypeScript/Vite and offline builds, 64 Node tests, four bundle checks and the publication privacy gate passed.
- Chromium: 130 real-HTTP checks; WebKit: 129 real-HTTP checks; both actual WebGL backends were recorded.
- Mobile widths: 320, 375, 390, 430, 600 and 759px in English and Chinese, across all five 3D chapters.
- Real touch activation of Fairy/Core/Claw/AX cases, menu, locale switching, forward/reverse scrolling, reduced motion, no horizontal overflow and print exclusion checked.
- Desktop copy/button geometry and pixel-exact screenshots compared to main `a6e1f9e188ab57100b53f86733273f0d0c6b9733`: all five chapters at 760 and 1440px, in both engines. Screenshots wait for three stable frames before zero-tolerance comparison; no visual-difference tolerance is used.
- Mobile copy/button positions remain identical to the baseline. Blur-disabled gradient fallback checked. No JavaScript errors.

Chromium uses SwiftShader and WebKit is Playwright's Linux build. These are real browser tests, not physical iPhone/Safari certification or mobile frame-rate measurements. Fresh main CI and the one-off publication workflow must succeed separately; deployment is established by `mobile-readability-publication-evidence/live-result.json`, not by this candidate record.
