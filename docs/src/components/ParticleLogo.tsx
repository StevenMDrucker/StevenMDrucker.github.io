import { useRef, useEffect } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────
const TEXT = 'Steven M. Drucker';

const VS = `
  attribute vec2  a_pos;
  attribute vec4  a_col;
  uniform   vec2  u_res;
  uniform   float u_ps;
  varying   vec4  v_col;
  void main() {
    vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
    gl_Position  = vec4(clip.x, -clip.y, 0.0, 1.0);
    gl_PointSize = u_ps;
    v_col = a_col;
  }
`;
const FS = `
  precision mediump float;
  varying vec4 v_col;
  void main() {
    vec2  c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float a = 1.0 - smoothstep(0.12, 0.25, d);
    gl_FragColor = vec4(v_col.rgb, v_col.a * a);
  }
`;

interface Props {
  /** Logical-px font size — controls text scale and auto-derived canvas size. */
  fontSize?: number;
  /** Explicit canvas height in logical px; overrides auto-sizing (useful for nav). */
  height?: number;
  /** Enable idle scatter↔form animation (default true). */
  idle?: boolean;
  /**
   * When true, applies a negative left margin so the leftmost particle glyph
   * aligns with the container edge, and trims excess bottom canvas padding
   * so the next sibling sits snug below the text baseline.
   */
  alignLeft?: boolean;
  /** Override the auto-computed particle point size (logical px radius). */
  pointSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ParticleLogo({ fontSize = 72, height, idle = true, alignLeft = false, pointSize: pointSizeProp, className, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const fontStr = `bold ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;

    // ── Measure text to determine canvas size ─────────────────────────────────
    const measure = document.createElement('canvas').getContext('2d')!;
    measure.font = fontStr;
    const textW  = measure.measureText(TEXT).width;
    const textH  = fontSize * 1.5;

    // Canvas covers text + scatter padding
    const W = Math.ceil(textW * 1.24 + fontSize * 0.6);
    const H = height ?? Math.ceil(textH * 2.1 + fontSize * 0.5);

    canvas.width        = Math.round(W * dpr);
    canvas.height       = Math.round(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';

    // ── WebGL ──────────────────────────────────────────────────────────────────
    const gl = canvas.getContext('webgl', { antialias: false, alpha: true });
    if (!gl) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, canvas.width, canvas.height);

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.uniform2f(gl.getUniformLocation(prog, 'u_res'), W, H);

    const locPos = gl.getAttribLocation(prog, 'a_pos');
    const locCol = gl.getAttribLocation(prog, 'a_col');
    const locPs  = gl.getUniformLocation(prog, 'u_ps');

    const posBuf = gl.createBuffer()!;
    const colBuf = gl.createBuffer()!;

    // ── Physics params (scale with fontSize) ──────────────────────────────────
    const sampling  = Math.max(2, Math.round(fontSize / 26));
    const springK   = 0.06;
    const damping   = 0.88;
    const repRadius = fontSize * 1.4;
    const repForce  = 14;
    const pointSize = pointSizeProp ?? Math.max(1.4, fontSize / 36);

    // ── State machine ─────────────────────────────────────────────────────────
    const S = { SCATTERED: 0, FORMING: 1, FORMED: 2, SCATTERING: 3 };
    let idleState  = S.SCATTERED;
    let stateStart = 0;
    let mouseActive = false;

    const HOLD_SCATTERED = 1200;
    const HOLD_FORMED    = 2200;
    const MAX_STAGGER    = 1800;  // wide enough to see clear left-to-right sweep
    const FORM_SETTLE    = 2200;
    const SCATTER_SETTLE = 1800;

    // ── Particle arrays ───────────────────────────────────────────────────────
    let N = 0;
    let homeX: Float32Array, homeY: Float32Array;
    let scatterX: Float32Array, scatterY: Float32Array;
    let curX: Float32Array, curY: Float32Array;
    let velX: Float32Array, velY: Float32Array;
    let posArr: Float32Array;
    let staggerDelay: Float32Array;

    function generateScatter() {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < N; i++) {
        if (homeX[i] < minX) minX = homeX[i]; if (homeX[i] > maxX) maxX = homeX[i];
        if (homeY[i] < minY) minY = homeY[i]; if (homeY[i] > maxY) maxY = homeY[i];
      }
      const tw = maxX - minX, th = maxY - minY;
      // Padding constrained so scatter stays inside canvas
      const padX = Math.min(tw * 0.12, (W - tw) / 2 * 0.85);
      const padY = Math.min(th * 0.55, (H - th) / 2 * 0.85);
      const x0 = minX, xW = tw + padX;  // never scatter left of the 'S'
      const y0 = minY - padY, yH = th + padY * 2;
      for (let i = 0; i < N; i++) {
        scatterX[i] = Math.max(1, Math.min(W - 1, x0 + Math.random() * xW));
        scatterY[i] = Math.max(1, Math.min(H - 1, y0 + Math.random() * yH));
      }
    }

    function enterState(s: number) {
      idleState  = s;
      stateStart = performance.now();

      if (s === S.FORMING) {
        // Left-to-right sweep by home x
        let minHX = Infinity, maxHX = -Infinity;
        for (let i = 0; i < N; i++) { if (homeX[i] < minHX) minHX = homeX[i]; if (homeX[i] > maxHX) maxHX = homeX[i]; }
        const r = maxHX - minHX || 1;
        for (let i = 0; i < N; i++) staggerDelay[i] = ((homeX[i] - minHX) / r) * MAX_STAGGER;
      } else if (s === S.SCATTERING) {
        generateScatter();
        // Center-outward wave
        let minHX = Infinity, maxHX = -Infinity;
        for (let i = 0; i < N; i++) { if (homeX[i] < minHX) minHX = homeX[i]; if (homeX[i] > maxHX) maxHX = homeX[i]; }
        const cx = (minHX + maxHX) / 2;
        let maxDist = 0;
        for (let i = 0; i < N; i++) maxDist = Math.max(maxDist, Math.abs(homeX[i] - cx));
        const dr = maxDist || 1;
        for (let i = 0; i < N; i++) {
          staggerDelay[i] = (1 - Math.abs(homeX[i] - cx) / dr) * MAX_STAGGER + Math.random() * 80;
        }
      }
    }

    // ── Rasterize text → particle home positions ───────────────────────────────
    const off = document.createElement('canvas');
    const ctx = off.getContext('2d')!;
    off.width  = Math.ceil(textW + fontSize * 0.6);
    off.height = Math.ceil(textH);
    ctx.font = fontStr;
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText(TEXT, fontSize * 0.3, textH / 2);

    const { data } = ctx.getImageData(0, 0, off.width, off.height);
    const ox = (W - off.width) / 2;
    const oy = (H - off.height) / 2;

    const pts: number[] = [];
    for (let py = 0; py < off.height; py += sampling)
      for (let px = 0; px < off.width; px += sampling)
        if (data[(py * off.width + px) * 4 + 3] > 80)
          pts.push(px + ox, py + oy);

    N = pts.length >> 1;
    homeX    = new Float32Array(N); homeY    = new Float32Array(N);
    scatterX = new Float32Array(N); scatterY = new Float32Array(N);
    curX     = new Float32Array(N); curY     = new Float32Array(N);
    velX     = new Float32Array(N); velY     = new Float32Array(N);
    posArr   = new Float32Array(N * 2);
    staggerDelay = new Float32Array(N);

    for (let i = 0; i < N; i++) { homeX[i] = pts[i * 2]; homeY[i] = pts[i * 2 + 1]; }

    // ── Per-particle colors: left→right gradient ───────────────────────────────
    // Detect light mode to choose readable colors
    const isLight = document.body.classList.contains('light-theme');
    const CA = isLight ? [0.0, 0.45, 0.85, 1.0] : [0.0,  0.84, 1.0,  1.0];
    const CB = isLight ? [0.5, 0.05, 0.75, 1.0] : [0.72, 0.15, 1.0,  1.0];

    const colArr = new Float32Array(N * 4);
    let minHX = Infinity, maxHX = -Infinity;
    for (let i = 0; i < N; i++) { if (homeX[i] < minHX) minHX = homeX[i]; if (homeX[i] > maxHX) maxHX = homeX[i]; }
    const hRange = maxHX - minHX || 1;
    for (let i = 0; i < N; i++) {
      const t = (homeX[i] - minHX) / hRange;
      colArr[i*4+0] = CA[0] + (CB[0] - CA[0]) * t;
      colArr[i*4+1] = CA[1] + (CB[1] - CA[1]) * t;
      colArr[i*4+2] = CA[2] + (CB[2] - CA[2]) * t;
      colArr[i*4+3] = 1.0;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
    gl.bufferData(gl.ARRAY_BUFFER, colArr, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, posArr, gl.DYNAMIC_DRAW);

    // ── Align-left: shift canvas so glyph edge meets container, trim bottom gap ──
    if (alignLeft) {
      // minHX is already computed above for color gradient
      canvas.style.marginLeft = `-${minHX}px`;
      // oy is the top/bottom scatter padding; trimming it pulls the tagline up
      const oy = (H - Math.ceil(textH)) / 2;
      canvas.style.marginBottom = `-${Math.max(0, oy - 6)}px`;
    }

    // Start in scattered state
    generateScatter();
    for (let i = 0; i < N; i++) { curX[i] = scatterX[i]; curY[i] = scatterY[i]; }
    enterState(S.SCATTERED);
    // Random phase offset so multiple instances on the same page never sync up
    const fullCycle = HOLD_SCATTERED + MAX_STAGGER + FORM_SETTLE + HOLD_FORMED + MAX_STAGGER + SCATTER_SETTLE;
    stateStart -= Math.random() * fullCycle;

    // ── Mouse / touch ─────────────────────────────────────────────────────────
    let mx = -99999, my = -99999;

    const onEnter = () => { mouseActive = true; };
    const onLeave = () => {
      mouseActive = false; mx = my = -99999;
      enterState(S.FORMED);
    };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault(); mouseActive = true;
      const r = canvas.getBoundingClientRect();
      mx = e.touches[0].clientX - r.left; my = e.touches[0].clientY - r.top;
    };
    const onTouchEnd = () => {
      mouseActive = false; mx = my = -99999; enterState(S.FORMED);
    };

    canvas.addEventListener('mouseenter', onEnter);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('mousemove',  onMove);
    canvas.addEventListener('touchmove',  onTouchMove, { passive: false });
    canvas.addEventListener('touchend',   onTouchEnd);

    // ── Animation loop ─────────────────────────────────────────────────────────
    let rafId = 0;

    function frame() {
      rafId = requestAnimationFrame(frame);
      const now = performance.now();
      const r2  = repRadius * repRadius;

      // State machine
      if (idle && !mouseActive) {
        const el = now - stateStart;
        if      (idleState === S.SCATTERED  && el > HOLD_SCATTERED)             enterState(S.FORMING);
        else if (idleState === S.FORMING    && el > MAX_STAGGER + FORM_SETTLE)  enterState(S.FORMED);
        else if (idleState === S.FORMED     && el > HOLD_FORMED)                enterState(S.SCATTERING);
        else if (idleState === S.SCATTERING && el > MAX_STAGGER + SCATTER_SETTLE) enterState(S.SCATTERED);
      }

      const el = now - stateStart;

      for (let i = 0; i < N; i++) {
        let vx = velX[i], vy = velY[i];
        let x  = curX[i], y  = curY[i];

        if (mouseActive) {
          // Spring home + repulsion
          vx += (homeX[i] - x) * springK;
          vy += (homeY[i] - y) * springK;
          const dx = x - mx, dy = y - my;
          const d2 = dx*dx + dy*dy;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / repRadius) * repForce;
            vx += (dx / d) * f; vy += (dy / d) * f;
          }
        } else if (idle) {
          const active = idleState === S.FORMED || idleState === S.SCATTERED || el >= staggerDelay[i];
          if (active) {
            const tx = (idleState === S.FORMING || idleState === S.FORMED) ? homeX[i] : scatterX[i];
            const ty = (idleState === S.FORMING || idleState === S.FORMED) ? homeY[i] : scatterY[i];
            vx += (tx - x) * springK; vy += (ty - y) * springK;
          }
        } else {
          vx += (homeX[i] - x) * springK; vy += (homeY[i] - y) * springK;
        }

        vx *= damping; vy *= damping;
        x  += vx;     y  += vy;
        velX[i] = vx; velY[i] = vy;
        curX[i] = x;  curY[i] = y;
        posArr[i*2] = x; posArr[i*2+1] = y;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, posArr);
      gl.uniform1f(locPs, pointSize * dpr);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.enableVertexAttribArray(locPos);
      gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
      gl.enableVertexAttribArray(locCol);
      gl.vertexAttribPointer(locCol, 4, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, N);
    }

    frame();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('mouseenter', onEnter);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('mousemove',  onMove);
      canvas.removeEventListener('touchmove',  onTouchMove);
      canvas.removeEventListener('touchend',   onTouchEnd);
      // Don't loseContext() — React StrictMode double-invokes effects and a lost
      // context can't be re-acquired on the same canvas element.
    };
  }, [fontSize, height, idle]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', cursor: 'crosshair', background: 'transparent', ...style }}
    />
  );
}
