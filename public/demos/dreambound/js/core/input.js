window.DR = window.DR || {};

(function attachInput(DR) {
  "use strict";

  class Input {
    constructor(canvas) {
      this.canvas = canvas;
      this.keys = new Set();
      this.justKeys = new Set();
      this.mouse = { x: 0, y: 0, down: false, right: false, moved: false };
      this.attackPressed = false;
      this.skillPressed = false;
      this.interactPressed = false;

      window.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();
        if (!this.keys.has(key)) this.justKeys.add(key);
        this.keys.add(key);
        if (key === " " || key === "spacebar") {
          event.preventDefault();
          this.skillPressed = true;
        }
        if (key === "j" || key === "z" || key === "enter") this.attackPressed = true;
        if (key === "e" || key === "f") this.interactPressed = true;
      });

      window.addEventListener("keyup", (event) => {
        this.keys.delete(event.key.toLowerCase());
      });

      canvas.addEventListener("pointermove", (event) => {
        this.setMouse(event);
        this.mouse.moved = true;
      });

      canvas.addEventListener("pointerdown", (event) => {
        this.setMouse(event);
        canvas.setPointerCapture?.(event.pointerId);
        if (event.button === 2) {
          this.mouse.right = true;
          this.skillPressed = true;
        } else {
          this.mouse.down = true;
          this.attackPressed = true;
        }
      });

      canvas.addEventListener("pointerup", (event) => {
        this.setMouse(event);
        if (event.button === 2) this.mouse.right = false;
        else this.mouse.down = false;
      });

      canvas.addEventListener("contextmenu", (event) => event.preventDefault());
    }

    setMouse(event) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = event.clientX - rect.left;
      this.mouse.y = event.clientY - rect.top;
    }

    axis() {
      let x = 0;
      let y = 0;
      if (this.keys.has("a") || this.keys.has("arrowleft")) x -= 1;
      if (this.keys.has("d") || this.keys.has("arrowright")) x += 1;
      if (this.keys.has("w") || this.keys.has("arrowup")) y -= 1;
      if (this.keys.has("s") || this.keys.has("arrowdown")) y += 1;
      const n = DR.Utils.normalize(x, y);
      if (x === 0 && y === 0) return { x: 0, y: 0 };
      return n;
    }

    consumeAttack() {
      const value = this.attackPressed || this.mouse.down;
      this.attackPressed = false;
      return value;
    }

    consumeSkill() {
      const value = this.skillPressed;
      this.skillPressed = false;
      return value;
    }

    consumeInteract() {
      const value = this.interactPressed;
      this.interactPressed = false;
      return value;
    }

    endFrame() {
      this.justKeys.clear();
      this.attackPressed = false;
      this.skillPressed = false;
      this.interactPressed = false;
    }
  }

  DR.Input = Input;
})(window.DR);
