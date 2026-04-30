/**
 * WordParticleVis — SandDance-style animated particle visualization.
 * Each particle is a (word × paper) occurrence. Layouts animate smoothly
 * between configurations using a lerp loop on a Canvas 2D context.
 *
 * Layouts
 *  • Timeline — proportional topic bands (by particle count), x = year within band
 *  • By Year  — x = publication year, particles stack vertically
 *  • By Paper — year-sorted paper grid; canvas boxes + captions per paper
 *  • By Word  — top-40 words as columns (most→least freq), bottom-up stacks
 */

import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import wordDataRaw  from '../data/wordData.json';
import topicDataRaw from '../data/topicData.json';

// ─── types ──────────────────────────────────────────────────────────────────
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

// ─── topic colour map ────────────────────────────────────────────────────────
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

// ─── particle ────────────────────────────────────────────────────────────────
interface Particle {
  id: number;
  word: string;
  wordIdx: number;
  globalFreq: number;
  paperFreq: number;
  caption: string;
  year: number;
  primaryTopic: string;
  topicOrder: number;
  color: string;
  paperRank: number;
}

// ─── constants ───────────────────────────────────────────────────────────────
type LayoutMode = 'timeline' | 'year' | 'paper' | 'word';

const LERP_K   = 0.09;
const R_NORM   = 2.5;
const R_HOV    = 4.5;
const STEP     = R_NORM * 2 + 0.8;   // ~6 px between particle centres
const LEGEND_W = 182;
const PAD = { t: 20, r: 8, b: 50, l: 8 } as const;
const TOP_WORDS = 40;                  // words shown in word layout

function spread(seed: number, range: number): number {
  return ((seed * 1.6180339887) % 1) * range - range * 0.5;
}

// ─── component ───────────────────────────────────────────────────────────────
export function WordParticleVis({
  items,
  containerWidth = 800,
  fitMode = false,
}: {
  items: any[];
  containerWidth?: number;
  fitMode?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);

  // RAF-loop refs (updated without restarting loop)
  const brushedTopicRef = useRef<string | null>(null);   // pinned via click
  const hovTopicRef     = useRef<string | null>(null);   // transient hover
  const layoutRef       = useRef<LayoutMode>('timeline');

  // React state for UI
  const [layoutMode,     setLayoutMode]     = useState<LayoutMode>('timeline');
  const [pinnedTopic,    setPinnedTopic]    = useState<string | null>(null);
  const [highlightTopic, setHighlightTopic] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ cx: number; cy: number; p: Particle } | null>(null);

  const CW = Math.max(400, containerWidth - LEGEND_W - 16);
  const H  = fitMode ? Math.round(window.innerHeight * 0.72) : 560;
  const IW = CW - PAD.l - PAD.r;
  const IH = H  - PAD.t - PAD.b;

  // sync layout ref
  useEffect(() => { layoutRef.current = layoutMode; }, [layoutMode]);

  // ── build particle list ────────────────────────────────────────────────────
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
      Object.entries(weights).forEach(([t, w]) => {
        if ((w as number) > maxW) { maxW = w as number; primaryTopic = t; }
      });
      const topicOrder = TD.topics.indexOf(primaryTopic);
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
          topicOrder,
          color:       TOPIC_COLOR[primaryTopic] ?? '#888',
          paperRank:   rank,
        });
      });
    });
    return out;
  }, [items]);

  const N = particles.length;

  // ── position buffers ───────────────────────────────────────────────────────
  const pos = useRef({
    cx: new Float32Array(0), cy: new Float32Array(0),
    tx: new Float32Array(0), ty: new Float32Array(0),
  });

  // ── layout computation ─────────────────────────────────────────────────────
  const computeTargets = useCallback((mode: LayoutMode) => {
    const tx = new Float32Array(N);
    const ty = new Float32Array(N);
    if (N === 0) return { tx, ty };

    const yrs    = particles.map(p => p.year);
    const yMin   = Math.min(...yrs);
    const yMax   = Math.max(...yrs);
    const yrRange = Math.max(yMax - yMin, 1);
    const yearX  = (yr: number) => PAD.l + ((yr - yMin) / yrRange) * IW;

    // ── Timeline: proportional topic bands, x = year ─────────────────────────
    if (mode === 'timeline') {
      const activeTopics = TD.topics.filter(t => particles.some(p => p.primaryTopic === t));
      const topicCount   = new Map<string, number>();
      particles.forEach(p => topicCount.set(p.primaryTopic, (topicCount.get(p.primaryTopic) ?? 0) + 1));
      const total = particles.length;

      // proportional band heights
      let cumY = PAD.t;
      const bTop = new Map<string, number>();
      const bH   = new Map<string, number>();
      activeTopics.forEach(t => {
        const h = ((topicCount.get(t) ?? 0) / total) * IH;
        bTop.set(t, cumY);
        bH.set(t, h);
        cumY += h;
      });

      // group by topic → year, then stack
      const byTopicYear = new Map<string, Map<number, number[]>>();
      particles.forEach((p, i) => {
        if (!byTopicYear.has(p.primaryTopic)) byTopicYear.set(p.primaryTopic, new Map());
        const byYr = byTopicYear.get(p.primaryTopic)!;
        if (!byYr.has(p.year)) byYr.set(p.year, []);
        byYr.get(p.year)!.push(i);
      });

      byTopicYear.forEach((byYr, topic) => {
        const bt = bTop.get(topic) ?? PAD.t;
        const bh = Math.max(bH.get(topic) ?? 10, 10);
        byYr.forEach((idxs, yr) => {
          const x0   = yearX(yr);
          const step = Math.min((bh - 4) / Math.max(idxs.length, 1), STEP);
          idxs.forEach((i, k) => {
            tx[i] = x0 + spread(i, 6);
            ty[i] = bt + 4 + k * step;
          });
        });
      });
    }

    // ── By Year ───────────────────────────────────────────────────────────────
    else if (mode === 'year') {
      const byYear = new Map<number, number[]>();
      particles.forEach((p, i) => {
        if (!byYear.has(p.year)) byYear.set(p.year, []);
        byYear.get(p.year)!.push(i);
      });
      byYear.forEach((idxs, yr) => {
        const x0  = yearX(yr);
        const tot = idxs.length;
        const y0  = PAD.t + IH / 2 - (tot * STEP) / 2;
        idxs.forEach((i, k) => {
          tx[i] = x0 + spread(i,       10);
          ty[i] = y0 + spread(i * 7.1,  4) + k * STEP;
        });
      });
    }

    // ── By Paper: year-sorted grid cells ──────────────────────────────────────
    else if (mode === 'paper') {
      const paperOrder = [...new Set(particles.map(p => p.caption))].sort((a, b) => {
        const ay  = particles.find(p => p.caption === a)?.year ?? 0;
        const by2 = particles.find(p => p.caption === b)?.year ?? 0;
        return ay - by2;
      });
      const nP    = paperOrder.length;
      const nCols = Math.max(1, Math.ceil(Math.sqrt(nP * (IW / IH))));
      const nRows = Math.ceil(nP / nCols);
      const cellW = IW / nCols;
      const cellH = IH / nRows;

      const byPaper = new Map<string, number[]>();
      particles.forEach((p, i) => {
        if (!byPaper.has(p.caption)) byPaper.set(p.caption, []);
        byPaper.get(p.caption)!.push(i);
      });

      paperOrder.forEach((cap, pi) => {
        const col   = pi % nCols;
        const row   = Math.floor(pi / nCols);
        const cxC   = PAD.l + col * cellW + cellW / 2;
        const cyC   = PAD.t + row * cellH + cellH / 2;
        const idxs  = (byPaper.get(cap) ?? []).sort((a, b) => particles[a].paperRank - particles[b].paperRank);
        const n     = idxs.length;
        const sW    = Math.max(3, Math.ceil(Math.sqrt(n)));
        const sStep = Math.min((cellW - 6) / sW, (cellH - 16) / Math.ceil(n / sW), STEP);
        const nRows2 = Math.ceil(n / sW);
        idxs.forEach((idx, k) => {
          const sc = k % sW;
          const sr = Math.floor(k / sW);
          tx[idx] = cxC - sStep * (sW - 1) / 2     + sc * sStep + spread(idx * 5,  sStep * 0.2);
          ty[idx] = cyC - sStep * (nRows2 - 1) / 2 + sr * sStep + spread(idx * 13, sStep * 0.2);
        });
      });
    }

    // ── By Word: columns sorted most→least freq, bottom-up stacking ───────────
    else if (mode === 'word') {
      const topWordIdxs = [...new Set(particles.map(p => p.wordIdx))]
        .sort((a, b) => WD.freqs[b] - WD.freqs[a])
        .slice(0, TOP_WORDS);
      const wPosMap = new Map<number, number>(topWordIdxs.map((wi, i) => [wi, i]));
      const nW   = topWordIdxs.length;
      const colW = IW / nW;
      // sub-grid width per word (3–10), based on average column width
      const gridW = Math.min(10, Math.max(3, Math.round(colW / STEP)));

      const byWord = new Map<number, number[]>();
      particles.forEach((p, i) => {
        if (wPosMap.has(p.wordIdx)) {
          if (!byWord.has(p.wordIdx)) byWord.set(p.wordIdx, []);
          byWord.get(p.wordIdx)!.push(i);
        } else {
          // park off-screen
          tx[i] = CW + 80;
          ty[i] = PAD.t + IH / 2;
        }
      });

      topWordIdxs.forEach((wi, col) => {
        const x0   = PAD.l + col * colW + colW / 2 - ((gridW - 1) / 2) * STEP;
        const idxs = (byWord.get(wi) ?? []).sort((a, b) => {
          const pa = particles[a], pb = particles[b];
          if (pa.topicOrder !== pb.topicOrder) return pa.topicOrder - pb.topicOrder;
          return pa.caption.localeCompare(pb.caption);
        });
        const baseY = PAD.t + IH; // bottom edge
        idxs.forEach((idx, k) => {
          const subCol = k % gridW;
          const subRow = Math.floor(k / gridW);
          tx[idx] = x0 + subCol * STEP + spread(idx * 5,  0.5);
          ty[idx] = baseY - subRow * STEP + spread(idx * 13, 0.5);
        });
      });
    }

    return { tx, ty };
  }, [particles, N, CW, H, IW, IH]);

  // ── update targets on layout/particles change ──────────────────────────────
  useEffect(() => {
    if (N === 0) return;
    const p = pos.current;
    const { tx, ty } = computeTargets(layoutMode);
    if (p.cx.length !== N) {
      p.cx = tx.slice(); p.cy = ty.slice();
    }
    p.tx = tx; p.ty = ty;
  }, [layoutMode, computeTargets, N]);

  // ── RAF draw loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || N === 0) return;
    const ctx = canvas.getContext('2d')!;
    let alive = true;

    function draw() {
      if (!alive) return;
      const p    = pos.current;
      const mode = layoutRef.current;
      const activeTopic = brushedTopicRef.current ?? hovTopicRef.current;

      ctx.clearRect(0, 0, CW, H);

      // lerp
      for (let i = 0; i < N; i++) {
        p.cx[i] += (p.tx[i] - p.cx[i]) * LERP_K;
        p.cy[i] += (p.ty[i] - p.cy[i]) * LERP_K;
      }

      // ── Timeline band backgrounds ─────────────────────────────────────────
      if (mode === 'timeline') {
        const activeTopics = TD.topics.filter(t => particles.some(pt => pt.primaryTopic === t));
        const topicCount   = new Map<string, number>();
        particles.forEach(pt => topicCount.set(pt.primaryTopic, (topicCount.get(pt.primaryTopic) ?? 0) + 1));
        const total = particles.length;
        let cumY = PAD.t;
        activeTopics.forEach(t => {
          const h  = ((topicCount.get(t) ?? 0) / total) * IH;
          const hl = activeTopic === t;
          ctx.fillStyle = TOPIC_COLOR[t] ?? '#888';
          ctx.globalAlpha = hl ? 0.20 : 0.09;
          ctx.fillRect(PAD.l, cumY, IW, h);
          // separator line
          ctx.globalAlpha = 0.18;
          ctx.strokeStyle = '#555';
          ctx.lineWidth   = 0.5;
          ctx.beginPath(); ctx.moveTo(PAD.l, cumY); ctx.lineTo(PAD.l + IW, cumY); ctx.stroke();
          // band label (right side, small)
          ctx.globalAlpha = 0.55;
          ctx.fillStyle   = TOPIC_COLOR[t] ?? '#888';
          ctx.font        = '8px system-ui,sans-serif';
          ctx.textAlign   = 'left';
          const lbl = t.length > 22 ? t.slice(0, 20) + '…' : t;
          ctx.fillText(lbl, PAD.l + 3, Math.min(cumY + h - 3, cumY + 12));
          cumY += h;
        });
        ctx.globalAlpha = 1;
      }

      // ── Paper boxes (computed from current lerped positions) ───────────────
      if (mode === 'paper') {
        const bboxes = new Map<string, { x0: number; y0: number; x1: number; y1: number }>();
        for (let i = 0; i < N; i++) {
          const cap = particles[i].caption;
          if (!bboxes.has(cap)) bboxes.set(cap, { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });
          const b = bboxes.get(cap)!;
          if (p.cx[i] < b.x0) b.x0 = p.cx[i];
          if (p.cy[i] < b.y0) b.y0 = p.cy[i];
          if (p.cx[i] > b.x1) b.x1 = p.cx[i];
          if (p.cy[i] > b.y1) b.y1 = p.cy[i];
        }
        ctx.save();
        bboxes.forEach((b, cap) => {
          if (!isFinite(b.x0)) return;
          const pd = 5;
          ctx.strokeStyle = 'rgba(180,180,180,0.30)';
          ctx.lineWidth   = 0.75;
          ctx.strokeRect(b.x0 - pd, b.y0 - pd - 9, b.x1 - b.x0 + pd * 2, b.y1 - b.y0 + pd * 2 + 9);
          ctx.fillStyle   = 'rgba(160,160,160,0.65)';
          ctx.font        = '6.5px system-ui,sans-serif';
          ctx.textAlign   = 'center';
          const lbl = cap.length > 22 ? cap.slice(0, 20) + '…' : cap;
          ctx.fillText(lbl, (b.x0 + b.x1) / 2, b.y0 - pd - 1);
        });
        ctx.restore();
      }

      // ── particles (2-pass when topic is active) ───────────────────────────
      const passes = activeTopic ? 2 : 1;
      for (let pass = 0; pass < passes; pass++) {
        for (let i = 0; i < N; i++) {
          const pt      = particles[i];
          const isMatch = activeTopic ? pt.primaryTopic === activeTopic : true;
          if (passes > 1 && pass === 0 &&  isMatch) continue;
          if (passes > 1 && pass === 1 && !isMatch) continue;

          ctx.globalAlpha = activeTopic ? (isMatch ? 0.92 : 0.05) : 0.68;
          ctx.fillStyle   = pt.color;
          ctx.beginPath();
          ctx.arc(p.cx[i], p.cy[i], R_NORM, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // ── axes / word labels ─────────────────────────────────────────────────
      drawAxes(ctx, mode, particles, CW, H, IW, IH);

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [particles, N, CW, H]); // NOT layout/hover — read via refs

  // ── mouse events ──────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = (e.clientX - rect.left) * (CW / rect.width);
    const my = (e.clientY - rect.top)  * (H  / rect.height);
    const p  = pos.current;
    let found: Particle | null = null;
    for (let i = 0; i < N; i++) {
      const dx = p.cx[i] - mx, dy = p.cy[i] - my;
      if (dx * dx + dy * dy < R_HOV * R_HOV * 2.5) { found = particles[i]; break; }
    }
    if (found) {
      hovTopicRef.current = found.primaryTopic;
      if (!brushedTopicRef.current) setHighlightTopic(found.primaryTopic);
      setTooltip({ cx: e.clientX, cy: e.clientY, p: found });
    } else {
      hovTopicRef.current = brushedTopicRef.current;
      if (!brushedTopicRef.current) setHighlightTopic(null);
      setTooltip(null);
    }
  }, [N, CW, H, particles]);

  const handleMouseLeave = useCallback(() => {
    hovTopicRef.current = brushedTopicRef.current;
    if (!brushedTopicRef.current) setHighlightTopic(null);
    setTooltip(null);
  }, []);

  const handleLegendHover = useCallback((topic: string | null) => {
    if (brushedTopicRef.current) return; // pinned — ignore hover
    hovTopicRef.current = topic;
    setHighlightTopic(topic);
  }, []);

  const handleLegendClick = useCallback((topic: string) => {
    const next = brushedTopicRef.current === topic ? null : topic;
    brushedTopicRef.current = next;
    hovTopicRef.current     = next;
    setPinnedTopic(next);
    setHighlightTopic(next);
  }, []);

  const clearPin = useCallback(() => {
    brushedTopicRef.current = null;
    hovTopicRef.current     = null;
    setPinnedTopic(null);
    setHighlightTopic(null);
  }, []);

  // ── derived ────────────────────────────────────────────────────────────────
  const activeTopics = TD.topics.filter(t => particles.some(p => p.primaryTopic === t));

  const BTNS: { id: LayoutMode; label: string; icon: string }[] = [
    { id: 'timeline', label: 'Timeline', icon: '◷' },
    { id: 'year',     label: 'By Year',  icon: '≡' },
    { id: 'paper',    label: 'By Paper', icon: '⊞' },
    { id: 'word',     label: 'By Word',  icon: '⊛' },
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
        <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.4 }}>
          {N.toLocaleString()} word×paper particles
        </span>
      </div>

      {/* ── canvas + right legend ── */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>

        {/* canvas */}
        <canvas
          ref={canvasRef}
          width={CW}
          height={H}
          style={fitMode
            ? { width: '100%', height: '72vh', display: 'block', flexShrink: 0 }
            : { display: 'block', flexShrink: 0 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* right legend */}
        <div style={{ width: LEGEND_W, flexShrink: 0, paddingTop: 2 }}>
          <div style={{
            fontSize: 9, opacity: 0.45, marginBottom: 5,
            textTransform: 'uppercase', letterSpacing: '0.07em',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>Topics</span>
            {pinnedTopic && (
              <button
                onClick={clearPin}
                style={{
                  fontSize: 9, background: 'none', border: '1px solid #555',
                  borderRadius: 3, padding: '1px 5px', cursor: 'pointer',
                  color: 'inherit', opacity: 0.7,
                }}
              >
                unpin
              </button>
            )}
          </div>
          {activeTopics.map(t => {
            const isHL     = highlightTopic === t;
            const isPinned = pinnedTopic === t;
            return (
              <div
                key={t}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 10, padding: '2px 5px', borderRadius: 3,
                  cursor: 'pointer',
                  opacity: highlightTopic && !isHL ? 0.28 : 0.85,
                  background: isHL ? 'rgba(255,255,255,0.07)' : 'transparent',
                  fontWeight: isPinned ? 700 : 400,
                  transition: 'opacity 0.12s',
                }}
                onClick={() => handleLegendClick(t)}
                onMouseEnter={() => handleLegendHover(t)}
                onMouseLeave={() => handleLegendHover(null)}
              >
                <span style={{
                  width: isPinned ? 9 : 7, height: isPinned ? 9 : 7,
                  borderRadius: '50%', flexShrink: 0,
                  background: TOPIC_COLOR[t] ?? '#999',
                  border: isPinned ? '1.5px solid rgba(255,255,255,0.7)' : 'none',
                  display: 'inline-block',
                }} />
                {t}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── tooltip ── */}
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.cx + 14,
          top:  tooltip.cy - 12,
          background: 'rgba(25,25,28,0.93)',
          color: '#e8e8e8',
          fontSize: 11,
          padding: '6px 9px',
          borderRadius: 5,
          pointerEvents: 'none',
          zIndex: 9999,
          maxWidth: 230,
          lineHeight: 1.55,
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}>
          <div><strong>"{tooltip.p.word}"</strong></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: tooltip.p.color, display: 'inline-block',
            }} />
            <span style={{ opacity: 0.85 }}>{tooltip.p.primaryTopic}</span>
          </div>
          <div style={{ opacity: 0.60, marginTop: 1, fontSize: 10 }}>{tooltip.p.caption}</div>
        </div>
      )}
    </div>
  );
}

// ─── axis / label drawing (outside component) ────────────────────────────────
function drawAxes(
  ctx: CanvasRenderingContext2D,
  mode: LayoutMode,
  particles: Particle[],
  W: number, H: number, IW: number, IH: number,
) {
  if (particles.length === 0) return;
  const yrs     = particles.map(p => p.year);
  const yMin    = Math.min(...yrs);
  const yMax    = Math.max(...yrs);
  const yrRange = Math.max(yMax - yMin, 1);
  const yearX   = (yr: number) => PAD.l + ((yr - yMin) / yrRange) * IW;

  ctx.save();
  ctx.font      = '9px system-ui,sans-serif';
  ctx.fillStyle = '#777';

  // year tick labels (timeline & year modes)
  if (mode === 'timeline' || mode === 'year') {
    const tickStep = yrRange <= 15 ? 2 : 5;
    ctx.textAlign = 'center';
    for (let yr = Math.ceil(yMin / tickStep) * tickStep; yr <= yMax; yr += tickStep) {
      ctx.fillText(String(yr), yearX(yr), H - PAD.b + 12);
    }
  }

  // word column labels (rotated, bottom)
  if (mode === 'word') {
    const topWordIdxs = [...new Set(particles.map(p => p.wordIdx))]
      .sort((a, b) => WD.freqs[b] - WD.freqs[a])
      .slice(0, TOP_WORDS);
    const nW   = topWordIdxs.length;
    const colW = IW / nW;
    const STEP_L = R_NORM * 2 + 0.8;
    const gridW  = Math.min(10, Math.max(3, Math.round(colW / STEP_L)));
    ctx.fillStyle = '#888';
    ctx.textAlign = 'right';
    topWordIdxs.forEach((wi, col) => {
      const x0     = PAD.l + col * colW + colW / 2 - ((gridW - 1) / 2) * STEP_L;
      const xLabel = x0 + ((gridW - 1) / 2) * STEP_L;
      ctx.save();
      ctx.translate(xLabel, H - PAD.b + 4);
      ctx.rotate(-Math.PI * 0.42);
      ctx.fillText(WD.words[wi], 0, 0);
      ctx.restore();
    });
  }

  // paper view hint
  if (mode === 'paper') {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#555';
    ctx.fillText('papers sorted by year →', PAD.l + 2, H - PAD.b + 12);
  }

  ctx.restore();
}
