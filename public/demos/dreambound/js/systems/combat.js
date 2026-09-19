window.DR = window.DR || {};

(function attachCombat(DR) {
  "use strict";

  const U = DR.Utils;
  const C = DR.Colors;

  class Hitbox {
    constructor(options) {
      this.id = U.uid();
      this.owner = options.owner;
      this.team = options.team;
      this.type = options.type || "cone";
      this.x = options.x;
      this.y = options.y;
      this.x2 = options.x2 || this.x;
      this.y2 = options.y2 || this.y;
      this.dir = options.dir || { x: 1, y: 0 };
      this.range = options.range || 80;
      this.arc = options.arc || Math.PI * 0.65;
      this.width = options.width || 44;
      this.radius = options.radius || 80;
      this.damage = options.damage || 1;
      this.ttl = options.ttl || 0.12;
      this.maxTtl = this.ttl;
      this.knockback = options.knockback || 120;
      this.stun = options.stun || 0.05;
      this.kind = options.kind || "slash";
      this.color = options.color || (this.team === "player" ? C.teal : C.hostile);
      this.hit = new Set();
      this.onHit = options.onHit || null;
      this.critEnabled = options.critEnabled !== false;
      this.damageScale = options.damageScale || 1;
    }

    update(dt, game) {
      this.ttl -= dt;
      const targets = this.team === "player" ? game.enemyTargets() : [game.player];
      for (const target of targets) {
        if (!target || !target.alive || this.hit.has(target.id)) continue;
        if (!this.contains(target)) continue;
        this.hit.add(target.id);
        const dir = U.normalize(target.x - this.x, target.y - this.y);
        game.combat.damage(target, this.damage * this.damageScale, this.owner, {
          dir,
          knockback: this.knockback,
          stun: this.stun,
          kind: this.kind,
          critEnabled: this.critEnabled,
        });
        this.onHit?.(target, game);
      }
      return this.ttl > 0;
    }

    contains(target) {
      if (this.type === "circle") {
        return Math.hypot(target.x - this.x, target.y - this.y) <= this.radius + target.radius;
      }
      if (this.type === "line") {
        return U.pointSegmentDistance(target.x, target.y, this.x, this.y, this.x2, this.y2) <= this.width / 2 + target.radius;
      }
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const distance = Math.hypot(dx, dy);
      if (distance > this.range + target.radius) return false;
      const angle = Math.atan2(dy, dx);
      const aim = Math.atan2(this.dir.y, this.dir.x);
      return Math.abs(U.angleDiff(angle, aim)) <= this.arc / 2;
    }

    draw(renderer) {
      const alpha = Math.max(0, this.ttl / this.maxTtl) * 0.35;
      const progress = 1 - this.ttl / this.maxTtl;
      if (renderer.assets?.has("memory_weapons")) {
        if (this.kind === "slash" || this.kind === "echo_slash" || this.kind === "enemy_slash" || this.kind === "boss_slash" || this.kind === "mimic_slash" || this.kind === "quick_pulse" || this.kind === "crit_echo") {
          renderer.assets.draw(renderer, "memory_weapons", "sword_slash", this.x + this.dir.x * this.range * 0.34, this.y + this.dir.y * this.range * 0.34, {
            width: Math.max(82, this.range * 1.25),
            height: Math.max(82, this.range * 1.25),
            rotation: Math.atan2(this.dir.y, this.dir.x),
            alpha: Math.min(0.95, alpha + 0.36),
            progress,
          });
        } else if (this.kind === "dream_step" || this.kind === "mimic_skill") {
          const dx = this.x2 - this.x;
          const dy = this.y2 - this.y;
          const length = Math.hypot(dx, dy);
          renderer.assets.draw(renderer, "memory_weapons", "dream_step_trail", (this.x + this.x2) / 2, (this.y + this.y2) / 2, {
            width: Math.max(112, length),
            height: Math.max(68, this.width * 1.3),
            rotation: Math.atan2(dy, dx),
            alpha: Math.min(0.9, alpha + 0.32),
            progress,
          });
        } else if (this.kind === "pulse") {
          renderer.assets.draw(renderer, "memory_combat_effects", "spawn_ripple", this.x, this.y, {
            width: this.radius * 2.2,
            height: this.radius * 2.2,
            alpha: Math.min(0.72, alpha + 0.2),
            progress,
          });
        }
      }
      if (this.type === "circle") {
        renderer.circle(this.x, this.y, this.radius, this.color, alpha, 30);
        renderer.ring(this.x, this.y, this.radius, 4, this.color, alpha + 0.1, 30);
      } else if (this.type === "line") {
        renderer.line(this.x, this.y, this.x2, this.y2, this.width, this.color, alpha);
      } else {
        renderer.wedge(this.x, this.y, Math.atan2(this.dir.y, this.dir.x), this.range, this.arc, this.color, alpha, 14);
      }
    }
  }

  class Projectile {
    constructor(options) {
      this.id = U.uid();
      this.owner = options.owner;
      this.team = options.team;
      this.x = options.x;
      this.y = options.y;
      this.vx = options.vx;
      this.vy = options.vy;
      this.radius = options.radius || 6;
      this.damage = options.damage || 8;
      this.knockback = options.knockback || 80;
      this.ttl = options.ttl || 2;
      this.age = 0;
      this.pierce = options.pierce || 0;
      this.splitDepth = options.splitDepth || 0;
      this.color = options.color || (this.team === "player" ? C.projectile : C.hostile);
      this.hit = new Set();
      this.curvePhase = options.curvePhase || Math.random() * Math.PI * 2;
      this.kind = options.kind || "projectile";
      this.dead = false;
    }

    update(dt, game) {
      this.age += dt;
      this.ttl -= dt;
      if (game.dream.has("curved_shots")) {
        const turn = Math.sin(this.age * 7 + this.curvePhase) * 2.4 * dt;
        const v = U.rotate({ x: this.vx, y: this.vy }, turn);
        this.vx = v.x;
        this.vy = v.y;
      }

      this.x += this.vx * dt;
      this.y += this.vy * dt;

      const b = game.bounds;
      if (this.x < b.left - 80 || this.x > b.right + 80 || this.y < b.top - 80 || this.y > b.bottom + 80) {
        this.dead = true;
      }

      const targets = this.team === "player" ? game.enemyTargets() : [game.player];
      for (const target of targets) {
        if (!target || !target.alive || this.hit.has(target.id)) continue;
        if (Math.hypot(target.x - this.x, target.y - this.y) > target.radius + this.radius) continue;
        this.hit.add(target.id);
        const dir = U.normalize(target.x - this.x, target.y - this.y);
        game.combat.damage(target, this.damage, this.owner, {
          dir,
          knockback: this.knockback,
          stun: 0.04,
          kind: this.kind,
        });

        if (this.team === "player") this.trySplit(game);
        if (this.pierce > 0) this.pierce -= 1;
        else this.dead = true;
        break;
      }

      return this.ttl > 0 && !this.dead;
    }

    trySplit(game) {
      const stats = game.player.stats;
      let maxDepth = stats.projectileSplit;
      if (game.dream.has("curved_shots") && maxDepth > 0) maxDepth += 1;
      if (this.splitDepth >= maxDepth) return;
      const base = U.normalize(this.vx, this.vy);
      const spread = game.dream.has("curved_shots") ? 0.82 : 0.54;
      for (const sign of [-1, 1]) {
        const d = U.rotate(base, sign * spread);
        game.projectiles.push(new Projectile({
          owner: this.owner,
          team: this.team,
          x: this.x,
          y: this.y,
          vx: d.x * Math.hypot(this.vx, this.vy) * 0.88,
          vy: d.y * Math.hypot(this.vx, this.vy) * 0.88,
          radius: Math.max(4, this.radius * 0.78),
          damage: this.damage * 0.55,
          ttl: 1.1,
          splitDepth: this.splitDepth + 1,
          color: C.teal,
          kind: "split",
        }));
      }
    }

    draw(renderer) {
      if (renderer.assets?.has("memory_weapons")) {
        const anim = this.team === "player" ? "mirror_shard" : "night_bolt";
        renderer.assets.draw(renderer, "memory_weapons", anim, this.x, this.y, {
          width: this.radius * 6,
          height: this.radius * 6,
          rotation: Math.atan2(this.vy, this.vx),
          alpha: 0.95,
          time: renderer.animationTime + this.id * 0.11,
        });
        return;
      }
      renderer.circle(this.x, this.y, this.radius + 5, this.color, 0.14, 18);
      renderer.circle(this.x, this.y, this.radius, this.color, 0.95, 18);
    }
  }

  class Particle {
    constructor(options) {
      this.x = options.x;
      this.y = options.y;
      this.vx = options.vx || 0;
      this.vy = options.vy || 0;
      this.radius = options.radius || 4;
      this.color = options.color || C.white;
      this.ttl = options.ttl || 0.4;
      this.maxTtl = this.ttl;
    }

    update(dt) {
      this.ttl -= dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.vx *= Math.exp(-6 * dt);
      this.vy *= Math.exp(-6 * dt);
      return this.ttl > 0;
    }

    draw(renderer) {
      const t = Math.max(0, this.ttl / this.maxTtl);
      if (renderer.assets?.has("memory_combat_effects") && this.radius > 4.5) {
        renderer.assets.draw(renderer, "memory_combat_effects", "hit_spark", this.x, this.y, {
          width: this.radius * 10,
          height: this.radius * 10,
          alpha: t * 0.82,
          progress: 1 - t,
        });
        return;
      }
      renderer.circle(this.x, this.y, this.radius * (0.5 + t), this.color, t * 0.82, 12);
    }
  }

  class CombatSystem {
    constructor(game) {
      this.game = game;
    }

    damage(target, rawAmount, source, options) {
      const game = this.game;
      if (!target.alive) return false;
      let amount = rawAmount;
      let crit = false;
      const sourceIsPlayer = source && source.team === "player";
      const targetIsEnemy = target.team === "enemy" || target.team === "boss";

      if (sourceIsPlayer && targetIsEnemy) {
        const stats = game.player.stats;
        amount *= stats.damageMult;
        if (target.isMirror && stats.echoRepeats > 0 && game.dream.has("mirror_law")) amount *= 1.25;
        if (game.dream.has("slow_time") && stats.attackSpeedMult >= 1.42) amount *= 1.12;
        const critChance = options?.critEnabled === false ? 0 : stats.critChance;
        crit = game.rng() < critChance;
        if (crit) amount *= stats.critDamage;
        if (stats.heavyStacks > 0 && game.dream.has("weightless")) {
          options = { ...options, knockback: (options?.knockback || 0) + 95 * stats.heavyStacks };
        }
      }

      const flipChance = game.dream.damageFlipChance();
      if (flipChance > 0 && game.rng() < flipChance) {
        target.heal(Math.max(3, amount * 0.65));
        this.spawnBurst(target.x, target.y, C.pink, 10, 80);
        game.showBanner("Inversion turned damage into healing");
        return false;
      }

      const killed = target.receiveDamage(amount, source, game, options);
      this.spawnBurst(target.x, target.y, crit ? C.boss : C.white, crit ? 13 : 6, crit ? 180 : 90);
      game.shake(crit ? 9 : 4, crit ? 0.14 : 0.08);

      if (sourceIsPlayer && targetIsEnemy) {
        game.hitStop = Math.max(game.hitStop, crit ? 0.055 : 0.032);
        this.onPlayerHit(target, amount, crit, options);
        if (killed) game.player.onKill(target, game);
      }

      if (target.team === "player" && source && source.team !== "player") {
        game.player.onHurt(source, game);
        game.shake(12, 0.22);
      }
      return killed;
    }

    onPlayerHit(target, amount, crit, options) {
      const game = this.game;
      const stats = game.player.stats;
      stats.hitCounter += 1;
      if (crit && stats.critSlow > 0) {
        target.slowTimer = Math.max(target.slowTimer, 1.25);
        target.slowFactor = Math.min(target.slowFactor, 0.45);
        this.spawnPulse(target.x, target.y, 92, C.violet, 0.22, "player", 0);
      }
      if (crit && stats.critEcho) {
        const dir = options?.dir || U.normalize(target.x - game.player.x, target.y - game.player.y);
        game.hitboxes.push(new Hitbox({
          owner: game.player,
          team: "player",
          type: "line",
          x: target.x - dir.x * 72,
          y: target.y - dir.y * 72,
          x2: target.x + dir.x * 72,
          y2: target.y + dir.y * 72,
          width: 34,
          damage: amount * 0.34,
          ttl: 0.08,
          knockback: 80,
          color: C.boss,
          kind: "crit_echo",
          critEnabled: false,
        }));
      }
      if (stats.voidBloom > 0 && stats.hitCounter % Math.max(3, 6 - stats.voidBloom) === 0) {
        this.spawnPulse(target.x, target.y, 88 + stats.voidBloom * 12, C.pink, 0.32, "player", 8 + stats.voidBloom * 5);
      }
    }

    spawnPulse(x, y, radius, color, ttl, team, damage) {
      this.game.hitboxes.push(new Hitbox({
        owner: team === "player" ? this.game.player : null,
        team,
        type: "circle",
        x,
        y,
        radius,
        damage,
        ttl,
        knockback: 120,
        stun: 0.05,
        color,
        kind: "pulse",
        critEnabled: false,
      }));
    }

    spawnBurst(x, y, color, count, power) {
      for (let i = 0; i < count; i += 1) {
        const a = this.game.rng() * Math.PI * 2;
        const speed = (0.3 + this.game.rng() * 0.7) * power;
        this.game.particles.push(new Particle({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          radius: 2 + this.game.rng() * 3,
          color,
          ttl: 0.22 + this.game.rng() * 0.28,
        }));
      }
    }
  }

  DR.Hitbox = Hitbox;
  DR.Projectile = Projectile;
  DR.Particle = Particle;
  DR.CombatSystem = CombatSystem;
})(window.DR);
