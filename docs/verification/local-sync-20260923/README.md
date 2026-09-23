# Local-upload integration — 2026-09-23

## Scope and provenance

The owner approved synchronising all five uploaded build files, the contact-title
Text Stream correction, revised Fairy/MojoClaw positioning and a homepage
Word By Word Text effect. `inputs.json` identifies the exact uploads. Source base:
`0d6e932d8e4891a6b6ec09c98ccf5dcbaec907d2`.

The uploaded minified app was compared with a fresh build of that revision.
47 top-level function bodies were structurally unchanged; two functions changed
and three were added. Both supplied GSAP/ScrollTrigger vendor chunks matched the
locked build byte for byte. The old built stylesheet was an exact prefix of the
uploaded stylesheet; the addition was heading colour fill and the faulty footer
stream. Project data and detailed local case-study updates were reconstructed
into the TypeScript source, not layered over a stale compiled bundle.

`tests/local-upload-parity.test.mjs` compares canonical content hashes for all
nine projects, AI cases, archive cases, labels, media, links and profile against
the upload. Its exclusions are explicit and limited to the owner's requested
Fairy/MojoClaw descriptions and obsolete extra-strip labels. Unchanged public
media, playable demos, CV and links remain in place.

## Changes

- Contact Text Stream replaces the existing large contact CTA. No second stream
  is appended below the contact section. Original contact links and bottom bar
  remain; a local pause and reduced-motion fallback keep the original sentence.
- Uploaded scroll colour-fill headings remain and survive resize/language
  refresh. They have a separate controller from word reveal.
- Nine selected homepage text blocks gain a progressively enhanced word reveal.
  The effect does not split controls, case-dialog content or the animated footer.
- Fairy is positioned as aiming to become an intelligent assistant on personal
  devices. MojoClaw is positioned as personal AI SaaS for web and desktop. Both
  retain their development status; no new production-launch claim is made.

## Animation reference

The public RewampUI Word By Word Text component was inspected on 2026-09-23:
https://www.rewampui.com/components/word-by-word-text

The independent DOM implementation follows its visual parameters: 12px upward
settling, opacity 0 to 1, blur 4px to 0, 600ms duration, 120ms word stagger and
cubic-bezier(.25,.46,.45,.94). Long paragraph stagger is capped at 900ms. The
existing vanilla TypeScript/GSAP architecture is retained; third-party React code
or a new framework is not bundled. Chinese segmentation, whitespace, markup,
reduced motion, disposal and bfcache recovery are handled locally.

Footer visual reference: https://www.obsidianui.dev/docs/text-stream

## Validation

Local fresh builds: `npm run build:offline`, `npm run build`.
Fresh checks: `npm test` (59 passing), `node --test tests/bundle.test.mjs`
(4 passing), and `npm run privacy-check` (passing).
`tests/local-sync.browser.py` passed 53 checks using the standalone edition in
Chromium, including actual Web Animation keyframes and intermediate state,
locale switches, dialog/stream suspension, colour-fill refresh, 320/390/768/1440px
contact layouts and initial reduced-motion behaviour.

The local container blocks HTTP navigation and has no available WebGL context.
The text-only standalone test explicitly stops the expensive software scene;
it is not a GPU-performance or HTTP-site certification. The same test's `--serve`
mode validates a real HTTP build under `/mingzhe-portfolio-v2/` in GitHub Actions,
without this local isolation. Source, logs, screenshot artifacts and run/commit
identifiers from that job are the authoritative remote acceptance evidence.
No remote pass is asserted in this note until the corresponding job succeeds.
