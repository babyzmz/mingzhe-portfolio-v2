# Systems in Motion — approved design

The user approved the continuous 3D product-gallery direction and requested implementation and a visual preview.

## Scope
English-first personal portfolio with complete Simplified Chinese switching; graphite/white/cyan/amber editorial design; true scroll-driven camera translation through five stations; Fairy flagship; separate Fairy Core from MojoCore; personal and enterprise shells; development method; all five earlier projects; source-aware case studies; education, internship, skills, contact and supplied current CV.

## Runtime
Semantic HTML remains the content authority. A single WebGL canvas handles geometry, materials and camera. A single scalar controls the camera; native scrolling remains available. GSAP/ScrollTrigger is a progressive optional adapter. Network libraries could not be downloaded in this execution environment; the delivered offline preview must not require them. The local preview therefore uses an original WebGL renderer, not an unverified Three.js substitution. Standard Vite build wires the real GSAP package after installation.

## Integrity
No invented user counts, employers, awards, test totals or shipping claims. Public Fairy links only; private Mojo repository internals stay private. Earlier project entries keep source-only status when their runtime/assets cannot be fetched. Diagrams are explicitly presentation illustrations, not screenshots or live application sessions. Current CV can be downloaded; residential street address is not published. No font binaries are packaged.

## Acceptance
Camera Z moves with scrolling and reverses deterministically; mobile no horizontal overflow; keyboard accessible dialog; functional chapter navigation; persistent language and motion controls; WebGL error/context loss falls back; reduced motion stays readable; all nine projects have source notes and contribution scope. Build/typecheck, pure-state tests and real Chromium browser checks must be recorded with limitations. No remote push or deployment.
