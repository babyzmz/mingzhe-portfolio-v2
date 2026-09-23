# Portfolio atmosphere integration

Approved scope: add the five React Bits effects to the existing portfolio, without new sections or changes to project evidence.

1. Test the layout contract: one navigation circular mark, nine combined-glow project cards, one shared background renderer, unchanged contact stream and project content.
2. Port the pinned LightPillar and DarkVeil fragment shaders into the existing vanilla TypeScript/WebGL site. A single additional canvas selects the visible background; no React/Three/OGL dependency, no extra scene per card. Keep attribution and the full license notice within this website.
3. Use soft horizontal attenuation to guide the eye toward models. DarkVeil spans about/contact/footer with shared screen coordinates, no panel resets. Hide background behind #work; keep text readable.
4. Add a rotating text ring around the existing MZ, and pointer-angle/edge-proximity BorderGlow combined with a radial Spotlight on all nine cards. Keyboard focus and touch keep useful static borders; decorative elements never receive pointer events.
5. Hook locale refresh, dialogs, page visibility, bfcache, resizing, reduced motion and the existing pause control. Stop offscreen drawing. Keep a CSS fallback for WebGL failures and context loss.
6. Verify both builds, all prior node + HTTP tests, new browser interaction/visual tests and asset hashes. Review desktop and mobile screenshots. Publish only after the tested source is on main, with exact live assets verified.

## Scope boundaries
No project prose, status, media, resume or demo changes. No private project source. No runtime requests to reactbits.dev. No permanent high-frequency mouse polling. No generated-only bundle patch.
