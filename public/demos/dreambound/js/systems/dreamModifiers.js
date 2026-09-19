window.DR = window.DR || {};

(function attachDreamModifiers(DR) {
  "use strict";

  const U = DR.Utils;

  const MODIFIERS = {
    slow_time: {
      name: "Rewound Clock",
      short: "Memory Time",
      desc: "Memory slows enemy movement and recovery. Fast attacks gain extra damage.",
    },
    weightless: {
      name: "Tideglass Drift",
      short: "Drift",
      desc: "Friction drops, Dream Step stretches, and all knockback becomes severe.",
    },
    mirror_law: {
      name: "Regret Mirror",
      short: "Mirrors",
      desc: "Some past shadows enter as fragile mirrored doubles. Echo effects break them harder.",
    },
    curved_shots: {
      name: "Bent Reminiscence",
      short: "Curved Shots",
      desc: "Projectiles arc like broken recollections. Split projectiles branch more violently.",
    },
    inverted_wounds: {
      name: "Inverted Regret",
      short: "Inversion",
      desc: "A small chance flips damage into healing for either side.",
    },
    chaos_flux: {
      name: "Fractured Kotori",
      short: "Chaos",
      desc: "A temporary extra rule rotates during combat as Kotori's memory destabilizes.",
    },
  };

  class DreamManager {
    constructor(game) {
      this.game = game;
      this.active = [];
      this.temp = null;
      this.tempTimer = 0;
    }

    reset() {
      this.active = [];
      this.temp = null;
      this.tempTimer = 0;
    }

    addLayerRule(layer, rng) {
      let id;
      if (layer === 3) {
        id = "chaos_flux";
      } else {
        const options = Object.keys(MODIFIERS).filter((key) => key !== "chaos_flux" && !this.active.includes(key));
        id = U.pick(rng, options);
      }
      if (!this.active.includes(id)) this.active.push(id);
      this.game.showBanner(`${MODIFIERS[id].name} binds Memory Tide Layer ${layer}`);
      if (id === "chaos_flux") this.rollChaos(rng);
      return id;
    }

    update(dt) {
      if (!this.has("chaos_flux")) return;
      this.tempTimer -= dt;
      if (this.tempTimer <= 0) this.rollChaos(this.game.rng);
    }

    rollChaos(rng) {
      const pool = Object.keys(MODIFIERS).filter((key) => key !== "chaos_flux");
      this.temp = U.pick(rng, pool);
      this.tempTimer = 18 + rng() * 8;
      this.game.showBanner(`Fractured Kotori: ${MODIFIERS[this.temp].name}`);
    }

    ids() {
      const ids = this.active.slice();
      if (this.temp && this.has("chaos_flux")) ids.push(this.temp);
      return Array.from(new Set(ids));
    }

    has(id) {
      return this.active.includes(id) || (this.temp === id && this.active.includes("chaos_flux"));
    }

    labels() {
      return this.ids().map((id) => MODIFIERS[id].short);
    }

    getEnemySpeedScale() {
      let scale = 1;
      if (this.has("slow_time")) scale *= 0.84;
      if (this.has("weightless")) scale *= 1.08;
      return scale;
    }

    getEnemyCooldownScale() {
      let scale = 1;
      if (this.has("slow_time")) scale *= 1.18;
      if (this.has("chaos_flux")) scale *= 0.95;
      return scale;
    }

    getFrictionScale() {
      return this.has("weightless") ? 0.54 : 1;
    }

    getDashScale() {
      return this.has("weightless") ? 1.28 : 1;
    }

    getKnockbackScale() {
      return this.has("weightless") ? 1.72 : 1;
    }

    shouldMirrorEnemy(rng) {
      return this.has("mirror_law") && rng() < 0.34;
    }

    damageFlipChance() {
      return this.has("inverted_wounds") ? 0.11 : 0;
    }

    rewardBonus() {
      return this.has("chaos_flux") ? 0.22 : 0;
    }
  }

  DR.DreamModifiers = MODIFIERS;
  DR.DreamManager = DreamManager;
})(window.DR);
