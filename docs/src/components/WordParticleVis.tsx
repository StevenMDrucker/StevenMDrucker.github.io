/**
 * WordParticleVis — SandDance-style animated particle visualization.
 * Each particle is a (word × paper) occurrence. Layouts animate smoothly
 * between configurations using a lerp loop on a Canvas 2D context.
 *
 * Layouts
 *  • Timeline — proportional topic bands (by particle count), x = year within band
 *  • By Year  — x = publication year, particles stack vertically
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
type LayoutMode = 'timeline' | 'year' | 'word';

const LERP_K   = 0.09;
const R_NORM   = 2.5;
const R_HOV    = 4.5;
const STEP     = R_NORM * 2 + 0.8;   // ~6 px between particle centres
const LEGEND_W = 182;
// PAD.l = 130 reserves space for topic labels on the left (used in timeline mode)
const PAD = { t: 20, r: 8, b: 50, l: 130 } as const;
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
  const brushedTopicRef = useRef<string | null>(null);   // pinned via legend click
  const hovTopicRef     = useRef<string | null>(null);   // transient legend hover
  const hovWordRef      = useRef<string | null>(null);   // word hovered on canvas
  const layoutRef       = useRef<LayoutMode>('timeline');

  // React state for UI
  const [layoutMode,     setLayoutMode]     = useState<LayoutMode>('timeline');
  const [pinnedTopic,    setPinnedTopic]    = useState<string | null>(null);
  const [highlightTopic, setHighlightTopic] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ cx: number; cy: number; p: Particle } | null>(null);
  const [yearGridW,      setYearGridW]      = useState(5);   // slider: particles per row in year view

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
        // gridW: fit all particles into band height → expand horizontally for square clusters
        byYr.forEach((idxs, yr) => {
          const x0 = yearX(yr);
          const n  = idxs.length;
          // maxRows from band height; gridW fills horizontally to keep shape square-ish
          const maxRows = Math.max(1, Math.floor((bh - 6) / STEP));
          const gridW   = Math.max(1, Math.ceil(n / maxRows));
          // sort by caption then paperRank so same-paper words cluster together
          const sorted = idxs.slice().sort((a, b) => {
            const cc = particles[a].caption.localeCompare(particles[b].caption);
            return cc !== 0 ? cc : particles[a].paperRank - particles[b].paperRank;
          });
          sorted.forEach((i, k) => {
            const gc = k % gridW;
            const gr = Math.floor(k / gridW);
            tx[i] = x0 + gc * STEP + spread(i, 1.5);
            ty[i] = bt + 3 + gr * STEP + spread(i * 7, 1.5);
          });
        });
      });
    }

    // ── By Year: bottom-aligned grid bars, sorted by topic → paper → rank ────
    else if (mode === 'year') {
      const bottomY = PAD.t + IH;
      const byYear  = new Map<number, number[]>();
      particles.forEach((p, i) => {
        if (!byYear.has(p.year)) byYear.set(p.year, []);
        byYear.get(p.year)!.push(i);
      });
      byYear.forEach((idxs, yr) => {
        const xCenter = yearX(yr);
        const gw      = yearGridW;            // particles per row (from slider)
        const xLeft   = xCenter - ((gw - 1) / 2) * STEP;
        // sort: topicOrder → caption → paperRank
        const sorted = idxs.slice().sort((a, b) => {
          const pa = particles[a], pb = particles[b];
          if (pa.topicOrder !== pb.topicOrder) return pa.topicOrder - pb.topicOrder;
          const cc = pa.caption.localeCompare(pb.caption);
          if (cc !== 0) return cc;
          return pa.paperRank - pb.paperRank;
        });
        sorted.forEach((i, k) => {
          const col = k % gw;
          const row = Math.floor(k / gw);
          tx[i] = xLeft + col * STEP + spread(i, 0.8);
          ty[i] = bottomY - row * STEP + spread(i * 7, 0.8);
        });
      });
    }

    // ── By Word: columns sorted most→least freq (by particle count), bottom-up stacking
    else if (mode === 'word') {
      // Sort by how many particles exist for each word in the current filtered set
      // (not global WD.freqs) so columns are strictly monotonically decreasing in height
      const wordParticleCount = new Map<number, number>();
      particles.forEach(p => wordParticleCount.set(p.wordIdx, (wordParticleCount.get(p.wordIdx) ?? 0) + 1));
      const topWordIdxs = [...wordParticleCount.keys()]
        .sort((a, b) => (wordParticleCount.get(b) ?? 0) - (wordParticleCount.get(a) ?? 0))
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
  }, [particles, N, CW, H, IW, IH, yearGridW]);

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
      const p           = pos.current;
      const mode        = layoutRef.current;
      const activeTopic = brushedTopicRef.current ?? hovTopicRef.current;
      const activeWord  = hovWordRef.current;

      ctx.clearRect(0, 0, CW, H);

      // lerp
      for (let i = 0; i < N; i++) {
        p.cx[i] += (p.tx[i] - p.cx[i]) * LERP_K;
        p.cy[i] += (p.ty[i] - p.cy[i]) * LERP_K;
      }

      // ── Timeline band backgrounds + left-margin topic labels ──────────────
      if (mode === 'timeline') {
        const activeTopics = TD.topics.filter(t => particles.some(pt => pt.primaryTopic === t));
        const topicCount   = new Map<string, number>();
        particles.forEach(pt => topicCount.set(pt.primaryTopic, (topicCount.get(pt.primaryTopic) ?? 0) + 1));
        const total = particles.length;
        let cumY = PAD.t;
        activeTopics.forEach(t => {
          const h  = ((topicCount.get(t) ?? 0) / total) * IH;
          const hl = activeTopic === t;
          // coloured band fill
          ctx.fillStyle   = TOPIC_COLOR[t] ?? '#888';
          ctx.globalAlpha = hl ? 0.22 : 0.10;
          ctx.fillRect(PAD.l, cumY, IW, h);
          // separator line
          ctx.globalAlpha = 0.20;
          ctx.strokeStyle = '#555';
          ctx.lineWidth   = 0.5;
          ctx.beginPath(); ctx.moveTo(0, cumY); ctx.lineTo(CW, cumY); ctx.stroke();
          // left-margin topic label (right-aligned, vertically centred in band)
          ctx.globalAlpha = hl ? 0.90 : 0.60;
          ctx.fillStyle   = TOPIC_COLOR[t] ?? '#888';
          ctx.font        = `${h < 16 ? 7 : 8}px system-ui,sans-serif`;
          ctx.textAlign   = 'right';
          const lbl = t.length > 20 ? t.slice(0, 18) + '…' : t;
          const labelY = Math.max(cumY + 9, Math.min(cumY + h - 3, cumY + h / 2 + 4));
          ctx.fillText(lbl, PAD.l - 5, labelY);
          cumY += h;
        });
        ctx.globalAlpha = 1;
      }

      // ── particles — dual brushing: word (canvas) AND/OR topic (legend) ────
      // Priority: activeTopic from legend dims by topic; activeWord dims by word
      // When both are set, a particle survives if it matches topic OR matches word
      const hasBrush = !!(activeTopic || activeWord);
      const passes   = hasBrush ? 2 : 1;
      for (let pass = 0; pass < passes; pass++) {
        for (let i = 0; i < N; i++) {
          const pt = particles[i];
          let isMatch: boolean;
          if (activeTopic && activeWord) {
            isMatch = pt.primaryTopic === activeTopic || pt.word === activeWord;
          } else if (activeTopic) {
            isMatch = pt.primaryTopic === activeTopic;
          } else {
            isMatch = pt.word === activeWord;
          }
          if (passes > 1 && pass === 0 &&  isMatch) continue;
          if (passes > 1 && pass === 1 && !isMatch) continue;

          ctx.globalAlpha = hasBrush ? (isMatch ? 0.92 : 0.05) : 0.68;
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
      hovWordRef.current = found.word;  // word brushing from canvas — does NOT affect topic legend
      setTooltip({ cx: e.clientX, cy: e.clientY, p: found });
    } else {
      hovWordRef.current = null;
      setTooltip(null);
    }
  }, [N, CW, H, particles]);

  const handleMouseLeave = useCallback(() => {
    hovWordRef.current = null;
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
        {/* Year-view width slider */}
        {layoutMode === 'year' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, opacity: 0.8 }}>
            <span style={{ opacity: 0.6 }}>Width:</span>
            <input
              type="range" min="2" max="20" step="1" value={yearGridW}
              onChange={e => setYearGridW(Number(e.target.value))}
              style={{ width: 90, accentColor: '#aaa' }}
            />
            <span style={{ minWidth: 20, opacity: 0.6 }}>{yearGridW}</span>
          </div>
        )}

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

  // word column labels (rotated, bottom) — must use same sort as computeTargets
  if (mode === 'word') {
    const wordParticleCount = new Map<number, number>();
    particles.forEach(p => wordParticleCount.set(p.wordIdx, (wordParticleCount.get(p.wordIdx) ?? 0) + 1));
    const topWordIdxs = [...wordParticleCount.keys()]
      .sort((a, b) => (wordParticleCount.get(b) ?? 0) - (wordParticleCount.get(a) ?? 0))
      .slice(0, TOP_WORDS);
    const nW     = topWordIdxs.length;
    const colW   = IW / nW;
    const gridW  = Math.min(10, Math.max(3, Math.round(colW / STEP)));
    ctx.fillStyle = '#888';
    ctx.textAlign = 'right';
    topWordIdxs.forEach((wi, col) => {
      const x0     = PAD.l + col * colW + colW / 2 - ((gridW - 1) / 2) * STEP;
      const xLabel = x0 + ((gridW - 1) / 2) * STEP;
      ctx.save();
      ctx.translate(xLabel, H - PAD.b + 4);
      ctx.rotate(-Math.PI * 0.42);
      ctx.fillText(WD.words[wi], 0, 0);
      ctx.restore();
    });
  }

  ctx.restore();
}
