window.DR = window.DR || {};

(function attachPlayer(DR) {
  "use strict";

  const U = DR.Utils;
  const C = DR.Colors;

  class Player extends DR.Entity {
    constructor(x, y) {
      super(x, y, 18, "player", 100);
      this.baseMaxHp = 100;
      this.lastAim = { x: 1, y: 0 };
      this.attackCd = 0;
      this.attackLock = 0;
      this.skillCd = 0;
      this.dashTimer = 0;
      this.dashDir = { x: 1, y: 0 };
      this.dashHit = null;
      this.attackIndex = 0;
      this.orbitalAngle = 0;
      this.blessings = {};
      this.stats = this.defaultStats();
    }

    defaultStats() {
      return {
        attackDamage: 17,
        attackSpeedMult: 1,
        damageMult: 1,
        critChance: 0.06,
        critDamage: 1.85,
        shards: 0,
        projectileSplit: 0,
        projectilePierce: 0,
        killHeal: 0,
        killPulse: 0,
        critSlow: 0,
        critEcho: false,
        echoRepeats: 0,
        thornPulse: 0,
        skillCooldownMult: 1,
        skillSlow: 0,
        orbitals: 0,
        heavyStacks: 0,
        quickPulse: 0,
        voidBloom: 0,
        hitCounter: 0,
      };
    }

    resetRun(x, y) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.maxHp = this.baseMaxHp;
      this.hp = this.maxHp;
      this.alive = true;
      this.invuln = 0;
      this.hurt = 0;
      this.skillCd = 0;
      this.attackCd = 0;
      this.attackLock = 0;
      this.blessings = {};
      this.stats = this.defaultStats();
    }

    update(dt, game) {
      this.updateStatus(dt);
      this.attackCd = Math.max(0, this.attackCd - dt);
      this.attackLock = Math.max(0, this.attackLock - dt);
      this.skillCd = Math.max(0, this.skillCd - dt);
      this.orbitalAngle += dt * (1.8 + this.stats.orbitals * 0.25);

      const input = game.input;
      const axis = input.axis();
      const mouseAim = U.normalize(input.mouse.x - this.x, input.mouse.y - this.y);
      if (input.mouse.moved) this.lastAim = mouseAim;
      else if (axis.x || axis.y) this.lastAim = axis;

      if (input.consumeSkill()) this.trySkill(game, this.lastAim);
      if (input.consumeAttack()) this.tryAttack(game, this.lastAim);

      if (this.dashTimer > 0) {
        this.dashTimer -= dt;
        const dashSpeed = 780 * game.dream.getDashScale();
        this.vx = this.dashDir.x * dashSpeed;
        this.vy = this.dashDir.y * dashSpeed;
      } else {
        this.dashHit = null;
        const accel = 1380;
        const maxSpeed = 245;
        const friction = 11.5 * game.dream.getFrictionScale();
        const attackSlow = this.attackLock > 0.06 ? 0.72 : 1;
        if (axis.x || axis.y) {
          this.vx += axis.x * accel * dt;
          this.vy += axis.y * accel * dt;
        } else {
          const drag = Math.exp(-friction * dt);
          this.vx *= drag;
          this.vy *= drag;
        }
        const speed = Math.hypot(this.vx, this.vy);
        const limit = maxSpeed * attackSlow;
        if (speed > limit) {
          this.vx = (this.vx / speed) * limit;
          this.vy = (this.vy / speed) * limit;
        }
      }

      this.move(dt, game.bounds);
      this.updateOrbitals(dt, game);
    }

    tryAttack(game, aim) {
      if (this.attackCd > 0) return;
      this.performAttack(game, aim, 1, false);
    }

    performAttack(game, aim, scale, isEcho) {
      const stats = this.stats;
      const dir = U.normalize(aim.x, aim.y);
      this.lastAim = dir;
      this.attackIndex += 1;
      const heavyPenalty = 1 + stats.heavyStacks * 0.17;
      const cooldown = (0.38 * heavyPenalty) / Math.max(0.35, stats.attackSpeedMult);
      if (!isEcho) {
        this.attackCd = Math.max(0.12, cooldown);
        this.attackLock = 0.13;
      }
      const damage = stats.attackDamage * scale * (1 + stats.heavyStacks * 0.12);
      const range = 100 + stats.heavyStacks * 10;
      const arc = Math.PI * (0.62 + Math.min(0.24, stats.heavyStacks * 0.04));
      game.hitboxes.push(new DR.Hitbox({
        owner: this,
        team: "player",
        type: "cone",
        x: this.x,
        y: this.y,
        dir,
        range,
        arc,
        damage,
        ttl: 0.105,
        knockback: 145 + stats.heavyStacks * 28,
        stun: 0.055,
        color: isEcho ? C.violet : C.teal,
        kind: isEcho ? "echo_slash" : "slash",
      }));
      game.combat.spawnBurst(this.x + dir.x * 42, this.y + dir.y * 42, isEcho ? C.violet : C.teal, 5, 80);

      if (!isEcho) {
        this.fireShards(game, dir);
        if (stats.quickPulse > 0 && this.attackIndex % 3 === 0) {
          game.schedule(0.08, () => this.spawnQuickPulse(game, dir));
        }
        for (let i = 0; i < stats.echoRepeats; i += 1) {
          const delay = 0.24 + i * 0.16;
          game.schedule(delay, () => {
            if (this.alive) this.performAttack(game, dir, 0.42, true);
          });
        }
        game.recordPlayerAttack({ dir, kind: "slash", damage });
      }
    }

    spawnQuickPulse(game, dir) {
      game.hitboxes.push(new DR.Hitbox({
        owner: this,
        team: "player",
        type: "line",
        x: this.x - dir.y * 26,
        y: this.y + dir.x * 26,
        x2: this.x + dir.x * 128 + dir.y * 26,
        y2: this.y + dir.y * 128 - dir.x * 26,
        width: 32,
        damage: this.stats.attackDamage * 0.55,
        ttl: 0.09,
        knockback: 105,
        color: C.boss,
        kind: "quick_pulse",
      }));
    }

    fireShards(game, dir) {
      if (this.stats.shards <= 0) return;
      const count = Math.min(5, this.stats.shards);
      const baseSpeed = 430 + this.stats.shards * 20;
      const spreadStep = count === 1 ? 0 : 0.16;
      for (let i = 0; i < count; i += 1) {
        const offset = (i - (count - 1) / 2) * spreadStep;
        const d = U.rotate(dir, offset);
        game.projectiles.push(new DR.Projectile({
          owner: this,
          team: "player",
          x: this.x + d.x * 24,
          y: this.y + d.y * 24,
          vx: d.x * baseSpeed,
          vy: d.y * baseSpeed,
          radius: 6,
          damage: 8 + this.stats.shards * 1.5,
          ttl: 1.4,
          pierce: this.stats.projectilePierce,
          color: C.projectile,
          kind: "shard",
        }));
      }
    }

    trySkill(game, aim) {
      if (this.skillCd > 0) return;
      const dir = U.normalize(aim.x, aim.y);
      this.dashTimer = 0.18;
      this.dashDir = dir;
      this.invuln = Math.max(this.invuln, 0.28);
      this.attackLock = 0;
      this.skillCd = 5.8 * this.stats.skillCooldownMult;
      const length = 260 * game.dream.getDashScale();
      game.hitboxes.push(new DR.Hitbox({
        owner: this,
        team: "player",
        type: "line",
        x: this.x,
        y: this.y,
        x2: this.x + dir.x * length,
        y2: this.y + dir.y * length,
        width: 58,
        damage: 29,
        ttl: 0.16,
        knockback: 220,
        stun: 0.08,
        color: C.boss,
        kind: "dream_step",
      }));
      if (this.stats.skillSlow > 0) {
        for (const enemy of game.enemyTargets()) {
          enemy.slowTimer = Math.max(enemy.slowTimer, 1.5 + this.stats.skillSlow);
          enemy.slowFactor = Math.min(enemy.slowFactor, 0.52);
        }
      }
      game.recordPlayerAttack({ dir, kind: "skill", damage: 29 });
      game.shake(8, 0.12);
    }

    updateOrbitals(dt, game) {
      const count = Math.min(4, this.stats.orbitals);
      if (count <= 0) return;
      for (let i = 0; i < count; i += 1) {
        const a = this.orbitalAngle + (i / count) * Math.PI * 2;
        const ox = this.x + Math.cos(a) * 52;
        const oy = this.y + Math.sin(a) * 52;
        for (const enemy of game.enemyTargets()) {
          if (!enemy.alive || Math.hypot(enemy.x - ox, enemy.y - oy) > enemy.radius + 9) continue;
          if (!enemy.orbitalHitAt || game.time - enemy.orbitalHitAt > 0.42) {
            enemy.orbitalHitAt = game.time;
            game.combat.damage(enemy, 7 + count * 2, this, {
              dir: U.normalize(enemy.x - this.x, enemy.y - this.y),
              knockback: 80,
              stun: 0.02,
              kind: "orbital",
              critEnabled: false,
            });
          }
        }
      }
    }

    onKill(target, game) {
      if (this.stats.killHeal > 0) {
        const heal = this.stats.killHeal * (game.dream.has("inverted_wounds") ? 1.4 : 1);
        this.heal(heal);
      }
      if (this.stats.killPulse > 0) {
        game.combat.spawnPulse(target.x, target.y, 74 + this.stats.killPulse * 12, C.teal, 0.2, "player", 6 + this.stats.killPulse * 2);
      }
    }

    onHurt(source, game) {
      if (this.stats.thornPulse > 0) {
        game.combat.spawnPulse(this.x, this.y, 82 + this.stats.thornPulse * 18, C.pink, 0.22, "player", 9 + this.stats.thornPulse * 4);
      }
    }

    draw(renderer) {
      const hurtBlink = this.hurt > 0 && Math.floor(this.hurt * 40) % 2 === 0;
      const invAlpha = this.invuln > 0 ? 0.62 + Math.sin(this.invuln * 55) * 0.18 : 1;
      const speed = Math.hypot(this.vx, this.vy);
      if (renderer.assets?.has("knight_of_the_realm")) {
        let anim = "idle";
        let progress = null;
        if (this.hurt > 0) {
          anim = "hurt";
          progress = 1 - this.hurt / 0.16;
        } else if (this.dashTimer > 0) {
          anim = "dream_step";
          progress = 1 - this.dashTimer / 0.18;
        } else if (this.attackLock > 0) {
          anim = "attack";
          progress = 1 - this.attackLock / 0.13;
        } else if (speed > 28) {
          anim = "run";
        }

        renderer.circle(this.x + 4, this.y + 16, this.radius + 9, C.shadow, 0.34, 20);
        renderer.assets.draw(renderer, "knight_of_the_realm", anim, this.x, this.y - 6, {
          width: 82,
          height: 82,
          alpha: hurtBlink ? 0.5 : invAlpha,
          flipX: this.lastAim.x < -0.12,
          progress,
          time: renderer.animationTime + this.id * 0.07,
        });
        if (hurtBlink) renderer.circle(this.x, this.y, this.radius + 9, C.white, 0.2, 18);

        const count = Math.min(4, this.stats.orbitals);
        for (let i = 0; i < count; i += 1) {
          const a = this.orbitalAngle + (i / count) * Math.PI * 2;
          renderer.assets.draw(renderer, "memory_weapons", "mirror_shard", this.x + Math.cos(a) * 52, this.y + Math.sin(a) * 52, {
            width: 28,
            height: 28,
            time: renderer.animationTime + i * 0.2,
          });
        }
        return;
      }

      renderer.circle(this.x + 4, this.y + 7, this.radius + 5, C.shadow, 0.36, 20);
      renderer.circle(this.x, this.y, this.radius + 6, C.playerDark, 0.34 * invAlpha, 22);
      renderer.circle(this.x, this.y, this.radius, hurtBlink ? C.white : C.player, invAlpha, 24);
      renderer.line(this.x, this.y, this.x + this.lastAim.x * 30, this.y + this.lastAim.y * 30, 5, C.white, 0.8);

      const count = Math.min(4, this.stats.orbitals);
      for (let i = 0; i < count; i += 1) {
        const a = this.orbitalAngle + (i / count) * Math.PI * 2;
        renderer.circle(this.x + Math.cos(a) * 52, this.y + Math.sin(a) * 52, 8, C.boss, 0.95, 14);
      }
    }
  }

  DR.Player = Player;
})(window.DR);
