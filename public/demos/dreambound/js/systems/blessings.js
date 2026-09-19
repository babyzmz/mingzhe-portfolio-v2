window.DR = window.DR || {};

(function attachBlessings(DR) {
  "use strict";

  const DEFINITIONS = [
    {
      id: "quickening_pulse",
      name: "Quickening Pulse",
      school: "Cognition",
      desc: "Attack faster. Every third slash releases a second golden cut.",
      apply(player) {
        player.stats.attackSpeedMult *= 1.18;
        player.stats.quickPulse += 1;
      },
    },
    {
      id: "mirror_shard",
      name: "Mirror Shard",
      school: "Phantasm",
      desc: "Slashes fire dream shards. More stacks add more shard lanes.",
      apply(player) {
        player.stats.shards += 1;
      },
    },
    {
      id: "branching_dream",
      name: "Branching Dream",
      school: "Phantasm",
      desc: "Player projectiles split on impact. Bent Orbit adds one extra branch.",
      apply(player) {
        player.stats.projectileSplit = Math.min(3, player.stats.projectileSplit + 1);
        player.stats.projectilePierce += 1;
      },
    },
    {
      id: "crimson_lucidity",
      name: "Crimson Lucidity",
      school: "Emotion",
      desc: "Kills restore HP and release a small damaging wake.",
      apply(player) {
        player.stats.killHeal += 4;
        player.stats.killPulse += 1;
      },
    },
    {
      id: "still_moment",
      name: "Still Moment",
      school: "Cognition",
      desc: "Gain crit chance. Critical hits slow their target in place.",
      apply(player) {
        player.stats.critChance += 0.08;
        player.stats.critSlow += 1;
      },
    },
    {
      id: "lucid_edge",
      name: "Lucid Edge",
      school: "Cognition",
      desc: "Gain stronger crits. Critical hits spawn a short echo stab.",
      apply(player) {
        player.stats.critChance += 0.1;
        player.stats.critDamage += 0.22;
        player.stats.critEcho = true;
      },
    },
    {
      id: "heavy_reverie",
      name: "Heavy Reverie",
      school: "Emotion",
      desc: "Slashes hit harder and wider but attack more slowly.",
      apply(player) {
        player.stats.damageMult *= 1.34;
        player.stats.attackSpeedMult *= 0.88;
        player.stats.heavyStacks += 1;
      },
    },
    {
      id: "echo_afterimage",
      name: "Echo Afterimage",
      school: "Memory",
      desc: "Primary attacks repeat after a delay for partial damage.",
      apply(player) {
        player.stats.echoRepeats += 1;
      },
    },
    {
      id: "thornwake",
      name: "Thornwake",
      school: "Emotion",
      desc: "Taking damage releases a thorn pulse around you.",
      apply(player) {
        player.stats.thornPulse += 1;
        player.maxHp += 8;
        player.hp += 8;
      },
    },
    {
      id: "time_debt",
      name: "Time Debt",
      school: "Astral",
      desc: "Dream Step cools down faster and slows enemies when used.",
      apply(player) {
        player.stats.skillCooldownMult *= 0.82;
        player.stats.skillSlow += 0.45;
      },
    },
    {
      id: "fractured_halo",
      name: "Fractured Halo",
      school: "Astral",
      desc: "Gain an orbiting shard that repeatedly cuts nearby enemies.",
      apply(player) {
        player.stats.orbitals += 1;
      },
    },
    {
      id: "void_bloom",
      name: "Void Bloom",
      school: "Chaos",
      desc: "Repeated hits trigger a dark bloom explosion on the target.",
      apply(player) {
        player.stats.voidBloom += 1;
      },
    },
  ];

  const BY_ID = Object.fromEntries(DEFINITIONS.map((definition) => [definition.id, definition]));

  class BlessingSystem {
    constructor(game) {
      this.game = game;
    }

    roll(count) {
      const player = this.game.player;
      const weighted = [];
      for (const def of DEFINITIONS) {
        const stacks = player.blessings[def.id] || 0;
        let weight = 8;
        if (stacks === 0) weight += 8;
        if (this.prefers(def.school)) weight += 3;
        for (let i = 0; i < weight; i += 1) weighted.push(def);
      }
      const chosen = [];
      while (chosen.length < count && weighted.length > 0) {
        const def = DR.Utils.pick(this.game.rng, weighted);
        if (!chosen.includes(def)) chosen.push(def);
      }
      return chosen;
    }

    prefers(school) {
      const tags = this.buildTags();
      if (tags.includes("Attack Speed Flow") && (school === "Cognition" || school === "Phantasm")) return true;
      if (tags.includes("Burst Flow") && (school === "Emotion" || school === "Memory" || school === "Chaos")) return true;
      return false;
    }

    apply(id) {
      const def = BY_ID[id];
      if (!def) return;
      const player = this.game.player;
      player.blessings[id] = (player.blessings[id] || 0) + 1;
      def.apply(player, this.game);
      this.game.combat.spawnPulse(player.x, player.y, 92, DR.Colors.boss, 0.24, "player", 0);
      this.game.showBanner(`${def.name} absorbed`);
    }

    buildTags() {
      const p = this.game.player;
      const attackScore = (p.blessings.quickening_pulse || 0) * 2
        + (p.blessings.mirror_shard || 0)
        + (p.blessings.branching_dream || 0);
      const burstScore = (p.blessings.heavy_reverie || 0) * 2
        + (p.blessings.lucid_edge || 0)
        + (p.blessings.still_moment || 0)
        + (p.blessings.echo_afterimage || 0)
        + (p.blessings.void_bloom || 0);
      const tags = [];
      if (attackScore >= 3) tags.push("Attack Speed Flow");
      if (burstScore >= 3) tags.push("Burst Flow");
      if (tags.length === 0) tags.push("Waking Blade");
      return tags;
    }

    describeChoice(def) {
      const stack = this.game.player.blessings[def.id] || 0;
      return {
        id: def.id,
        name: def.name,
        school: def.school,
        desc: def.desc,
        stack,
      };
    }
  }

  DR.BlessingDefinitions = DEFINITIONS;
  DR.BlessingSystem = BlessingSystem;
})(window.DR);
