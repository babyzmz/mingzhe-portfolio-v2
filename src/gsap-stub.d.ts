// Offline-only ambient stubs for the OPTIONAL GSAP dependency.
//
// This file is used ONLY by tsconfig.offline.json (npm run build:offline and the
// dependency-free test runner), when node_modules/gsap is not installed.
// The installed build (npm run typecheck / npm run build) resolves gsap's own
// real TypeScript types from node_modules and never includes these loose stubs.
//
// GSAP is an optional scroll backend: gsap-adapter.ts catches dynamic import
// failure and the offline edition deliberately runs the real native scroll
// backend instead. These declarations intentionally stay permissive so the
// dependency-free preview can still type-check; do not import them elsewhere.
declare module 'gsap' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const gsap: any;
  export default gsap;
}
declare module 'gsap/ScrollTrigger' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const ScrollTrigger: any;
  export default ScrollTrigger;
}
