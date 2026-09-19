window.DR = window.DR || {};

(function attachGame(DR) {
  "use strict";

  const U = DR.Utils;
  const C = DR.Colors;

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.renderer = new DR.Renderer(canvas);
      this.assets = new DR.SpriteAssets();
      this.renderer.assets = this.assets;
      this.input = new DR.Input(canvas);
      this.rng = U.mulberry32(Date.now() & 0xffffffff);
      this.seed = Date.now() & 0xffffffff;
      this.time = 0;
      this.last = 0;
      this.state = "title";
      this.bounds = { left: 48, top: 86, right: 960, bottom: 640 };
      this.player = new DR.Player(300, 300);
      this.combat = new DR.CombatSystem(this);
      this.dream = new DR.DreamManager(this);
      this.blessings = new DR.BlessingSystem(this);
      this.enemies = [];
      this.boss = null;
      this.hitboxes = [];
      this.projectiles = [];
      this.particles = [];
      this.scheduled = [];
      this.chapter = null;
      this.layerIndex = 0;
      this.roomIndex = 0;
      this.currentRoom = null;
      this.roomComplete = false;
      this.doorOpen = false;
      this.transitionLock = 0;
      this.hitStop = 0;
      this.shakePower = 0;
      this.shakeTimer = 0;
      this.pendingRewardCount = 0;
      this.cacheDom();
      this.bindUi();
      this.resize();
      this.assets.load().then(() => {
        if (this.assets.ready) this.showBanner("Animation assets loaded");
      });
      window.addEventListener("resize", () => this.resize());
    }

    cacheDom() {
      this.dom = {
        title: document.getElementById("titleScreen"),
        end: document.getElementById("endScreen"),
        endTitle: document.getElementById("endTitle"),
        endKicker: document.getElementById("endKicker"),
        startButton: document.getElementById("startButton"),
        restartButton: document.getElementById("restartButton"),
        choicePanel: document.getElementById("choicePanel"),
        choiceTitle: document.getElementById("choiceTitle"),
        choiceSubtitle: document.getElementById("choiceSubtitle"),
        choiceList: document.getElementById("choiceList"),
        hpFill: document.getElementById("hpFill"),
        hpText: document.getElementById("hpText"),
        skillFill: document.getElementById("skillFill"),
        skillText: document.getElementById("skillText"),
        roomReadout: document.getElementById("roomReadout"),
        buildReadout: document.getElementById("buildReadout"),
        modifierReadout: document.getElementById("modifierReadout"),
        banner: document.getElementById("banner"),
        bossHud: document.getElementById("bossHud"),
        bossFill: document.getElementById("bossFill"),
      };
    }

    bindUi() {
      this.dom.startButton.addEventListener("click", () => this.startRun());
      this.dom.restartButton.addEventListener("click", () => this.startRun());
      window.addEventListener("keydown", (event) => {
        if (this.state === "title" && event.key === "Enter") this.startRun();
      });
    }

    resize() {
      this.renderer.resize(window.innerWidth, window.innerHeight);
      const w = this.renderer.width;
      const h = this.renderer.height;
      this.bounds = {
        left: Math.max(34, w * 0.055),
        right: w - Math.max(34, w * 0.055),
        top: Math.max(92, h * 0.15),
        bottom: h - Math.max(44, h * 0.08),
      };
    }

    startRun() {
      this.seed = (Date.now() ^ Math.floor(Math.random() * 999999)) >>> 0;
      this.rng = U.mulberry32(this.seed);
      this.time = 0;
      this.chapter = DR.LevelGenerator.generate(this.seed);
      this.layerIndex = 0;
      this.roomIndex = 0;
      this.enemies = [];
      this.boss = null;
      this.hitboxes = [];
      this.projectiles = [];
      this.particles = [];
      this.scheduled = [];
      this.dream.reset();
      this.player.resetRun((this.bounds.left + this.bounds.right) / 2, this.bounds.bottom - 70);
      this.dom.title.classList.add("hidden");
      this.dom.end.classList.add("hidden");
      this.dream.addLayerRule(1, this.rng);
      this.enterRoom(this.chapter.layers[0].rooms[0]);
    }

    enterRoom(room) {
      this.currentRoom = room;
      this.state = "playing";
      this.roomComplete = false;
      this.doorOpen = false;
      this.transitionLock = 0.38;
      this.enemies = [];
      this.boss = null;
      this.hitboxes = [];
      this.projectiles = [];
      this.particles = [];
      this.scheduled = [];
      this.player.x = (this.bounds.left + this.bounds.right) / 2;
      this.player.y = this.bounds.bottom - 60;
      this.player.vx = 0;
      this.player.vy = 0;

      if (room.type === "combat") {
        this.spawnCombatRoom(room);
        this.showBanner(`Memory Tide ${room.id}: past shadows gather`);
      } else if (room.type === "event") {
        this.openEventRoom();
      } else if (room.type === "blessing") {
        this.offerBlessing("Lucid Shrine", 1, () => this.openDoor());
      } else if (room.type === "boss") {
        this.boss = new DR.EchoKnight((this.bounds.left + this.bounds.right) / 2, this.bounds.top + 130, this.rng);
        this.showBanner("Echo Knight: reflected regret");
      }
      this.updateHud();
    }

    spawnCombatRoom(room) {
      const roomRng = U.mulberry32(room.seed);
      const baseCount = 2 + room.layer + U.randInt(roomRng, 0, 2);
      const rewardPressure = this.dream.rewardBonus() > 0 ? 1 : 0;
      for (let i = 0; i < baseCount + rewardPressure; i += 1) {
        const kind = roomRng() < 0.62 ? "melee" : "ranged";
        this.spawnEnemy(kind, roomRng);
      }
    }

    spawnEnemy(kind, rng, mirror) {
      const x = U.randRange(rng, this.bounds.left + 55, this.bounds.right - 55);
      const y = U.randRange(rng, this.bounds.top + 65, this.bounds.bottom - 145);
      const layer = this.currentRoom?.layer || 1;
      const hpScale = 1 + (layer - 1) * 0.25;
      const enemy = new DR.Enemy(x, y, {
        kind,
        radius: kind === "melee" ? 18 : 16,
        hp: (kind === "melee" ? 42 : 34) * hpScale * (mirror ? 0.52 : 1),
        speed: kind === "melee" ? 118 + layer * 6 : 92 + layer * 4,
        attackRange: kind === "melee" ? 52 : 360,
        damage: kind === "melee" ? 11 + layer : 9 + layer,
        rng,
        color: kind === "melee" ? C.enemy : C.enemyAlt,
        mirrorDamageMult: mirror ? 0.68 : 1,
      });
      enemy.isMirror = !!mirror;
      this.enemies.push(enemy);
      if (!mirror && this.dream.shouldMirrorEnemy(rng)) {
        const clone = new DR.Enemy(
          U.clamp(this.bounds.right - x + this.bounds.left, this.bounds.left + 45, this.bounds.right - 45),
          U.clamp(y + U.randRange(rng, -28, 28), this.bounds.top + 45, this.bounds.bottom - 45),
          {
            kind,
            radius: kind === "melee" ? 16 : 15,
            hp: (kind === "melee" ? 22 : 18) * hpScale,
            speed: kind === "melee" ? 128 : 100,
            attackRange: kind === "melee" ? 50 : 340,
            damage: kind === "melee" ? 7 + layer : 6 + layer,
            rng,
            color: C.violet,
            mirrorDamageMult: 0.68,
          },
        );
        clone.isMirror = true;
        this.enemies.push(clone);
      }
    }

    openEventRoom() {
      const events = [
        {
          name: "Serenity Lake Memory",
          desc: "Recover a large amount of HP and open the way.",
          run: () => {
            this.player.heal(32);
            this.openDoor();
          },
        },
        {
          name: "Cracked Memory Altar",
          desc: "Lose HP now, then take an extra blessing.",
          run: () => {
            this.combat.damage(this.player, 12, { team: "event", x: this.player.x, y: this.player.y }, { knockback: 0, critEnabled: false });
            this.offerBlessing("Cracked Altar", 1, () => this.openDoor());
          },
        },
        {
          name: "White Butterfly Omen",
          desc: "Fight an ambush for two blessing choices.",
          run: () => {
            this.state = "playing";
            this.pendingRewardCount = 2;
            this.roomComplete = false;
            this.doorOpen = false;
            for (let i = 0; i < 4; i += 1) this.spawnEnemy(i % 2 ? "ranged" : "melee", this.rng);
            this.showBanner("The white butterfly calls the past forward");
          },
        },
        {
          name: "Kotori's Glass Nerve",
          desc: "Gain critical chance, but the memory cuts back.",
          run: () => {
            this.player.stats.critChance += 0.08;
            this.player.hurt = 0.22;
            this.openDoor();
          },
        },
      ];
      const choice = U.pick(this.rng, events);
      this.showEventChoice(choice);
    }

    showEventChoice(eventDef) {
      this.state = "choice";
      this.dom.choicePanel.classList.remove("hidden");
      this.dom.choiceTitle.textContent = eventDef.name;
      this.dom.choiceSubtitle.textContent = "Event Room";
      this.dom.choiceList.innerHTML = "";
      const button = document.createElement("button");
      button.className = "choice-card";
      button.innerHTML = [
        `<div class="choice-name">${eventDef.name}</div>`,
        '<div class="choice-school">Dream Event</div>',
        `<div class="choice-desc">${eventDef.desc}</div>`,
      ].join("");
      button.addEventListener("click", () => {
        this.dom.choicePanel.classList.add("hidden");
        eventDef.run();
      });
      this.dom.choiceList.appendChild(button);
    }

    offerBlessing(title, count, done) {
      this.state = "choice";
      this.dom.choicePanel.classList.remove("hidden");
      this.dom.choiceTitle.textContent = title || "Dream Blessing";
      this.dom.choiceSubtitle.textContent = count > 1 ? `Choose one (${count} remaining)` : "Choose one";
      this.dom.choiceList.innerHTML = "";
      const choices = this.blessings.roll(3).map((def) => this.blessings.describeChoice(def));
      for (const choice of choices) {
        const button = document.createElement("button");
        button.className = "choice-card";
        button.innerHTML = [
          `<div class="choice-name">${choice.name}</div>`,
          `<div class="choice-school">${choice.school}</div>`,
          `<div class="choice-desc">${choice.desc}</div>`,
          `<div class="choice-stack">Stack ${choice.stack + 1}</div>`,
        ].join("");
        button.addEventListener("click", () => {
          this.blessings.apply(choice.id);
          if (count > 1) {
            this.offerBlessing(title, count - 1, done);
          } else {
            this.dom.choicePanel.classList.add("hidden");
            done?.();
          }
          this.updateHud();
        });
        this.dom.choiceList.appendChild(button);
      }
    }

    openDoor() {
      this.state = "playing";
      this.roomComplete = true;
      this.doorOpen = true;
      this.showBanner("The gate opens");
    }

    completeCombatRoom() {
      if (this.roomComplete) return;
      const rewards = this.pendingRewardCount || 1;
      this.pendingRewardCount = 0;
      this.roomComplete = true;
      this.offerBlessing("Dream Blessing", rewards, () => this.openDoor());
    }

    advanceRoom() {
      if (this.transitionLock > 0) return;
      this.transitionLock = 0.5;
      const layer = this.chapter.layers[this.layerIndex];
      this.roomIndex += 1;
      if (this.roomIndex < layer.rooms.length) {
        this.enterRoom(layer.rooms[this.roomIndex]);
        return;
      }
      if (this.layerIndex < 2) {
        this.layerIndex += 1;
        this.roomIndex = 0;
        this.dream.addLayerRule(this.layerIndex + 1, this.rng);
        this.enterRoom(this.chapter.layers[this.layerIndex].rooms[0]);
      } else {
        this.enterRoom({ id: "Boss", layer: 3, index: layer.rooms.length + 1, type: "boss", seed: this.seed ^ 0xabcd });
      }
    }

    recordPlayerAttack(event) {
      if (this.boss && this.boss.alive) this.boss.queueMimic(event);
    }

    enemyTargets() {
      const targets = this.enemies.filter((enemy) => enemy.alive);
      if (this.boss && this.boss.alive) targets.push(this.boss);
      return targets;
    }

    update(rawDt) {
      const clamped = Math.min(0.033, rawDt);
      if (this.state === "title" || this.state === "choice" || this.state === "ended") {
        this.input.endFrame();
        this.render();
        return;
      }
      if (!this.player.alive) {
        this.endRun(false);
        return;
      }

      this.time += clamped;
      this.transitionLock = Math.max(0, this.transitionLock - clamped);
      this.dream.update(clamped);
      this.updateScheduled(clamped);
      this.shakeTimer = Math.max(0, this.shakeTimer - clamped);
      const dt = this.hitStop > 0 ? clamped * 0.08 : clamped;
      this.hitStop = Math.max(0, this.hitStop - clamped);

      this.player.update(dt, this);
      for (const enemy of this.enemies) enemy.update(dt, this);
      if (this.boss && this.boss.alive) this.boss.update(dt, this);

      this.hitboxes = this.hitboxes.filter((hitbox) => hitbox.update(dt, this));
      this.projectiles = this.projectiles.filter((projectile) => projectile.update(dt, this));
      this.particles = this.particles.filter((particle) => particle.update(dt, this));
      this.enemies = this.enemies.filter((enemy) => enemy.alive);

      this.resolveBodyCollisions();
      if (this.currentRoom?.type === "combat" && this.enemies.length === 0 && !this.roomComplete) {
        this.completeCombatRoom();
      }
      if (this.currentRoom?.type === "boss" && this.boss && !this.boss.alive) {
        this.endRun(true);
      }
      if (this.doorOpen && this.player.y < this.bounds.top + 25 && Math.abs(this.player.x - (this.bounds.left + this.bounds.right) / 2) < 78) {
        this.advanceRoom();
      }
      if (this.doorOpen && this.input.consumeInteract()) this.advanceRoom();

      this.updateHud();
      this.input.endFrame();
      this.render();
    }

    updateScheduled(dt) {
      for (const job of this.scheduled) job.t -= dt;
      const ready = this.scheduled.filter((job) => job.t <= 0);
      this.scheduled = this.scheduled.filter((job) => job.t > 0);
      for (const job of ready) job.fn();
    }

    schedule(delay, fn) {
      this.scheduled.push({ t: delay, fn });
    }

    resolveBodyCollisions() {
      const bodies = this.enemyTargets();
      for (const enemy of bodies) {
        const dx = enemy.x - this.player.x;
        const dy = enemy.y - this.player.y;
        const distance = Math.hypot(dx, dy);
        const min = enemy.radius + this.player.radius;
        if (distance > 0 && distance < min) {
          const push = (min - distance) * 0.5;
          const nx = dx / distance;
          const ny = dy / distance;
          enemy.x += nx * push;
          enemy.y += ny * push;
          this.player.x -= nx * push * 0.35;
          this.player.y -= ny * push * 0.35;
        }
      }
    }

    shake(power, duration) {
      this.shakePower = Math.max(this.shakePower, power);
      this.shakeTimer = Math.max(this.shakeTimer, duration);
    }

    showBanner(text) {
      this.dom.banner.textContent = text;
      this.dom.banner.classList.remove("hidden");
      window.clearTimeout(this.bannerTimer);
      this.bannerTimer = window.setTimeout(() => this.dom.banner.classList.add("hidden"), 1700);
    }

    updateHud() {
      const hpPct = this.player.maxHp > 0 ? this.player.hp / this.player.maxHp : 0;
      this.dom.hpFill.style.transform = `scaleX(${U.clamp(hpPct, 0, 1)})`;
      this.dom.hpText.textContent = `${Math.ceil(this.player.hp)} / ${Math.ceil(this.player.maxHp)}`;
      const skillBase = 5.8 * this.player.stats.skillCooldownMult;
      const skillPct = skillBase > 0 ? 1 - this.player.skillCd / skillBase : 1;
      this.dom.skillFill.style.transform = `scaleX(${U.clamp(skillPct, 0, 1)})`;
      this.dom.skillText.textContent = this.player.skillCd <= 0 ? "Ready" : `${this.player.skillCd.toFixed(1)}s`;
      const layer = this.currentRoom?.layer || this.layerIndex + 1;
      const room = this.currentRoom?.type === "boss" ? "Boss" : `Room ${this.currentRoom?.index || 1}`;
      this.dom.roomReadout.textContent = `Memory Tide L${layer} - ${room}`;
      this.dom.buildReadout.textContent = this.blessings.buildTags().join(" + ");
      this.dom.modifierReadout.innerHTML = "";
      for (const label of this.dream.labels()) {
        const chip = document.createElement("div");
        chip.className = "modifier-chip";
        chip.textContent = label;
        this.dom.modifierReadout.appendChild(chip);
      }
      if (this.boss && this.boss.alive) {
        this.dom.bossHud.classList.remove("hidden");
        this.dom.bossFill.style.transform = `scaleX(${U.clamp(this.boss.hp / this.boss.maxHp, 0, 1)})`;
      } else {
        this.dom.bossHud.classList.add("hidden");
      }
    }

    endRun(victory) {
      this.state = "ended";
      this.dom.end.classList.remove("hidden");
      this.dom.endKicker.textContent = victory ? "Kotori's memory returns" : "Memory Tide rejects you";
      this.dom.endTitle.textContent = victory ? "Chapter I Cleared" : "Run Ended";
      this.showBanner(victory ? "Echo Knight defeated" : "You wake before the ending");
    }

    render() {
      const shake = this.shakeTimer > 0 ? this.shakePower * (this.shakeTimer / 0.22) : 0;
      const sx = shake ? (this.rng() - 0.5) * shake : 0;
      const sy = shake ? (this.rng() - 0.5) * shake : 0;
      this.renderer.begin(C.bg);
      this.renderer.animationTime = this.time;
      this.renderer.setOffset(sx, sy);
      this.drawRoom();
      for (const projectile of this.projectiles) projectile.draw(this.renderer);
      for (const hitbox of this.hitboxes) hitbox.draw(this.renderer);
      for (const enemy of this.enemies) enemy.draw(this.renderer);
      if (this.boss && this.boss.alive) this.boss.draw(this.renderer);
      this.player.draw(this.renderer);
      for (const particle of this.particles) particle.draw(this.renderer);
      this.renderer.flush();
    }

    drawRoom() {
      const b = this.bounds;
      const w = b.right - b.left;
      const h = b.bottom - b.top;
      this.renderer.rect((b.left + b.right) / 2, (b.top + b.bottom) / 2, w, h, C.floorA, 1);
      this.assets.draw(this.renderer, "memory_tide_loop", "loop", (b.left + b.right) / 2, (b.top + b.bottom) / 2, {
        width: w,
        height: h,
        alpha: 0.72,
        time: this.time * 0.72,
      });
      const cell = 72;
      for (let y = b.top + cell / 2; y < b.bottom; y += cell) {
        for (let x = b.left + cell / 2; x < b.right; x += cell) {
          const tint = ((Math.floor(x / cell) + Math.floor(y / cell)) % 2) ? C.floorB : C.floorA;
          this.renderer.rect(x, y, cell - 2, cell - 2, tint, 0.42);
        }
      }
      this.renderer.line(b.left, b.top, b.right, b.top, 5, C.violet, 0.55);
      this.renderer.line(b.left, b.bottom, b.right, b.bottom, 5, C.teal, 0.38);
      this.renderer.line(b.left, b.top, b.left, b.bottom, 5, C.violet, 0.38);
      this.renderer.line(b.right, b.top, b.right, b.bottom, 5, C.violet, 0.38);

      const doorX = (b.left + b.right) / 2;
      if (this.doorOpen) {
        const pulse = 1 + Math.sin(this.time * 5) * 0.08;
        this.renderer.circle(doorX, b.top + 8, 48 * pulse, C.door, 0.22, 28);
        this.renderer.rect(doorX, b.top + 8, 118, 18, C.door, 0.72);
        this.assets.draw(this.renderer, "memory_combat_effects", "door_open", doorX, b.top + 18, {
          width: 112,
          height: 56,
          alpha: 0.9,
          time: this.time,
        });
      } else {
        this.renderer.rect(doorX, b.top + 8, 112, 12, C.enemy, 0.38);
      }

      if (this.dream.has("curved_shots")) {
        for (let i = 0; i < 4; i += 1) {
          const y = b.top + 80 + i * 90 + Math.sin(this.time + i) * 14;
          this.renderer.line(b.left + 50, y, b.right - 50, y + Math.sin(this.time * 1.4 + i) * 28, 2, C.projectile, 0.12);
        }
      }
      if (this.dream.has("weightless")) {
        this.renderer.ring((b.left + b.right) / 2, (b.top + b.bottom) / 2, Math.min(w, h) * 0.42, 4, C.teal, 0.08, 48);
      }
      this.drawRoomActors();
    }

    drawRoomActors() {
      if (!this.assets.ready) return;
      const b = this.bounds;
      const cx = (b.left + b.right) / 2;
      const cy = (b.top + b.bottom) / 2;
      if (this.currentRoom?.type === "event") {
        this.assets.draw(this.renderer, "kotori_memory_fragment", "guide", cx - 48, cy - 10, {
          width: 82,
          height: 82,
          alpha: 0.84,
          time: this.time,
        });
        this.assets.draw(this.renderer, "memory_wisp_npc", "pulse", cx + 44, cy - 26, {
          width: 66,
          height: 66,
          alpha: 0.86,
          time: this.time + 0.4,
        });
      } else if (this.currentRoom?.type === "blessing") {
        this.assets.draw(this.renderer, "mushroom_elder_npc", "bless", cx - 30, cy - 4, {
          width: 82,
          height: 82,
          time: this.time,
        });
        this.assets.draw(this.renderer, "memory_weapons", "blessing_orb", cx + 38, cy - 30, {
          width: 58,
          height: 58,
          time: this.time,
        });
      }
    }

    loop(now) {
      const seconds = now / 1000;
      const dt = this.last ? seconds - this.last : 0;
      this.last = seconds;
      this.update(dt);
      requestAnimationFrame((t) => this.loop(t));
    }
  }

  DR.Game = Game;
})(window.DR);
