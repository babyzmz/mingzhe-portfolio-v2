window.DR = window.DR || {};

(function attachUtils(DR) {
  "use strict";

  let nextId = 1;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function dist(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  }

  function distSq(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  function normalize(x, y) {
    const len = Math.hypot(x, y);
    if (len < 0.0001) return { x: 1, y: 0 };
    return { x: x / len, y: y / len };
  }

  function angleOf(v) {
    return Math.atan2(v.y, v.x);
  }

  function fromAngle(a) {
    return { x: Math.cos(a), y: Math.sin(a) };
  }

  function angleDiff(a, b) {
    let d = (a - b + Math.PI) % (Math.PI * 2) - Math.PI;
    if (d < -Math.PI) d += Math.PI * 2;
    return d;
  }

  function rotate(v, radians) {
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
  }

  function pointSegmentDistance(px, py, ax, ay, bx, by) {
    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;
    const lenSq = abx * abx + aby * aby || 1;
    const t = clamp((apx * abx + apy * aby) / lenSq, 0, 1);
    const x = ax + abx * t;
    const y = ay + aby * t;
    return Math.hypot(px - x, py - y);
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function rng() {
      a += 0x6d2b79f5;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randRange(rng, min, max) {
    return min + rng() * (max - min);
  }

  function randInt(rng, min, max) {
    return Math.floor(randRange(rng, min, max + 1));
  }

  function pick(rng, list) {
    return list[Math.floor(rng() * list.length)];
  }

  function shuffle(rng, list) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  function color(hex, alpha) {
    let value = hex.replace("#", "");
    if (value.length === 3) {
      value = value.split("").map((c) => c + c).join("");
    }
    const int = Number.parseInt(value, 16);
    return [
      ((int >> 16) & 255) / 255,
      ((int >> 8) & 255) / 255,
      (int & 255) / 255,
      alpha == null ? 1 : alpha,
    ];
  }

  function uid() {
    const id = nextId;
    nextId += 1;
    return id;
  }

  DR.Utils = {
    clamp,
    lerp,
    dist,
    distSq,
    normalize,
    angleOf,
    fromAngle,
    angleDiff,
    rotate,
    pointSegmentDistance,
    mulberry32,
    randRange,
    randInt,
    pick,
    shuffle,
    color,
    uid,
  };
})(window.DR);
