window.DR = window.DR || {};

window.DR.AnimationManifest = {
  game: "Dreambound Realm",
  chapter: "Chapter I - Memory Tide",
  sprites: [
    {
      id: "knight_of_the_realm",
      image: "assets/animation/characters/knight_of_the_realm.png",
      frameWidth: 96,
      frameHeight: 96,
      animations: {
        idle: { row: 0, frames: 8, fps: 8, loop: true },
        run: { row: 1, frames: 8, fps: 12, loop: true },
        attack: { row: 2, frames: 8, fps: 16, loop: false },
        dream_step: { row: 3, frames: 8, fps: 18, loop: false },
        hurt: { row: 4, frames: 6, fps: 12, loop: false },
      },
    },
    {
      id: "kotori_memory_fragment",
      image: "assets/animation/characters/kotori_memory_fragment.png",
      frameWidth: 96,
      frameHeight: 96,
      animations: {
        idle: { row: 0, frames: 8, fps: 8, loop: true },
        guide: { row: 1, frames: 8, fps: 10, loop: true },
        blessing: { row: 2, frames: 8, fps: 12, loop: true },
      },
    },
    {
      id: "memory_wisp_npc",
      image: "assets/animation/npc/memory_wisp_npc.png",
      frameWidth: 96,
      frameHeight: 96,
      animations: {
        idle: { row: 0, frames: 8, fps: 8, loop: true },
        pulse: { row: 1, frames: 8, fps: 10, loop: true },
      },
    },
    {
      id: "mushroom_elder_npc",
      image: "assets/animation/npc/mushroom_elder_npc.png",
      frameWidth: 96,
      frameHeight: 96,
      animations: {
        idle: { row: 0, frames: 8, fps: 7, loop: true },
        bless: { row: 1, frames: 8, fps: 10, loop: true },
      },
    },
    {
      id: "past_shadow_chaser",
      image: "assets/animation/enemies/past_shadow_chaser.png",
      frameWidth: 96,
      frameHeight: 96,
      animations: {
        idle: { row: 0, frames: 8, fps: 8, loop: true },
        run: { row: 1, frames: 8, fps: 12, loop: true },
        attack: { row: 2, frames: 8, fps: 14, loop: false },
        hurt: { row: 3, frames: 6, fps: 12, loop: false },
      },
    },
    {
      id: "memory_marksman",
      image: "assets/animation/enemies/memory_marksman.png",
      frameWidth: 96,
      frameHeight: 96,
      animations: {
        idle: { row: 0, frames: 8, fps: 8, loop: true },
        aim: { row: 1, frames: 8, fps: 8, loop: true },
        shoot: { row: 2, frames: 8, fps: 16, loop: false },
        hurt: { row: 3, frames: 6, fps: 12, loop: false },
      },
    },
    {
      id: "echo_knight_boss",
      image: "assets/animation/boss/echo_knight_boss.png",
      frameWidth: 96,
      frameHeight: 96,
      animations: {
        idle: { row: 0, frames: 8, fps: 8, loop: true },
        walk: { row: 1, frames: 8, fps: 10, loop: true },
        mimic_slash: { row: 2, frames: 8, fps: 15, loop: false },
        dash: { row: 3, frames: 8, fps: 18, loop: false },
        phase2_idle: { row: 4, frames: 8, fps: 10, loop: true },
      },
    },
    {
      id: "memory_weapons",
      image: "assets/animation/weapons/memory_weapons.png",
      frameWidth: 64,
      frameHeight: 64,
      animations: {
        sword_slash: { row: 0, frames: 8, fps: 18, loop: false },
        dream_step_trail: { row: 1, frames: 8, fps: 18, loop: false },
        mirror_shard: { row: 2, frames: 8, fps: 14, loop: true },
        night_bolt: { row: 3, frames: 8, fps: 14, loop: true },
        blessing_orb: { row: 4, frames: 8, fps: 10, loop: true },
        shield_flash: { row: 5, frames: 8, fps: 14, loop: false },
      },
    },
    {
      id: "memory_combat_effects",
      image: "assets/animation/effects/memory_combat_effects.png",
      frameWidth: 64,
      frameHeight: 64,
      animations: {
        hit_spark: { row: 0, frames: 8, fps: 20, loop: false },
        crit_bloom: { row: 1, frames: 8, fps: 16, loop: false },
        memory_fragment: { row: 2, frames: 8, fps: 14, loop: false },
        spawn_ripple: { row: 3, frames: 8, fps: 12, loop: false },
        door_open: { row: 4, frames: 8, fps: 12, loop: false },
      },
    },
    {
      id: "memory_tide_loop",
      image: "assets/animation/scenes/memory_tide_loop.png",
      frameWidth: 480,
      frameHeight: 270,
      animations: {
        loop: { row: 0, frames: 6, fps: 6, loop: true },
      },
    },
  ],
};
