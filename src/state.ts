export type Locale = 'en' | 'zh';
export type Vec3 = [number, number, number];
export type CameraPose = { position: Vec3; target: Vec3; fov: number; station: number };
export const clamp = (n: number, a = 0, b = 1): number => Math.min(b, Math.max(a, Number.isFinite(n) ? n : a));
export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
export const smooth = (t: number): number => { t = clamp(t); return t * t * (3 - 2 * t); };
export const normaliseLocale = (value: unknown): Locale => value === 'zh' ? 'zh' : 'en';
/** Camera position is a pure function of scroll, so reversal never accumulates drift. */
export function sampleCamera(t: number): CameraPose {
  t = clamp(t, 0, 4);
  const index = Math.min(3, Math.floor(t));
  const u = smooth(t - index);
  const z = mix(7 - index * 16, 7 - (index + 1) * 16, u);
  const x = mix([0, -.2, .2, -.15, 0][index], [0, -.2, .2, -.15, 0][index + 1], u);
  return { position: [x, .25, z], target: [x, 0, z - 8], fov: 44, station: t };
}
/** Each anchor is a reading stop; geometry travels only between their final quarters. */
export function progressAtScroll(y: number, anchors: number[]): number {
  if (anchors.length < 2 || y <= anchors[0]) return 0;
  for (let i = 0; i < anchors.length - 1; i++) {
    if (y <= anchors[i+1]) return i + clamp((y - anchors[i]) / Math.max(1, anchors[i+1] - anchors[i]));
  }
  return anchors.length - 1;
}
export function heldProgress(y: number, anchors: number[]): number {
  const raw = progressAtScroll(y, anchors);
  const i = Math.floor(raw);
  if (i >= anchors.length - 1) return anchors.length - 1;
  // A substantial stationary reading window, then a continuous spatial transition.
  return i + smooth(clamp((raw - i - .46) / .54));
}
export function safeStorageGet(key: string): string | null { try { return localStorage.getItem(key); } catch { return null; } }
export function safeStorageSet(key: string, value: string): void { try { localStorage.setItem(key, value); } catch { /* Private mode must not break the page. */ } }
