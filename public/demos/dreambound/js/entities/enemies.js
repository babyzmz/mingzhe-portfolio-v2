window.DR = window.DR || {};

(function attachEnemies(DR) {
  "use strict";

  const U = DR.Utils;
  const C = DR.Colors;

  class Enemy extends DR.Entity {
    constructor(x, y, options) {
      super(x, y, options.radius, "enemy", options.hp);
      this.kind = options.kind;
      this.baseSpeed = options.speed;
      this.attackRange = options.attackRange;
      this.attackDamage = options.damage;
      this.cooldown = U.randRange(options.rng || Math.random, 0.3, 1.1);
      this.attackWindup = 0;
      this.attackAnim = 0;
      this.shootAnim = 0;
      this.state = "idle";
      this.scoreValue = options.scoreValue || 1;
      this.color = options.color || C.enemy;
      this.mirrorDamageMult = options.mirrorDamageMult || 1;
      this.damageScale = options.damageScale || 1;
    }

    update(dt, game) {
      this.updateStatus(dt);
      this.attackAnim = Math.max(0, this.attackAnim - dt);
      this.shootAnim = Math.max(0, this.shootAnim - dt);
      if (this.hitStun > 0) {
        this.applyDrag(dt, 7);
        this.move(dt, game.bounds);
        return;
      }
      this.cooldown = Math.max(0, this.cooldown - dt);
      if (this.attackWindup > 0) {
        this.attackWindup -= dt;
        this.applyDrag(dt, 8);
        if (this.attackWindup <= 0) this.releaseAttack(game);
        this.move(dt, game.bounds);
        return;
      }
      if (this.kind === "melee") this.updateMelee(dt, game);
      else this.updateRanged(dt, game);
      this.move(dt, game.bounds);
    }

    speed(game) {
      return this.baseSpeed * game.dream.getEnemySpeedScale() * this.slowFactor;
    }

    updateMelee(dt, game) {
      const player = game.player;
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const distance = Math.hypot(dx, dy);
      if (distance <= this.attackRange && this.cooldown <= 0) {
        this.state = "attack";
        this.attackWindup = 0.22 * game.dream.getEnemyCooldownScale();
        this.attackDir = U.normalize(dx, dy);
        return;
      }
      this.state = distance < 520 ? "chase" : "idle";
      if (this.state === "chase") {
        const dir = U.normalize(dx, dy);
        this.vx += dir.x * this.speed(game) * 7 * dt;
        this.vy += dir.y * this.speed(game) * 7 * dt;
        this.limitSpeed(this.speed(game));
      } else {
        this.applyDrag(dt, 5);
      }
    }

    updateRanged(dt, game) {
      const player = game.player;
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const distance = Math.hypot(dx, dy);
      const dir = U.normalize(dx, dy);
      if (distance < 180) {
        this.state = "chase";
        this.vx -= dir.x * this.speed(game) * 7 * dt;
        this.vy -= dir.y * this.speed(game) * 7 * dt;
      } else if (distance > 390) {
        this.state = "chase";
        this.vx += dir.x * this.speed(game) * 6 * dt;
        this.vy += dir.y * this.speed(game) * 6 * dt;
      } else {
        this.state = "idle";
        const side = { x: -dir.y, y: dir.x };
        this.vx += side.x * Math.sin(game.time * 1.6 + this.id) * this.speed(game) * 2.2 * dt;
        this.vy += side.y * Math.sin(game.time * 1.6 + this.id) * this.speed(game) * 2.2 * dt;
      }
      this.limitSpeed(this.speed(game));
      if (distance < 560 && this.cooldown <= 0) {
        this.state = "attack";
        this.attackWindup = 0.36 * game.dream.getEnemyCooldownScale();
        this.attackDir = dir;
      }
    }

    releaseAttack(game) {
      const scale = this.damageScale * this.mirrorDamageMult;
      if (this.kind === "melee") {
        this.attackAnim = 0.34;
        game.hitboxes.push(new DR.Hitbox({
          owner: this,
          team: "enemy",
          type: "cone",
          x: this.x,
          y: this.y,
          dir: this.attackDir,
          range: 68,
          arc: Math.PI * 0.58,
          damage: this.attackDamage * scale,
          ttl: 0.13,
          knockback: 185,
          color: C.hostile,
          kind: "enemy_slash",
          critEnabled: false,
        }));
        this.cooldown = 0.92 * game.dream.getEnemyCooldownScale();
      } else {
        this.shootAnim = 0.28;
        const speed = 250 * (game.dream.has("slow_time") ? 0.9 : 1);
        game.projectiles.push(new DR.Projectile({
          owner: this,
          team: "enemy",
          x: this.x + this.attackDir.x * 20,
          y: this.y + this.attackDir.y * 20,
          vx: this.attackDir.x * speed,
          vy: this.attackDir.y * speed,
          radius: 7,
          damage: this.attackDamage * scale,
          ttl: 3,
          color: C.hostile,
          kind: "night_bolt",
        }));
        this.cooldown = 1.34 * game.dream.getEnemyCooldownScale();
      }
    }

    applyDrag(dt, amount) {
      const drag = Math.exp(-amount * dt);
      this.vx *= drag;
      this.vy *= drag;
    }

    limitSpeed(limit) {
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > limit) {
        this.vx = (this.vx / speed) * limit;
        this.vy = (this.vy / speed) * limit;
      }
    }

    onDeath(source, game) {
      game.combat.spawnBurst(this.x, this.y, this.isMirror ? C.violet : C.enemy, this.isMirror ? 14 : 10, 150);
    }

    draw(renderer) {
      const blink = this.hurt > 0 && Math.floor(this.hurt * 50) % 2 === 0;
      const base = blink ? C.white : this.color;
      const spriteId = this.kind === "melee" ? "past_shadow_chaser" : "memory_marksman";
      if (renderer.assets?.has(spriteId)) {
        let anim = "idle";
        let progress = null;
        const speed = Math.hypot(this.vx, this.vy);
        if (this.hurt > 0) {
          anim = "hurt";
          progress = 1 - this.hurt / 0.16;
        } else if (this.kind === "melee" && (this.attackWindup > 0 || this.attackAnim > 0)) {
          anim = "attack";
          progress = this.attackAnim > 0 ? 1 - this.attackAnim / 0.34 : 0.35;
        } else if (this.kind === "ranged" && this.shootAnim > 0) {
          anim = "shoot";
          progress = 1 - this.shootAnim / 0.28;
        } else if (this.kind === "ranged" && this.attackWindup > 0) {
          anim = "aim";
        } else if (speed > 22 && this.kind === "melee") {
          anim = "run";
        }
        renderer.circle(this.x + 3, this.y + 16, this.radius + 8, C.shadow, 0.34, 18);
        if (this.attackWindup > 0) renderer.ring(this.x, this.y, this.radius + 13, 3, C.hostile, 0.72, 22);
        renderer.assets.draw(renderer, spriteId, anim, this.x, this.y - 5, {
          width: this.kind === "melee" ? 74 : 70,
          height: this.kind === "melee" ? 74 : 70,
          alpha: blink ? 0.48 : (this.isMirror ? 0.72 : 0.98),
          flipX: this.vx < -8,
          progress,
          time: renderer.animationTime + this.id * 0.13,
        });
        if (this.isMirror) renderer.ring(this.x, this.y, this.radius + 7, 3, C.violet, 0.45, 22);
        this.drawHealth(renderer, C.enemy);
        return;
      }
      renderer.circle(this.x + 3, this.y + 6, this.radius + 4, C.shadow, 0.34, 18);
      if (this.attackWindup > 0) renderer.ring(this.x, this.y, this.radius + 11, 3, C.hostile, 0.75, 22);
      renderer.circle(this.x, this.y, this.radius, base, this.isMirror ? 0.72 : 0.96, 22);
      if (this.kind === "ranged") renderer.circle(this.x, this.y, this.radius * 0.48, C.violet, 0.9, 14);
      if (this.isMirror) renderer.ring(this.x, this.y, this.radius + 5, 3, C.violet, 0.45, 22);
      this.drawHealth(renderer, C.enemy);
    }
  }

  class EchoKnight extends DR.Entity {
    constructor(x, y, rng) {
      super(x, y, 31, "boss", 520);
      this.rng = rng;
      this.phase = 1;
      this.baseSpeed = 118;
      this.cooldown = 0.8;
      this.slashCd = 0.6;
      this.dashCd = 2.4;
      this.state = "chase";
      this.stateTimer = 0;
      this.dashDir = { x: 1, y: 0 };
      this.mimics = [];
      this.dashHitPlayer = false;
      this.telegraph = null;
      this.slashAnim = 0;
    }

    queueMimic(event) {
      const delay = this.phase === 2 ? 0.48 : 0.86;
      this.mimics.push({
        timer: delay,
        dir: { x: event.dir.x, y: event.dir.y },
        kind: event.kind,
        damage: event.damage || 16,
      });
    }

    update(dt, game) {
      this.updateStatus(dt);
      this.slashAnim = Math.max(0, this.slashAnim - dt);
      if (this.hp <= this.maxHp * 0.5 && this.phase === 1) {
        this.phase = 2;
        this.baseSpeed *= 1.25;
        this.dashCd = Math.min(this.dashCd, 0.9);
        game.combat.spawnPulse(this.x, this.y, 170, C.boss, 0.35, "enemy", 12);
        game.showBanner("Echo Knight breaks the reflection");
      }

      this.updateMimics(dt, game);
      if (this.hitStun > 0) {
        this.applyDrag(dt, 5);
        this.move(dt, game.bounds);
        return;
      }

      this.slashCd = Math.max(0, this.slashCd - dt);
      this.dashCd = Math.max(0, this.dashCd - dt);
      if (this.state === "dash_windup") {
        this.stateTimer -= dt;
        this.applyDrag(dt, 8);
        if (this.stateTimer <= 0) {
          this.state = "dash";
          this.stateTimer = this.phase === 2 ? 0.34 : 0.28;
          this.dashHitPlayer = false;
        }
      } else if (this.state === "dash") {
        this.stateTimer -= dt;
        const speed = (this.phase === 2 ? 650 : 560) * game.dream.getEnemySpeedScale();
        this.vx = this.dashDir.x * speed;
        this.vy = this.dashDir.y * speed;
        if (!this.dashHitPlayer && Math.hypot(game.player.x - this.x, game.player.y - this.y) < game.player.radius + this.radius + 10) {
          this.dashHitPlayer = true;
          game.combat.damage(game.player, this.phase === 2 ? 18 : 14, this, {
            dir: this.dashDir,
            knockback: 300,
            stun: 0.04,
            kind: "boss_dash",
            critEnabled: false,
          });
        }
        if (this.stateTimer <= 0) {
          this.state = "chase";
          this.dashCd = (this.phase === 2 ? 1.55 : 2.35) * game.dream.getEnemyCooldownScale();
        }
      } else {
        this.updateChase(dt, game);
      }

      this.move(dt, game.bounds);
    }

    updateChase(dt, game) {
      const player = game.player;
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const distance = Math.hypot(dx, dy);
      const dir = U.normalize(dx, dy);
      if (this.dashCd <= 0 && distance > 120) {
        this.state = "dash_windup";
        this.stateTimer = this.phase === 2 ? 0.26 : 0.42;
        this.dashDir = dir;
        this.telegraph = { x1: this.x, y1: this.y, x2: this.x + dir.x * 460, y2: this.y + dir.y * 460, t: this.stateTimer };
        return;
      }
      if (distance < 96 && this.slashCd <= 0) {
        this.bossSlash(game, dir);
        this.slashCd = (this.phase === 2 ? 0.72 : 1.05) * game.dream.getEnemyCooldownScale();
      }
      const desired = distance > 84 ? 1 : -0.2;
      this.vx += dir.x * this.baseSpeed * desired * 5 * dt * game.dream.getEnemySpeedScale();
      this.vy += dir.y * this.baseSpeed * desired * 5 * dt * game.dream.getEnemySpeedScale();
      this.limitSpeed(this.baseSpeed * (this.phase === 2 ? 1.12 : 1) * game.dream.getEnemySpeedScale());
    }

    updateMimics(dt, game) {
      for (const mimic of this.mimics) mimic.timer -= dt;
      const ready = this.mimics.filter((m) => m.timer <= 0);
      this.mimics = this.mimics.filter((m) => m.timer > 0);
      for (const mimic of ready) {
        if (mimic.kind === "skill") {
          const length = this.phase === 2 ? 310 : 250;
          game.hitboxes.push(new DR.Hitbox({
            owner: this,
            team: "enemy",
            type: "line",
            x: this.x,
            y: this.y,
            x2: this.x + mimic.dir.x * length,
            y2: this.y + mimic.dir.y * length,
            width: 56,
            damage: this.phase === 2 ? 17 : 13,
            ttl: 0.16,
            knockback: 260,
            color: C.violet,
            kind: "mimic_skill",
            critEnabled: false,
          }));
        } else {
          this.bossSlash(game, mimic.dir, true);
          if (this.phase === 2) {
            const d = U.rotate(mimic.dir, 0.42);
            this.bossSlash(game, d, true);
          }
        }
      }
    }

    bossSlash(game, dir, mimic) {
      this.slashAnim = mimic ? 0.45 : 0.34;
      game.hitboxes.push(new DR.Hitbox({
        owner: this,
        team: "enemy",
        type: "cone",
        x: this.x,
        y: this.y,
        dir,
        range: mimic ? 116 : 96,
        arc: Math.PI * 0.66,
        damage: this.phase === 2 ? 16 : 12,
        ttl: 0.13,
        knockback: 230,
        color: mimic ? C.violet : C.boss,
        kind: mimic ? "mimic_slash" : "boss_slash",
        critEnabled: false,
      }));
    }

    applyDrag(dt, amount) {
      const drag = Math.exp(-amount * dt);
      this.vx *= drag;
      this.vy *= drag;
    }

    limitSpeed(limit) {
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > limit) {
        this.vx = (this.vx / speed) * limit;
        this.vy = (this.vy / speed) * limit;
      }
    }

    onDeath(source, game) {
      game.combat.spawnPulse(this.x, this.y, 240, C.boss, 0.5, "player", 0);
      game.combat.spawnBurst(this.x, this.y, C.boss, 36, 260);
    }

    draw(renderer) {
      const blink = this.hurt > 0 && Math.floor(this.hurt * 48) % 2 === 0;
      if (this.state === "dash_windup") {
        renderer.line(this.x, this.y, this.x + this.dashDir.x * 520, this.y + this.dashDir.y * 520, 10, C.hostile, 0.35);
      }
      if (renderer.assets?.has("echo_knight_boss")) {
        let anim = this.phase === 2 ? "phase2_idle" : "idle";
        let progress = null;
        const speed = Math.hypot(this.vx, this.vy);
        if (this.state === "dash" || this.state === "dash_windup") {
          anim = "dash";
        } else if (this.slashAnim > 0) {
          anim = "mimic_slash";
          progress = 1 - this.slashAnim / 0.45;
        } else if (speed > 22) {
          anim = "walk";
        }
        renderer.circle(this.x + 4, this.y + 19, this.radius + 11, C.shadow, 0.42, 26);
        renderer.ring(this.x, this.y, this.radius + 14, 4, this.phase === 2 ? C.pink : C.violet, 0.42, 30);
        renderer.assets.draw(renderer, "echo_knight_boss", anim, this.x, this.y - 7, {
          width: 112,
          height: 112,
          alpha: blink ? 0.52 : 0.98,
          flipX: this.vx < -8 || this.dashDir.x < -0.2,
          progress,
          time: renderer.animationTime + this.id * 0.09,
        });
        return;
      }
      renderer.circle(this.x + 4, this.y + 9, this.radius + 9, C.shadow, 0.42, 26);
      renderer.ring(this.x, this.y, this.radius + 12, 4, this.phase === 2 ? C.pink : C.violet, 0.5, 30);
      renderer.circle(this.x, this.y, this.radius, blink ? C.white : C.boss, 0.98, 28);
      renderer.circle(this.x, this.y, this.radius * 0.45, C.violet, 0.92, 18);
    }
  }

  DR.Enemy = Enemy;
  DR.EchoKnight = EchoKnight;
})(window.DR);
