window.DR = window.DR || {};

(function attachAssets(DR) {
  "use strict";

  class SpriteAssets {
    constructor(manifest) {
      this.manifest = manifest || DR.AnimationManifest;
      this.sprites = new Map();
      this.ready = false;
      this.failed = false;
      this.error = null;
    }

    load() {
      if (!this.manifest) {
        this.failed = true;
        this.error = new Error("Animation manifest missing");
        return Promise.resolve(this);
      }

      const jobs = this.manifest.sprites.map((entry) => {
        const sprite = { ...entry, imageObject: new Image(), loaded: false };
        this.sprites.set(entry.id, sprite);
        return new Promise((resolve) => {
          sprite.imageObject.onload = () => {
            sprite.loaded = true;
            resolve(sprite);
          };
          sprite.imageObject.onerror = () => {
            sprite.loaded = false;
            resolve(sprite);
          };
          sprite.imageObject.src = entry.image;
        });
      });

      return Promise.all(jobs).then(() => {
        this.ready = Array.from(this.sprites.values()).every((sprite) => sprite.loaded);
        this.failed = !this.ready;
        return this;
      });
    }

    has(id) {
      const sprite = this.sprites.get(id);
      return !!(sprite && sprite.loaded);
    }

    draw(renderer, id, animationName, x, y, options) {
      const sprite = this.sprites.get(id);
      if (!sprite || !sprite.loaded) return false;
      const animation = sprite.animations[animationName] || sprite.animations[Object.keys(sprite.animations)[0]];
      if (!animation) return false;

      const time = options?.time ?? renderer.animationTime ?? 0;
      const frame = getFrame(animation, time, options?.progress, options?.seedOffset || 0);
      const fw = sprite.frameWidth;
      const fh = sprite.frameHeight;
      const scale = options?.scale || 1;
      const width = options?.width || fw * scale;
      const height = options?.height || fh * scale;
      const sx = frame * fw;
      const sy = animation.row * fh;
      renderer.sprite(sprite.imageObject, sx, sy, fw, fh, x, y, width, height, options);
      return true;
    }
  }

  function getFrame(animation, time, progress, seedOffset) {
    if (progress != null) {
      const p = DR.Utils.clamp(progress, 0, 0.999);
      return Math.floor(p * animation.frames);
    }
    const raw = Math.floor((time + seedOffset) * animation.fps);
    if (animation.loop) return raw % animation.frames;
    return Math.min(animation.frames - 1, raw);
  }

  DR.SpriteAssets = SpriteAssets;
})(window.DR);
