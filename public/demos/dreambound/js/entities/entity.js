window.DR = window.DR || {};

(function attachEntity(DR) {
  "use strict";

  class Entity {
    constructor(x, y, radius, team, maxHp) {
      this.id = DR.Utils.uid();
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.radius = radius;
      this.team = team;
      this.maxHp = maxHp;
      this.hp = maxHp;
      this.alive = true;
      this.invuln = 0;
      this.hurt = 0;
      this.hitStun = 0;
      this.slowTimer = 0;
      this.slowFactor = 1;
      this.flashColor = null;
      this.isMirror = false;
      this.damageScale = 1;
    }

    get pos() {
      return { x: this.x, y: this.y };
    }

    updateStatus(dt) {
      this.invuln = Math.max(0, this.invuln - dt);
      this.hurt = Math.max(0, this.hurt - dt);
      this.hitStun = Math.max(0, this.hitStun - dt);
      this.slowTimer = Math.max(0, this.slowTimer - dt);
      if (this.slowTimer <= 0) this.slowFactor = 1;
    }

    move(dt, bounds) {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      if (bounds) {
        this.x = DR.Utils.clamp(this.x, bounds.left + this.radius, bounds.right - this.radius);
        this.y = DR.Utils.clamp(this.y, bounds.top + this.radius, bounds.bottom - this.radius);
      }
    }

    receiveDamage(amount, source, game, options) {
      if (!this.alive) return false;
      if (this.invuln > 0 && this.team === "player") return false;
      const final = Math.max(0, amount);
      if (final <= 0) return false;

      this.hp -= final;
      this.hurt = 0.16;
      this.hitStun = Math.max(this.hitStun, options?.stun || 0);

      const dir = options?.dir || DR.Utils.normalize(this.x - (source?.x || this.x), this.y - (source?.y || this.y));
      const knock = (options?.knockback || 0) * game.dream.getKnockbackScale();
      this.vx += dir.x * knock;
      this.vy += dir.y * knock;

      if (this.team === "player") {
        this.invuln = Math.max(this.invuln, 0.72);
      }

      if (this.hp <= 0) {
        this.hp = 0;
        this.alive = false;
        this.onDeath?.(source, game);
        return true;
      }
      return false;
    }

    heal(amount) {
      if (!this.alive) return;
      this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    drawHealth(renderer, color) {
      if (this.hp >= this.maxHp || !this.alive) return;
      const w = this.radius * 2.2;
      const y = this.y - this.radius - 12;
      renderer.rect(this.x, y, w, 4, DR.Utils.color("#000000"), 0.42);
      renderer.rect(this.x - w / 2 + (w * (this.hp / this.maxHp)) / 2, y, w * (this.hp / this.maxHp), 4, color, 0.95);
    }
  }

  DR.Entity = Entity;
})(window.DR);
