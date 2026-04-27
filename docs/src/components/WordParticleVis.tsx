/**
 * WordParticleVis — SandDance-style animated particle visualization.
 * Each particle is a (word × paper) occurrence.  Layouts animate smoothly
 * between configurations using a lerp loop on a Canvas 2D context.
 *
 * Layouts
 *  • By Year  — x = publication year, particles stack vertically within each year
 *  • By Paper — papers in a year-sorted grid; words arranged within each cell
 *  • By Topic — horizontal bands by primary topic, x = year within band
 *  • By Word  — top-50 words as columns, papers stacked within each column
 */

import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import wordDataRaw  from '../data/wordData.json';
import topicDataRaw from '../data/topicData.json';

// ─── types ─────────────────────────────────────────────────────────────────────
interface WData {
  words: string[];
  freqs: number[];
  papers: Array<{ caption: string; year: number; wordcount: number; tw: [number, number][]; }>;
}
interface TData {
  topics: string[];
  papers: Record<string, { year: number; weights: Record<string, number>; }>;
}

const WD = wordDataRaw  as WData;
const TD = topicDataRaw as TData;

// ─── topic colour map ───────────────────────────────────────────────────────────
const TOPIC_COLOR: Record<string, string> = {
  'Hypertext & Links':      '#4e79a7',
  'Computer Graphics':      '#f28e2b',
  '3D Navigation & Camera': '#e15759',
  'Robotics & Sensing':     '#76b7b2',
  'Online Communities':     '#59a14f',
  'Photo & Image Tools':    '#edc948',
  'Video & Rich Media':     '#b07aa1',
  'Web Search & Content':   '#ff9da7',
  'Visualization':          '#9c755f',
  'Visual Analytics':       '#bab0ac',
  'Data Storytelling':      '#d37295',
  'Human-in-the-Loop ML':   '#e377c2',
  'AI Assistance':          '#4dc9f6',
  'Notebooks & Code':       '#f67019',
  'Immersive & AR/VR':      '#537bc4',
  'Interaction Design':     '#acc236',
};

// ─── particle definition ────────────────────────────────────────────────────────
interface Particle {
  id: number;
  word: string;
  wordIdx: number;
  globalFreq: number;
  paperFreq: number;
  caption: string;
  year: number;
  primaryTopic: string;
  color: string;
  paperRank: number;
}

// ─── constants ──────────────────────────────────────────────────────────────────
type LayoutMode = 'year' | 'paper' | 'topic' | 'word';

const LERP_K  = 0.09;   // per-frame lerp factor (~95% in ~32 frames ≈ 0.5 s)
const R_NORM  = 2.5;    // default particle radius
const R_HOV   = 4.5;    // hovered word radius

// Fixed padding — large enough for topic labels (left) and word labels (bottom)
const PAD = { t: 20, r: 16, b: 64, l: 144 } as const;

// ─── deterministic spread (golden-ratio sequence) ───────────────────────────────
function spread(seed: number, range: number): number {
  return ((seed * 1.6180339887) % 1) * range - range * 0.5;
}

// ─── component ─────────────────────────────────────────────────────────────────
export function WordParticleVis({
  items,
  containerWidth = 800,
  fitMode = false,
}: {
  items: any[];
  containerWidth?: number;
  fitMode?: boolean;
}) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef(0);
  const layoutRef  = useRef<LayoutMode>('year');
  const hovRef     = useRef<string | null>(null);

  const [layoutMode, setLayoutMode] = useState<LayoutMode>('year');
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  const W = containerWidth;
  const H = fitMode ? Math.round(window.innerHeight * 0.66) : 500;
  const IW = W  - PAD.l - PAD.r;
  const IH = H  - PAD.t - PAD.b;

  // keep refs in sync with state (read from RAF loop without restarts)
  useEffect(() => { layoutRef.current = layoutMode; }, [layoutMode]);

  // ── build particle list ──────────────────────────────────────────────────────
  const particles = useMemo<Particle[]>(() => {
    const captionSet = new Set<string>(items.map((d: any) => d.caption));
    const out: Particle[] = [];
    let id = 0;

    WD.papers.forEach(paper => {
      if (!captionSet.has(paper.caption)) return;
      const te = TD.papers[paper.caption];
      const weights = te?.weights ?? {};
      let primaryTopic = 'Visualization';
      let maxW = 0;
      Object.entries(weights).forEach(([t, w]) => { if (w > maxW) { maxW = w; primaryTopic = t; } });

      paper.tw.forEach(([widx, freq], rank) => {
        out.push({
          id: id++,
          word:        WD.words[widx],
          wordIdx:     widx,
          globalFreq:  WD.freqs[widx],
          paperFreq:   freq,
          caption:     paper.caption,
          year:        paper.year ?? 2000,
          primaryTopic,
          color:       TOPIC_COLOR[primaryTopic] ?? '#888',
          paperRank:   rank,
        });
      });
    });
    return out;
  }, [items]);

  const N = particles.length;

  // ── Float32 position buffers (live outside React render cycle) ────────────────
  const pos = useRef({
    cx: new Float32Array(0), cy: new Float32Array(0),
    tx: new Float32Array(0), ty: new Float32Array(0),
  });

  // ── layout computation ────────────────────────────────────────────────────────
  const computeTargets = useCallback((mode: LayoutMode) => {
    const tx = new Float32Array(N);
    const ty = new Float32Array(N);
    if (N === 0) return { tx, ty };

    const yrs  = particles.map(p => p.year);
    const yMin = Math.min(...yrs);
    const yMax = Math.max(...yrs);
    const yrRange = Math.max(yMax - yMin, 1);
    const yearX = (yr: number) => PAD.l + ((yr - yMin) / yrRange) * IW;

    // ── By Year ────────────────────────────────────────────────────────────────
    if (mode === 'year') {
      const byYear = new Map<number, number[]>();
      particles.forEach((p, i) => {
        if (!byYear.has(p.year)) byYear.set(p.year, []);
        byYear.get(p.year)!.push(i);
      });
      const step = R_NORM * 2 + 0.6;
      byYear.forEach((idxs, yr) => {
        const x0  = yearX(yr);
        const tot = idxs.length;
        const y0  = PAD.t + IH / 2 - (tot * step) / 2;
        idxs.forEach((i, k) => {
          tx[i] = x0 + spread(i,        10);
          ty[i] = y0 + spread(i * 7.1,  4) + k * step;
        });
      });
    }

    // ── By Paper ───────────────────────────────────────────────────────────────
    else if (mode === 'paper') {
      const paperOrder = [...new Set(particles.map(p => p.caption))].sort((a, b) => {
        const ay = particles.find(p => p.caption === a)?.year ?? 0;
        const by2 = particles.find(p => p.caption === b)?.year ?? 0;
        return ay - by2;
      });
      const nP    = paperOrder.length;
      const nCols = Math.ceil(Math.sqrt(nP * (IW / IH)));
      const nRows = Math.ceil(nP / nCols);
      const cellW = IW / nCols;
      const cellH = IH / nRows;

      const byPaper = new Map<string, number[]>();
      particles.forEach((p, i) => {
        if (!byPaper.has(p.caption)) byPaper.set(p.caption, []);
        byPaper.get(p.caption)!.push(i);
      });

      paperOrder.forEach((cap, pi) => {
        const col = pi % nCols;
        const row = Math.floor(pi / nCols);
        const cx  = PAD.l + col * cellW + cellW / 2;
        const cy  = PAD.t + row * cellH + cellH / 2;
        const idxs = (byPaper.get(cap) ?? [])
          .sort((a, b) => particles[a].paperRank - particles[b].paperRank);
        const n = idxs.length;
        const subCols = Math.ceil(Math.sqrt(n));
        const step    = Math.min(cellW, cellH) / (subCols + 1);
        idxs.forEach((idx, k) => {
          const sc = k % subCols;
          const sr = Math.floor(k / subCols);
          tx[idx] = cx - step * (subCols - 1) / 2 + sc * step + spread(idx * 5,  step * 0.25);
          ty[idx] = cy - step * (Math.ceil(n / subCols) - 1) / 2 + sr * step + spread(idx * 13, step * 0.25);
        });
      });
    }

    // ── By Topic ───────────────────────────────────────────────────────────────
    else if (mode === 'topic') {
      const activeTopics = TD.topics.filter(t => particles.some(p => p.primaryTopic === t));
      const nT    = activeTopics.length;
      const bandH = IH / nT;

      const byTopic = new Map<string, number[]>();
      particles.forEach((p, i) => {
        if (!byTopic.has(p.primaryTopic)) byTopic.set(p.primaryTopic, []);
        byTopic.get(p.primaryTopic)!.push(i);
      });

      activeTopics.forEach((topic, ti) => {
        const bandTop = PAD.t + ti * bandH;
        const idxs    = byTopic.get(topic) ?? [];
        const byYr    = new Map<number, number[]>();
        idxs.forEach(i => {
          const yr = particles[i].year;
          if (!byYr.has(yr)) byYr.set(yr, []);
          byYr.get(yr)!.push(i);
        });
        byYr.forEach((yidxs, yr) => {
          const x0 = yearX(yr);
          yidxs.forEach((i, k) => {
            tx[i] = x0 + spread(i,       8);
            ty[i] = bandTop + bandH * 0.08 + (k / yidxs.length) * bandH * 0.84;
          });
        });
      });
    }

    // ── By Word ────────────────────────────────────────────────────────────────
    else if (mode === 'word') {
      const topWordIdxs = [...new Set(particles.map(p => p.wordIdx))]
        .sort((a, b) => WD.freqs[b] - WD.freqs[a])
        .slice(0, 50);
      const wPos  = new Map<number, number>(topWordIdxs.map((wi, i) => [wi, i]));
      const nW    = topWordIdxs.length;
      const colW  = IW / nW;
      const step  = R_NORM * 2 + 0.5;

      const byWord = new Map<number, number[]>();
      particles.forEach((p, i) => {
        const pos2 = wPos.get(p.wordIdx);
        if (pos2 === undefined) {
          // Park off-screen particles to the right — they animate back when layout changes
          tx[i] = W + 60;
          ty[i] = PAD.t + IH / 2 + spread(i * 3, 40);
          return;
        }
        if (!byWord.has(p.wordIdx)) byWord.set(p.wordIdx, []);
        byWord.get(p.wordIdx)!.push(i);
      });

      topWordIdxs.forEach((wi, col) => {
        const x0   = PAD.l + col * colW + colW / 2;
        const idxs = (byWord.get(wi) ?? []).sort((a, b) => particles[a].year - particles[b].year);
        const tot  = idxs.length;
        const y0   = PAD.t + IH / 2 - (tot * step) / 2;
        idxs.forEach((i, k) => {
          tx[i] = x0 + spread(i * 3, Math.min(colW - 2, 5));
          ty[i] = y0 + k * step;
        });
      });
    }

    return { tx, ty };
  }, [particles, N, W, H, IW, IH]);

  // ── update targets on layout change ──────────────────────────────────────────
  useEffect(() => {
    if (N === 0) return;
    const p = pos.current;
    const { tx, ty } = computeTargets(layoutMode);

    // First render or N changed: snap straight to target
    if (p.cx.length !== N) {
      p.cx = tx.slice(); p.cy = ty.slice();
    }
    p.tx = tx; p.ty = ty;
  }, [layoutMode, computeTargets, N]);

  // ── continuous RAF draw loop ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || N === 0) return;
    const ctx = canvas.getContext('2d')!;
    let alive = true;

    function draw() {
      if (!alive) return;
      const p   = pos.current;
      const hov = hovRef.current;

      ctx.clearRect(0, 0, W, H);

      // ── lerp current → target ─────────────────────────────────────────────
      for (let i = 0; i < N; i++) {
        p.cx[i] += (p.tx[i] - p.cx[i]) * LERP_K;
        p.cy[i] += (p.ty[i] - p.cy[i]) * LERP_K;
      }

      // ── draw particles (2 passes to keep hovered on top) ─────────────────
      for (let pass = 0; pass < (hov ? 2 : 1); pass++) {
        for (let i = 0; i < N; i++) {
          const pt  = particles[i];
          const isH = hov ? pt.word === hov : false;
          if (hov && pass === 0 &&  isH) continue;   // draw dim first
          if (hov && pass === 1 && !isH) continue;   // draw bright second

          ctx.globalAlpha = hov ? (isH ? 0.95 : 0.07) : 0.68;
          ctx.fillStyle   = pt.color;
          ctx.beginPath();
          ctx.arc(p.cx[i], p.cy[i], isH ? R_HOV : R_NORM, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // ── axis / label overlays ─────────────────────────────────────────────
      drawLabels(ctx, layoutRef.current, particles, W, H, IW, IH);

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [particles, N, W, H]); // does NOT restart on layoutMode/hover changes

  // ── mouse interaction ─────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    // account for CSS scaling (fitMode)
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top)  * (H / rect.height);
    const p  = pos.current;
    let found: string | null = null;
    for (let i = 0; i < N; i++) {
      const dx = p.cx[i] - mx, dy = p.cy[i] - my;
      if (dx * dx + dy * dy < R_HOV * R_HOV * 2.5) { found = particles[i].word; break; }
    }
    hovRef.current = found;
    setHoveredWord(found);
  }, [N, W, H, particles]);

  const BTNS: { id: LayoutMode; label: string; icon: string }[] = [
    { id: 'year',  label: 'By Year',  icon: '◷' },
    { id: 'paper', label: 'By Paper', icon: '⊞' },
    { id: 'topic', label: 'By Topic', icon: '⊛' },
    { id: 'word',  label: 'By Word',  icon: '≡' },
  ];

  return (
    <div style={{ userSelect: 'none' }}>

      {/* ── controls ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="view-toggle">
          {BTNS.map(b => (
            <button
              key={b.id}
              className={`view-btn${layoutMode === b.id ? ' active' : ''}`}
              onClick={() => setLayoutMode(b.id)}
            >
              <span className="view-icon">{b.icon}</span>
              <span>{b.label}</span>
            </button>
          ))}
        </div>

        {hoveredWord
          ? <span style={{ fontSize: 12, opacity: 0.9, marginLeft: 10 }}>
              <strong>"{hoveredWord}"</strong>
              {' — '}
              {particles.filter(p => p.word === hoveredWord).length} papers
            </span>
          : null}

        <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.4 }}>
          {N.toLocaleString()} word×paper particles
        </span>
      </div>

      {/* ── canvas ── */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={fitMode
          ? { width: '100%', height: '66vh', display: 'block' }
          : { display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { hovRef.current = null; setHoveredWord(null); }}
      />

      {/* ── topic legend ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 12px', marginTop: 6 }}>
        {TD.topics.map(t => (
          <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, opacity: 0.75 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: TOPIC_COLOR[t] ?? '#999',
              display: 'inline-block', flexShrink: 0,
            }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── axis / label drawing (outside component to keep render fn clean) ───────────

function drawLabels(
  ctx: CanvasRenderingContext2D,
  mode: LayoutMode,
  particles: Particle[],
  W: number, H: number, IW: number, IH: number,
) {
  const yrs   = particles.map(p => p.year);
  const yMin  = Math.min(...yrs);
  const yMax  = Math.max(...yrs);
  const yrRange = Math.max(yMax - yMin, 1);
  const yearX = (yr: number) => PAD.l + ((yr - yMin) / yrRange) * IW;

  ctx.save();
  ctx.font      = '9px system-ui, sans-serif';
  ctx.fillStyle = '#777';

  // ── year tick labels (year & topic modes) ────────────────────────────────────
  if (mode === 'year' || mode === 'topic') {
    const tickStep = yrRange <= 15 ? 2 : 5;
    ctx.textAlign = 'center';
    for (let yr = Math.ceil(yMin / tickStep) * tickStep; yr <= yMax; yr += tickStep) {
      ctx.fillText(String(yr), yearX(yr), H - PAD.b + 14);
    }
  }

  // ── topic band labels ────────────────────────────────────────────────────────
  if (mode === 'topic') {
    const activeTopics = TD.topics.filter(t => particles.some(p => p.primaryTopic === t));
    const nT    = activeTopics.length;
    const bandH = IH / nT;
    ctx.textAlign = 'right';
    activeTopics.forEach((t, ti) => {
      const y = PAD.t + ti * bandH + bandH / 2 + 3;
      ctx.fillStyle = TOPIC_COLOR[t] ?? '#888';
      const label   = t.length > 20 ? t.slice(0, 18) + '…' : t;
      ctx.fillText(label, PAD.l - 6, y);
      // faint band separator
      ctx.save();
      ctx.strokeStyle = '#333'; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.moveTo(PAD.l, PAD.t + ti * bandH);
      ctx.lineTo(PAD.l + IW, PAD.t + ti * bandH);
      ctx.stroke();
      ctx.restore();
    });
  }

  // ── word column labels ───────────────────────────────────────────────────────
  if (mode === 'word') {
    const topWordIdxs = [...new Set(particles.map(p => p.wordIdx))]
      .sort((a, b) => WD.freqs[b] - WD.freqs[a])
      .slice(0, 50);
    const nW   = topWordIdxs.length;
    const colW = IW / nW;
    ctx.fillStyle = '#888';
    ctx.textAlign = 'right';
    topWordIdxs.forEach((wi, col) => {
      const x = PAD.l + col * colW + colW / 2;
      ctx.save();
      ctx.translate(x, H - PAD.b + 4);
      ctx.rotate(-Math.PI * 0.45);
      ctx.fillText(WD.words[wi], 0, 0);
      ctx.restore();
    });
  }

  // ── paper-grid year arrow hint ────────────────────────────────────────────────
  if (mode === 'paper') {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#555';
    ctx.fillText('papers sorted by year →', PAD.l, H - PAD.b + 14);
  }

  ctx.restore();
}
