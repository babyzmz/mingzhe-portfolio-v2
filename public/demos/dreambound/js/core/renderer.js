window.DR = window.DR || {};

(function attachRenderer(DR) {
  "use strict";

  const U = DR.Utils;

  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = 1;
      this.height = 1;
      this.dpr = 1;
      this.vertices = [];
      this.offsetX = 0;
      this.offsetY = 0;
      this.animationTime = 0;
      this.assets = null;
      const forceCanvas = window.location.protocol === "file:";
      this.gl = forceCanvas
        ? null
        : canvas.getContext("webgl2", { alpha: false, antialias: true })
          || canvas.getContext("webgl", { alpha: false, antialias: true });
      this.ctx = null;

      if (this.gl) this.initGL();
      else this.ctx = canvas.getContext("2d");
    }

    initGL() {
      const gl = this.gl;
      const vertexSource = [
        "attribute vec2 a_position;",
        "attribute vec4 a_color;",
        "uniform vec2 u_resolution;",
        "varying vec4 v_color;",
        "void main() {",
        "  vec2 zeroToOne = a_position / u_resolution;",
        "  vec2 clipSpace = zeroToOne * 2.0 - 1.0;",
        "  gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);",
        "  v_color = a_color;",
        "}",
      ].join("\n");
      const fragmentSource = [
        "precision mediump float;",
        "varying vec4 v_color;",
        "void main() {",
        "  gl_FragColor = v_color;",
        "}",
      ].join("\n");

      const vertexShader = this.compile(gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = this.compile(gl.FRAGMENT_SHADER, fragmentSource);
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn(gl.getProgramInfoLog(program));
        this.gl = null;
        this.ctx = this.canvas.getContext("2d");
        return;
      }

      this.program = program;
      this.positionLocation = gl.getAttribLocation(program, "a_position");
      this.colorLocation = gl.getAttribLocation(program, "a_color");
      this.resolutionLocation = gl.getUniformLocation(program, "u_resolution");
      this.buffer = gl.createBuffer();

      const textureVertexSource = [
        "attribute vec2 a_position;",
        "attribute vec2 a_texcoord;",
        "uniform vec2 u_resolution;",
        "varying vec2 v_texcoord;",
        "void main() {",
        "  vec2 zeroToOne = a_position / u_resolution;",
        "  vec2 clipSpace = zeroToOne * 2.0 - 1.0;",
        "  gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);",
        "  v_texcoord = a_texcoord;",
        "}",
      ].join("\n");
      const textureFragmentSource = [
        "precision mediump float;",
        "uniform sampler2D u_texture;",
        "uniform float u_alpha;",
        "varying vec2 v_texcoord;",
        "void main() {",
        "  vec4 tex = texture2D(u_texture, v_texcoord);",
        "  gl_FragColor = vec4(tex.rgb, tex.a * u_alpha);",
        "}",
      ].join("\n");
      const textureVertexShader = this.compile(gl.VERTEX_SHADER, textureVertexSource);
      const textureFragmentShader = this.compile(gl.FRAGMENT_SHADER, textureFragmentSource);
      const textureProgram = gl.createProgram();
      gl.attachShader(textureProgram, textureVertexShader);
      gl.attachShader(textureProgram, textureFragmentShader);
      gl.linkProgram(textureProgram);
      if (!gl.getProgramParameter(textureProgram, gl.LINK_STATUS)) {
        console.warn(gl.getProgramInfoLog(textureProgram));
        this.gl = null;
        this.ctx = this.canvas.getContext("2d");
        return;
      }

      this.textureProgram = textureProgram;
      this.texturePositionLocation = gl.getAttribLocation(textureProgram, "a_position");
      this.textureCoordLocation = gl.getAttribLocation(textureProgram, "a_texcoord");
      this.textureResolutionLocation = gl.getUniformLocation(textureProgram, "u_resolution");
      this.textureAlphaLocation = gl.getUniformLocation(textureProgram, "u_alpha");
      this.textureBuffer = gl.createBuffer();
      this.textureCache = new WeakMap();

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    compile(type, source) {
      const gl = this.gl;
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    resize(width, height) {
      this.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      this.width = Math.max(320, Math.floor(width));
      this.height = Math.max(240, Math.floor(height));
      const pixelWidth = Math.floor(this.width * this.dpr);
      const pixelHeight = Math.floor(this.height * this.dpr);
      if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
        this.canvas.width = pixelWidth;
        this.canvas.height = pixelHeight;
      }
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      if (this.gl) this.gl.viewport(0, 0, pixelWidth, pixelHeight);
      if (this.ctx) {
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        this.ctx.imageSmoothingEnabled = false;
      }
    }

    begin(color) {
      this.vertices.length = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      const bg = color || [0.035, 0.039, 0.067, 1];
      if (this.gl) {
        this.gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      } else {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = rgba(bg);
        this.ctx.fillRect(0, 0, this.width, this.height);
      }
    }

    setOffset(x, y) {
      this.offsetX = x;
      this.offsetY = y;
    }

    rect(x, y, w, h, color, alpha, rotation) {
      const c = withAlpha(color, alpha);
      const hw = w / 2;
      const hh = h / 2;
      const r = rotation || 0;
      let points;
      if (Math.abs(r) > 0.0001) {
        const cos = Math.cos(r);
        const sin = Math.sin(r);
        points = [
          rotatePoint(-hw, -hh, cos, sin, x, y),
          rotatePoint(hw, -hh, cos, sin, x, y),
          rotatePoint(hw, hh, cos, sin, x, y),
          rotatePoint(-hw, hh, cos, sin, x, y),
        ];
      } else {
        points = [
          { x: x - hw, y: y - hh },
          { x: x + hw, y: y - hh },
          { x: x + hw, y: y + hh },
          { x: x - hw, y: y + hh },
        ];
      }
      this.polygon(points, c);
    }

    line(x1, y1, x2, y2, width, color, alpha) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      if (len < 0.01) return;
      this.rect((x1 + x2) / 2, (y1 + y2) / 2, len, width, color, alpha, Math.atan2(dy, dx));
    }

    circle(x, y, radius, color, alpha, segments) {
      const c = withAlpha(color, alpha);
      const count = segments || 22;
      if (this.ctx) {
        this.ctx.fillStyle = rgba(c);
        this.ctx.beginPath();
        this.ctx.arc(x + this.offsetX, y + this.offsetY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        return;
      }
      const center = { x, y };
      for (let i = 0; i < count; i += 1) {
        const a1 = (i / count) * Math.PI * 2;
        const a2 = ((i + 1) / count) * Math.PI * 2;
        this.tri(
          center,
          { x: x + Math.cos(a1) * radius, y: y + Math.sin(a1) * radius },
          { x: x + Math.cos(a2) * radius, y: y + Math.sin(a2) * radius },
          c,
        );
      }
    }

    ring(x, y, radius, width, color, alpha, segments) {
      const count = segments || 30;
      const c = withAlpha(color, alpha);
      for (let i = 0; i < count; i += 1) {
        const a1 = (i / count) * Math.PI * 2;
        const a2 = ((i + 1) / count) * Math.PI * 2;
        const p1 = { x: x + Math.cos(a1) * (radius - width), y: y + Math.sin(a1) * (radius - width) };
        const p2 = { x: x + Math.cos(a1) * radius, y: y + Math.sin(a1) * radius };
        const p3 = { x: x + Math.cos(a2) * radius, y: y + Math.sin(a2) * radius };
        const p4 = { x: x + Math.cos(a2) * (radius - width), y: y + Math.sin(a2) * (radius - width) };
        this.polygon([p1, p2, p3, p4], c);
      }
    }

    wedge(x, y, direction, radius, arc, color, alpha, segments) {
      const c = withAlpha(color, alpha);
      const count = segments || 12;
      const points = [{ x, y }];
      for (let i = 0; i <= count; i += 1) {
        const a = direction - arc / 2 + (arc * i) / count;
        points.push({ x: x + Math.cos(a) * radius, y: y + Math.sin(a) * radius });
      }
      this.polygon(points, c);
    }

    sprite(image, sx, sy, sw, sh, x, y, w, h, options) {
      if (!image || !image.complete || image.naturalWidth === 0) return;
      const alpha = options?.alpha == null ? 1 : options.alpha;
      const rotation = options?.rotation || 0;
      const flipX = !!options?.flipX;
      const anchorX = options?.anchorX == null ? 0.5 : options.anchorX;
      const anchorY = options?.anchorY == null ? 0.5 : options.anchorY;
      const drawX = x + this.offsetX;
      const drawY = y + this.offsetY;

      if (this.ctx) {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(drawX, drawY);
        ctx.rotate(rotation);
        ctx.scale(flipX ? -1 : 1, 1);
        ctx.drawImage(image, sx, sy, sw, sh, -w * anchorX, -h * anchorY, w, h);
        ctx.restore();
        return;
      }

      this.flush();
      const gl = this.gl;
      const tex = this.getTexture(image);
      const left = -w * anchorX;
      const right = left + w;
      const top = -h * anchorY;
      const bottom = top + h;
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      const points = [
        rotatePoint(left, top, cos, sin, drawX, drawY),
        rotatePoint(right, top, cos, sin, drawX, drawY),
        rotatePoint(right, bottom, cos, sin, drawX, drawY),
        rotatePoint(left, bottom, cos, sin, drawX, drawY),
      ];
      const scale = this.dpr;
      const u0 = sx / image.naturalWidth;
      const u1 = (sx + sw) / image.naturalWidth;
      const v0 = sy / image.naturalHeight;
      const v1 = (sy + sh) / image.naturalHeight;
      const leftU = flipX ? u1 : u0;
      const rightU = flipX ? u0 : u1;
      const data = new Float32Array([
        points[0].x * scale, points[0].y * scale, leftU, v0,
        points[1].x * scale, points[1].y * scale, rightU, v0,
        points[2].x * scale, points[2].y * scale, rightU, v1,
        points[0].x * scale, points[0].y * scale, leftU, v0,
        points[2].x * scale, points[2].y * scale, rightU, v1,
        points[3].x * scale, points[3].y * scale, leftU, v1,
      ]);

      gl.useProgram(this.textureProgram);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.uniform2f(this.textureResolutionLocation, this.canvas.width, this.canvas.height);
      gl.uniform1f(this.textureAlphaLocation, alpha);
      const stride = 4 * 4;
      gl.enableVertexAttribArray(this.texturePositionLocation);
      gl.vertexAttribPointer(this.texturePositionLocation, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(this.textureCoordLocation);
      gl.vertexAttribPointer(this.textureCoordLocation, 2, gl.FLOAT, false, stride, 2 * 4);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    polygon(points, color) {
      const c = color;
      if (points.length < 3) return;
      if (this.ctx) {
        this.ctx.fillStyle = rgba(c);
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x + this.offsetX, points[0].y + this.offsetY);
        for (let i = 1; i < points.length; i += 1) {
          this.ctx.lineTo(points[i].x + this.offsetX, points[i].y + this.offsetY);
        }
        this.ctx.closePath();
        this.ctx.fill();
        return;
      }
      for (let i = 1; i < points.length - 1; i += 1) {
        this.tri(points[0], points[i], points[i + 1], c);
      }
    }

    tri(a, b, cPoint, color) {
      const ox = this.offsetX;
      const oy = this.offsetY;
      this.pushVertex(a.x + ox, a.y + oy, color);
      this.pushVertex(b.x + ox, b.y + oy, color);
      this.pushVertex(cPoint.x + ox, cPoint.y + oy, color);
    }

    pushVertex(x, y, color) {
      const s = this.dpr;
      this.vertices.push(x * s, y * s, color[0], color[1], color[2], color[3]);
    }

    getTexture(image) {
      let texture = this.textureCache.get(image);
      if (texture) return texture;
      const gl = this.gl;
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      this.textureCache.set(image, texture);
      return texture;
    }

    flush() {
      if (!this.gl || this.vertices.length === 0) return;
      const gl = this.gl;
      const data = new Float32Array(this.vertices);
      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
      const stride = 6 * 4;
      gl.enableVertexAttribArray(this.positionLocation);
      gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(this.colorLocation);
      gl.vertexAttribPointer(this.colorLocation, 4, gl.FLOAT, false, stride, 2 * 4);
      gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 6);
      this.vertices.length = 0;
    }
  }

  function rotatePoint(x, y, cos, sin, cx, cy) {
    return { x: cx + x * cos - y * sin, y: cy + x * sin + y * cos };
  }

  function withAlpha(color, alpha) {
    if (alpha == null) return color;
    return [color[0], color[1], color[2], color[3] * alpha];
  }

  function rgba(color) {
    return `rgba(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)}, ${color[3]})`;
  }

  DR.Renderer = Renderer;
  DR.Colors = {
    bg: U.color("#090a11"),
    floorA: U.color("#121624"),
    floorB: U.color("#1b1f2e"),
    player: U.color("#78e4d0"),
    playerDark: U.color("#1c8e82"),
    enemy: U.color("#e34d4d"),
    enemyAlt: U.color("#cc63ff"),
    boss: U.color("#f5c542"),
    projectile: U.color("#78a8ff"),
    hostile: U.color("#f07c63"),
    white: U.color("#f7f2df"),
    shadow: U.color("#000000", 0.32),
    door: U.color("#f5c542"),
    teal: U.color("#36d2bb"),
    pink: U.color("#f1a0b0"),
    violet: U.color("#8d66ff"),
  };
})(window.DR);
