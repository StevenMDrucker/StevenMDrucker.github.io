/**
 * WordParticleVis — SandDance-style animated particle visualization.
 * Each particle is a (word × paper) occurrence. Layouts animate smoothly
 * between configurations using a lerp loop on a Canvas 2D context.
 *
 * Layouts
 *  • Timeline — fixed-height topic bands, square clusters, x = year
 *  • By Year  — bars sized to fit viewport height, non-overlapping
 *  • By Word  — top-40 words as columns, bottom-up stacks
 *  • Unique   — TF-IDF distinctive words grouped by topic
 */

import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import wordDataRaw  from '../data/wordData.json';
import topicDataRaw from '../data/topicData.json';
import wordStatsRaw from '../data/wordStats.json';

// ─── types ───────────────────────────────────────────────────────────────────
interface WData {
  words: string[];
  freqs: number[];
  papers: Array<{ caption: string; year: number; wordcount: number; tw: [number, number][]; }>;
}
interface TData {
  topics: string[];
  papers: Record<string, { year: number; weights: Record<string, number>; }>;
}
interface WSData {
  stems: string[];
  wordToStem: Record<string, number>;            // wordIdx (string key) → stemIdx
  topicWords: Record<string, [number, number][]>; // topic → [[stemIdx, score], …]
}

const WD = wordDataRaw  as WData;
const TD = topicDataRaw as TData;
const WS = wordStatsRaw as unknown as WSData;

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
type LayoutMode = 'timeline' | 'year' | 'word' | 'unique';

const LERP_K   = 0.09;
const R_NORM   = 2.5;
const R_HOV    = 4.5;
const STEP     = R_NORM * 2 + 0.8;   // ~6 px between particle centres
const LEGEND_W = 182;
const PAD = { t: 20, r: 8, b: 50, l: 130 } as const;
const TOP_WORDS  = 40;
const TOP_UNIQUE = 8;   // distinctive stems per topic in unique mode

function spread(seed: number, range: number): number {
  return ((seed * 1.6180339887) % 1) * range - range * 0.5;
}

// ─── layout metrics ──────────────────────────────────────────────────────────
interface LayoutMetrics {
  CW: number; H: number; IW: number; IH: number;
  yMin: number; yMax: number; yrRange: number;
  yearSpacing: number;         // px between consecutive year marks
  minGridW: number;            // year mode: minimum columns so bar fits in height
  effectiveGridW: number;      // year mode: actual columns used (≥ minGridW)
  globalGridW: number;         // timeline mode: uniform column count per cluster
  sectionH: Map<string, number>; // timeline mode: px height per topic band
  activeTopicsTimeline: string[]; // timeline mode: ordered list of present topics
}

// ─── component ───────────────────────────────────────────────────────────────
export function WordParticleVis({
  items,
  containerWidth = 800,
  fitMode = false,
  handleClick,
}: {
  items: any[];
  containerWidth?: number;
  fitMode?: boolean;
  handleClick?: (caption: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);

  const brushedTopicRef  = useRef<string | null>(null);
  const hovTopicRef      = useRef<string | null>(null);
  const hovWordRef       = useRef<string | null>(null);
  const hovCaptionRef    = useRef<string | null>(null);  // paper hovered — drives ring + dim
  const layoutRef        = useRef<LayoutMode>('timeline');

  const [layoutMode,     setLayoutMode]     = useState<LayoutMode>('timeline');
  const [pinnedTopic,    setPinnedTopic]    = useState<string | null>(null);
  const [highlightTopic, setHighlightTopic] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ cx: number; cy: number; p: Particle } | null>(null);
  const [yearGridW,      setYearGridW]      = useState(5);

  const baseCW = Math.max(400, containerWidth - LEGEND_W - 16);

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

  // ── compute layout metrics (all sizing is here) ───────────────────────────
  const layoutMetrics = useMemo<LayoutMetrics>(() => {
    const H_vp = typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.72) : 560;
    const fallback: LayoutMetrics = {
      CW: baseCW,
      H: H_vp,
      IW: Math.max(1, baseCW - PAD.l - PAD.r),
      IH: Math.max(1, H_vp - PAD.t - PAD.b),
      yMin: 2000, yMax: 2024, yrRange: 24,
      yearSpacing: 40,
      minGridW: 1, effectiveGridW: yearGridW,
      globalGridW: 3, sectionH: new Map(), activeTopicsTimeline: [],
    };
    if (N === 0) return fallback;

    const yrs    = particles.map(p => p.year);
    const yMin   = Math.min(...yrs);
    const yMax   = Math.max(...yrs);
    const yrRange = Math.max(yMax - yMin, 1);

    // ── By Year ───────────────────────────────────────────────────────────
    // Height = viewport → derive min columns needed → bars can't overlap
    if (layoutMode === 'year') {
      const H   = H_vp;
      const IH  = H - PAD.t - PAD.b;
      const byYear = new Map<number, number>();
      particles.forEach(p => byYear.set(p.year, (byYear.get(p.year) ?? 0) + 1));
      const maxCount    = Math.max(...byYear.values());
      const maxRows     = Math.max(1, Math.floor(IH / STEP));
      const minGridW    = Math.max(1, Math.ceil(maxCount / maxRows));
      const effectiveGridW = Math.max(minGridW, yearGridW);
      const barW        = effectiveGridW * STEP;
      const yearSpacing = barW + 4;          // 4 px gap between bar centres
      // yearX(yr) = PAD.l + (yr - yMin + 0.5) * yearSpacing
      // IW = (yrRange + 1) * yearSpacing gives half-slot breathing room on each end
      const IW  = (yrRange + 1) * yearSpacing;
      const CW  = Math.max(baseCW, PAD.l + IW + PAD.r + 4);
      return { ...fallback, CW, H, IW, IH, yMin, yMax, yrRange, yearSpacing, minGridW, effectiveGridW };
    }

    // ── Timeline ──────────────────────────────────────────────────────────
    // Square clusters (gridW = ceil(sqrt(n))), uniform column width, section
    // heights driven by data so nothing overlaps in X or Y.
    if (layoutMode === 'timeline') {
      const byTopicYear = new Map<string, Map<number, number>>();
      particles.forEach(p => {
        if (!byTopicYear.has(p.primaryTopic)) byTopicYear.set(p.primaryTopic, new Map());
        const m = byTopicYear.get(p.primaryTopic)!;
        m.set(p.year, (m.get(p.year) ?? 0) + 1);
      });
      // Global max cluster size → uniform gridW so all year-columns align
      let globalMaxN = 1;
      byTopicYear.forEach(byYr => byYr.forEach(n => { if (n > globalMaxN) globalMaxN = n; }));
      const globalGridW  = Math.max(1, Math.ceil(Math.sqrt(globalMaxN)));
      const clusterW     = globalGridW * STEP;
      const yearSpacing  = clusterW + 4;
      const IW           = (yrRange + 1) * yearSpacing;

      const activeTopicsTimeline = TD.topics.filter(t => byTopicYear.has(t));
      const sectionH = new Map<string, number>();
      activeTopicsTimeline.forEach(t => {
        const maxN  = Math.max(...byTopicYear.get(t)!.values());
        const rows  = Math.max(1, Math.ceil(maxN / globalGridW));
        sectionH.set(t, rows * STEP + 10);   // 10 px top-pad per section
      });
      const totalH = PAD.t + PAD.b + [...sectionH.values()].reduce((s, h) => s + h, 0);
      const H      = Math.max(200, totalH);
      const IH     = H - PAD.t - PAD.b;
      const CW     = Math.max(baseCW, PAD.l + IW + PAD.r + 4);
      return { ...fallback, CW, H, IW, IH, yMin, yMax, yrRange, yearSpacing, globalGridW, sectionH, activeTopicsTimeline };
    }

    // ── Unique Words ──────────────────────────────────────────────────────
    // One column per (topic, distinctive-word) pair; topics separated by a gap slot.
    if (layoutMode === 'unique') {
      const H   = H_vp;
      const IH  = H - PAD.t - PAD.b;
      const nT  = TD.topics.filter(t => particles.some(p => p.primaryTopic === t)).length;
      const totalSlots = nT > 0 ? nT * TOP_UNIQUE + (nT - 1) : TOP_UNIQUE;
      const minIW = Math.ceil(totalSlots * (STEP + 1));
      const IW    = Math.max(baseCW - PAD.l - PAD.r, minIW);
      const CW    = Math.max(baseCW, PAD.l + PAD.r + IW);
      return { ...fallback, CW, H, IW, IH };
    }

    // ── By Word (default) ────────────────────────────────────────────────
    const H   = H_vp;
    const IH  = H - PAD.t - PAD.b;
    const IW  = Math.max(1, baseCW - PAD.l - PAD.r);
    return { ...fallback, CW: baseCW, H, IW, IH };
  }, [particles, N, layoutMode, yearGridW, baseCW]);

  const { CW, H, IW, IH } = layoutMetrics;
  const canvasNeedsScroll = CW > baseCW;

  // Mutable ref so RAF loop always sees the latest metrics without restarts
  const metricsRef = useRef(layoutMetrics);
  metricsRef.current = layoutMetrics;

  // Clamp yearGridW up to minGridW when the data changes (year mode only)
  useEffect(() => {
    if (layoutMode === 'year' && layoutMetrics.minGridW > yearGridW) {
      setYearGridW(layoutMetrics.minGridW);
    }
  }, [layoutMode, layoutMetrics.minGridW]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── position buffers ──────────────────────────────────────────────────────
  const pos = useRef({
    cx: new Float32Array(0), cy: new Float32Array(0),
    tx: new Float32Array(0), ty: new Float32Array(0),
  });

  // ── layout computation ────────────────────────────────────────────────────
  const computeTargets = useCallback((mode: LayoutMode): { tx: Float32Array; ty: Float32Array } => {
    const tx = new Float32Array(N);
    const ty = new Float32Array(N);
    if (N === 0) return { tx, ty };

    const m = metricsRef.current;
    const { CW: cw, IW: iw, IH: ih, yMin, yearSpacing, effectiveGridW, globalGridW, sectionH, activeTopicsTimeline } = m;

    // Shared year→x mapping for timeline & year modes
    const yearX = (yr: number) => PAD.l + (yr - yMin + 0.5) * yearSpacing;

    // ── Timeline ────────────────────────────────────────────────────────────
    if (mode === 'timeline') {
      const byTopicYear = new Map<string, Map<number, number[]>>();
      particles.forEach((p, i) => {
        if (!byTopicYear.has(p.primaryTopic)) byTopicYear.set(p.primaryTopic, new Map());
        const mp = byTopicYear.get(p.primaryTopic)!;
        if (!mp.has(p.year)) mp.set(p.year, []);
        mp.get(p.year)!.push(i);
      });

      let cumY = PAD.t;
      activeTopicsTimeline.forEach(t => {
        const sh   = sectionH.get(t) ?? 20;
        const byYr = byTopicYear.get(t) ?? new Map<number, number[]>();
        byYr.forEach((idxs, yr) => {
          const xCenter = yearX(yr);
          const n       = idxs.length;
          // Square cluster: gridW ≈ sqrt(n), capped at globalGridW
          const gw      = Math.min(globalGridW, Math.max(1, Math.ceil(Math.sqrt(n))));
          const xLeft   = xCenter - ((gw - 1) / 2) * STEP;
          const sorted  = idxs.slice().sort((a, b) => {
            const cc = particles[a].caption.localeCompare(particles[b].caption);
            return cc !== 0 ? cc : particles[a].paperRank - particles[b].paperRank;
          });
          sorted.forEach((i, k) => {
            tx[i] = xLeft + (k % gw) * STEP + spread(i, 0.6);
            ty[i] = cumY + 4 + Math.floor(k / gw) * STEP + spread(i * 7, 0.6);
          });
        });
        cumY += sh;
      });
    }

    // ── By Year ─────────────────────────────────────────────────────────────
    else if (mode === 'year') {
      const bottomY = PAD.t + ih;
      const gw      = effectiveGridW;
      const byYear  = new Map<number, number[]>();
      particles.forEach((p, i) => {
        if (!byYear.has(p.year)) byYear.set(p.year, []);
        byYear.get(p.year)!.push(i);
      });
      byYear.forEach((idxs, yr) => {
        const xCenter = yearX(yr);
        const xLeft   = xCenter - ((gw - 1) / 2) * STEP;
        const sorted  = idxs.slice().sort((a, b) => {
          const pa = particles[a], pb = particles[b];
          if (pa.topicOrder !== pb.topicOrder) return pa.topicOrder - pb.topicOrder;
          const cc = pa.caption.localeCompare(pb.caption);
          return cc !== 0 ? cc : pa.paperRank - pb.paperRank;
        });
        sorted.forEach((i, k) => {
          tx[i] = xLeft + (k % gw) * STEP + spread(i, 0.8);
          ty[i] = bottomY - Math.floor(k / gw) * STEP + spread(i * 7, 0.8);
        });
      });
    }

    // ── By Word ─────────────────────────────────────────────────────────────
    else if (mode === 'word') {
      const wordCount = new Map<number, number>();
      particles.forEach(p => wordCount.set(p.wordIdx, (wordCount.get(p.wordIdx) ?? 0) + 1));
      const topWordIdxs = [...wordCount.keys()]
        .sort((a, b) => (wordCount.get(b) ?? 0) - (wordCount.get(a) ?? 0))
        .slice(0, TOP_WORDS);
      const wPosMap = new Map<number, number>(topWordIdxs.map((wi, i) => [wi, i]));
      const colW    = iw / topWordIdxs.length;
      const gridW   = Math.min(10, Math.max(1, Math.floor(colW / STEP)));

      const byWord = new Map<number, number[]>();
      particles.forEach((p, i) => {
        if (wPosMap.has(p.wordIdx)) {
          if (!byWord.has(p.wordIdx)) byWord.set(p.wordIdx, []);
          byWord.get(p.wordIdx)!.push(i);
        } else {
          tx[i] = cw + 80; ty[i] = PAD.t + ih / 2;
        }
      });
      const baseY = PAD.t + ih;
      topWordIdxs.forEach((wi, col) => {
        const x0   = PAD.l + col * colW + colW / 2 - ((gridW - 1) / 2) * STEP;
        const idxs = (byWord.get(wi) ?? []).sort((a, b) => {
          const pa = particles[a], pb = particles[b];
          if (pa.topicOrder !== pb.topicOrder) return pa.topicOrder - pb.topicOrder;
          return pa.caption.localeCompare(pb.caption);
        });
        idxs.forEach((idx, k) => {
          tx[idx] = x0 + (k % gridW) * STEP + spread(idx * 5, 0.5);
          ty[idx] = baseY - Math.floor(k / gridW) * STEP + spread(idx * 13, 0.5);
        });
      });
    }

    // ── Unique Words ─────────────────────────────────────────────────────────
    else if (mode === 'unique') {
      const activeTopics_u = TD.topics.filter(t => particles.some(p => p.primaryTopic === t));
      const K    = TOP_UNIQUE;
      const nT   = activeTopics_u.length;
      const totalSlots = nT > 0 ? nT * K + (nT - 1) : K;
      const colW  = iw / totalSlots;
      const gridR = Math.max(1, Math.floor(colW / STEP));

      // Per-topic top-K distinctive stems
      const topicStemList = new Map<string, number[]>();
      activeTopics_u.forEach(t => {
        topicStemList.set(t, (WS.topicWords[t] ?? []).slice(0, K).map(([si]) => si));
      });

      // Bucket particles into (topicIdx, wordPos) columns
      const colBuckets = new Map<string, number[]>();
      particles.forEach((p, i) => {
        const stemIdx = WS.wordToStem[String(p.wordIdx)] ?? -1;
        const stems   = topicStemList.get(p.primaryTopic);
        const wiInT   = stems ? stems.indexOf(stemIdx) : -1;
        if (wiInT >= 0) {
          const key = `${activeTopics_u.indexOf(p.primaryTopic)}_${wiInT}`;
          if (!colBuckets.has(key)) colBuckets.set(key, []);
          colBuckets.get(key)!.push(i);
        } else {
          tx[i] = cw + 80; ty[i] = PAD.t + ih / 2;
        }
      });

      const baseY = PAD.t + ih;
      activeTopics_u.forEach((t, ti) => {
        const stems = topicStemList.get(t) ?? [];
        stems.forEach((_, wi) => {
          const slotIdx = ti * (K + 1) + wi;
          const xCenter = PAD.l + (slotIdx + 0.5) * colW;
          const idxs    = (colBuckets.get(`${ti}_${wi}`) ?? [])
            .slice().sort((a, b) => particles[a].caption.localeCompare(particles[b].caption));
          idxs.forEach((idx, k) => {
            tx[idx] = xCenter - ((gridR - 1) / 2) * STEP + (k % gridR) * STEP + spread(idx * 5, 0.5);
            ty[idx] = baseY - Math.floor(k / gridR) * STEP + spread(idx * 13, 0.5);
          });
        });
      });
    }

    return { tx, ty };
  }, [particles, N]); // metricsRef is always current — no dep needed

  // ── update targets on layout/particle change ──────────────────────────────
  useEffect(() => {
    if (N === 0) return;
    const p = pos.current;
    const { tx, ty } = computeTargets(layoutMode);
    if (p.cx.length !== N) { p.cx = tx.slice(); p.cy = ty.slice(); }
    p.tx = tx; p.ty = ty;
  }, [layoutMode, computeTargets, N]);

  // ── RAF draw loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || N === 0) return;
    const ctx = canvas.getContext('2d')!;
    let alive = true;

    function draw() {
      if (!alive) return;
      const p           = pos.current;
      const mode        = layoutRef.current;
      const metrics     = metricsRef.current;
      const activeTopic = brushedTopicRef.current ?? hovTopicRef.current;
      const activeWord  = hovWordRef.current;

      ctx.clearRect(0, 0, CW, H);

      for (let i = 0; i < N; i++) {
        p.cx[i] += (p.tx[i] - p.cx[i]) * LERP_K;
        p.cy[i] += (p.ty[i] - p.cy[i]) * LERP_K;
      }

      // ── Timeline: data-driven section bands ──────────────────────────────
      if (mode === 'timeline') {
        const { sectionH: sh, activeTopicsTimeline: atl } = metrics;
        let cumY = PAD.t;
        atl.forEach(t => {
          const h  = sh.get(t) ?? 10;
          const hl = activeTopic === t;
          ctx.fillStyle   = TOPIC_COLOR[t] ?? '#888';
          ctx.globalAlpha = hl ? 0.22 : 0.10;
          ctx.fillRect(PAD.l, cumY, IW, h);
          ctx.globalAlpha = 0.20;
          ctx.strokeStyle = '#555'; ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(0, cumY); ctx.lineTo(CW, cumY); ctx.stroke();
          ctx.globalAlpha = hl ? 0.90 : 0.60;
          ctx.fillStyle   = TOPIC_COLOR[t] ?? '#888';
          ctx.font        = `${h < 16 ? 7 : 8}px system-ui,sans-serif`;
          ctx.textAlign   = 'right';
          const lbl = t.length > 20 ? t.slice(0, 18) + '…' : t;
          ctx.fillText(lbl, PAD.l - 5, Math.max(cumY + 9, Math.min(cumY + h - 3, cumY + h / 2 + 4)));
          cumY += h;
        });
        ctx.globalAlpha = 1;
      }

      // ── Unique: topic group column backgrounds ────────────────────────────
      if (mode === 'unique') {
        const activeTopics_u = TD.topics.filter(t => particles.some(q => q.primaryTopic === t));
        const K = TOP_UNIQUE;
        const nT = activeTopics_u.length;
        const totalSlots = nT > 0 ? nT * K + (nT - 1) : K;
        const colW = IW / totalSlots;
        let slotStart = 0;
        activeTopics_u.forEach(t => {
          const xLeft  = PAD.l + slotStart * colW;
          const hl     = activeTopic === t;
          ctx.fillStyle   = TOPIC_COLOR[t] ?? '#888';
          ctx.globalAlpha = hl ? 0.20 : 0.07;
          ctx.fillRect(xLeft, PAD.t, K * colW, IH);
          slotStart += K + 1;
        });
        ctx.globalAlpha = 1;
      }

      // ── particles (dual brushing + paper hover) ───────────────────────────
      const hovCap    = hovCaptionRef.current;
      const hasBrush  = !!(activeTopic || activeWord || hovCap);
      const passes    = hasBrush ? 2 : 1;
      for (let pass = 0; pass < passes; pass++) {
        for (let i = 0; i < N; i++) {
          const pt = particles[i];
          let isMatch: boolean;
          if (hovCap) {
            // paper hover: highlight this paper; topic/word brush still applies if set
            isMatch = pt.caption === hovCap &&
              (!activeTopic || pt.primaryTopic === activeTopic) &&
              (!activeWord  || pt.word === activeWord);
          } else if (activeTopic && activeWord) {
            isMatch = pt.primaryTopic === activeTopic || pt.word === activeWord;
          } else if (activeTopic) {
            isMatch = pt.primaryTopic === activeTopic;
          } else {
            isMatch = pt.word === activeWord;
          }
          if (passes > 1 && pass === 0 &&  isMatch) continue;
          if (passes > 1 && pass === 1 && !isMatch) continue;
          // Paper hover dims non-paper particles less harshly (0.18) than brush (0.05)
          const dimAlpha = hovCap ? 0.18 : 0.05;
          ctx.globalAlpha = hasBrush ? (isMatch ? 0.94 : dimAlpha) : 0.68;
          ctx.fillStyle   = pt.color;
          ctx.beginPath();
          ctx.arc(p.cx[i], p.cy[i], R_NORM, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // ── paper hover: white ring + floating caption label ─────────────────
      if (hovCap) {
        // Ring outline on every particle belonging to the hovered paper
        ctx.strokeStyle = 'rgba(255,255,255,0.80)';
        ctx.lineWidth   = 1.0;
        ctx.globalAlpha = 1;
        for (let i = 0; i < N; i++) {
          if (particles[i].caption === hovCap) {
            ctx.beginPath();
            ctx.arc(p.cx[i], p.cy[i], R_NORM + 1.4, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        // Floating label near the cluster centroid
        let sx = 0, sy = 0, cnt = 0;
        for (let i = 0; i < N; i++) {
          if (particles[i].caption === hovCap) { sx += p.cx[i]; sy += p.cy[i]; cnt++; }
        }
        if (cnt > 0) {
          const labelX = Math.max(60, Math.min(CW - 60, sx / cnt));
          const labelY = Math.max(30, (sy / cnt) - R_NORM * 4 - 8);
          const text    = hovCap.length > 52 ? hovCap.slice(0, 49) + '…' : hovCap;
          ctx.save();
          ctx.font      = 'bold 11px system-ui,sans-serif';
          ctx.textAlign = 'center';
          const tw = ctx.measureText(text).width;
          // Dark pill background
          ctx.fillStyle   = 'rgba(18,18,22,0.88)';
          ctx.globalAlpha = 1;
          const rx = labelX - tw / 2 - 8, ry = labelY - 13, rw = tw + 16, rh = 18;
          ctx.beginPath();
          ctx.roundRect(rx, ry, rw, rh, 4);
          ctx.fill();
          // White text
          ctx.fillStyle = '#eaeaea';
          ctx.fillText(text, labelX, labelY);
          ctx.restore();
        }
      }

      drawAxes(ctx, mode, particles, metrics, CW, H, IW, IH);

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [particles, N, CW, H, IW, IH]);

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
      hovWordRef.current    = found.word;
      hovCaptionRef.current = found.caption;
      setTooltip({ cx: e.clientX, cy: e.clientY, p: found });
    } else {
      hovWordRef.current    = null;
      hovCaptionRef.current = null;
      setTooltip(null);
    }
  }, [N, CW, H, particles]);

  const handleMouseLeave = useCallback(() => {
    hovWordRef.current = null; hovCaptionRef.current = null; setTooltip(null);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!handleClick) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = (e.clientX - rect.left) * (CW / rect.width);
    const my = (e.clientY - rect.top)  * (H  / rect.height);
    const p  = pos.current;
    for (let i = 0; i < N; i++) {
      const dx = p.cx[i] - mx, dy = p.cy[i] - my;
      if (dx * dx + dy * dy < R_HOV * R_HOV * 2.5) {
        handleClick(particles[i].caption);
        return;
      }
    }
  }, [N, CW, H, particles, handleClick]);

  const handleLegendHover = useCallback((topic: string | null) => {
    if (brushedTopicRef.current) return;
    hovTopicRef.current = topic;
    setHighlightTopic(topic);
  }, []);

  const handleLegendClick = useCallback((topic: string) => {
    const next = brushedTopicRef.current === topic ? null : topic;
    brushedTopicRef.current = next; hovTopicRef.current = next;
    setPinnedTopic(next); setHighlightTopic(next);
  }, []);

  const clearPin = useCallback(() => {
    brushedTopicRef.current = null; hovTopicRef.current = null;
    setPinnedTopic(null); setHighlightTopic(null);
  }, []);

  const activeTopics = TD.topics.filter(t => particles.some(p => p.primaryTopic === t));

  const BTNS: { id: LayoutMode; label: string; icon: string }[] = [
    { id: 'timeline', label: 'Timeline', icon: '◷' },
    { id: 'year',     label: 'By Year',  icon: '≡' },
    { id: 'word',     label: 'By Word',  icon: '⊛' },
    { id: 'unique',   label: 'Unique',   icon: '★' },
  ];

  const scrollWrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollWrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => e.preventDefault();
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div style={{ userSelect: 'none', width: '100%', overflow: 'hidden' }}>

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

        {layoutMode === 'year' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, opacity: 0.8 }}>
            <span style={{ opacity: 0.6 }}>Width:</span>
            <input
              type="range"
              min={layoutMetrics.minGridW}
              max={Math.max(20, layoutMetrics.minGridW + 15)}
              step="1"
              value={yearGridW}
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

      {/* ── canvas + legend ── */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>

        <div
          ref={scrollWrapRef}
          style={{
            overflowX: 'auto', overflowY: 'auto', maxHeight: '72vh',
            flexGrow: 1, flexShrink: 1, minWidth: 0,
          }}
        >
          <canvas
            ref={canvasRef}
            width={CW}
            height={H}
            style={{ display: 'block', cursor: handleClick ? 'pointer' : 'default' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleCanvasClick}
          />
        </div>

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
              >unpin</button>
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

      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.cx + 14, top: tooltip.cy - 16,
            background: 'rgba(18,18,22,0.94)', color: '#eaeaea',
            fontSize: 11, padding: '7px 10px', borderRadius: 6,
            pointerEvents: handleClick ? 'auto' : 'none',
            cursor: handleClick ? 'pointer' : 'default',
            zIndex: 9999,
            maxWidth: 260, lineHeight: 1.55,
            boxShadow: '0 3px 10px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onClick={() => handleClick?.(tooltip.p.caption)}
        >
          {/* Paper title — prominent header */}
          <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4, lineHeight: 1.35 }}>
            {tooltip.p.caption}
          </div>
          {/* Topic row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, opacity: 0.85 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: tooltip.p.color, display: 'inline-block',
            }} />
            <span>{tooltip.p.primaryTopic}</span>
          </div>
          {/* Word detail */}
          <div style={{ opacity: 0.55, marginTop: 2, fontSize: 10 }}>
            word: <em>{tooltip.p.word}</em>
            {handleClick && <span style={{ marginLeft: 6, opacity: 0.7 }}>— click to open</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── axis / label drawing ─────────────────────────────────────────────────────
function drawAxes(
  ctx: CanvasRenderingContext2D,
  mode: LayoutMode,
  particles: Particle[],
  metrics: LayoutMetrics,
  W: number, H: number, IW: number, IH: number,
) {
  if (particles.length === 0) return;
  const { yMin, yMax, yrRange, yearSpacing } = metrics;
  // yearX matches computeTargets: half-slot offset so first/last bars are centred
  const yearX = (yr: number) => PAD.l + (yr - yMin + 0.5) * yearSpacing;

  ctx.save();
  ctx.font = '9px system-ui,sans-serif';

  // year tick labels (timeline & year)
  if (mode === 'timeline' || mode === 'year') {
    const tickStep = yrRange <= 15 ? 2 : 5;
    ctx.fillStyle = '#777';
    ctx.textAlign = 'center';
    for (let yr = Math.ceil(yMin / tickStep) * tickStep; yr <= yMax; yr += tickStep) {
      ctx.fillText(String(yr), yearX(yr), H - PAD.b + 12);
    }
  }

  // word column labels (rotated)
  if (mode === 'word') {
    const wordCount = new Map<number, number>();
    particles.forEach(p => wordCount.set(p.wordIdx, (wordCount.get(p.wordIdx) ?? 0) + 1));
    const topWordIdxs = [...wordCount.keys()]
      .sort((a, b) => (wordCount.get(b) ?? 0) - (wordCount.get(a) ?? 0))
      .slice(0, TOP_WORDS);
    const colW   = IW / topWordIdxs.length;
    const gridW  = Math.min(10, Math.max(1, Math.floor(colW / STEP)));
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

  // unique mode: topic group labels + rotated word labels
  if (mode === 'unique') {
    const activeTopics_u = TD.topics.filter(t => particles.some(p => p.primaryTopic === t));
    const K          = TOP_UNIQUE;
    const nT         = activeTopics_u.length;
    const totalSlots = nT > 0 ? nT * K + (nT - 1) : K;
    const colW       = IW / totalSlots;
    let slotStart    = 0;
    activeTopics_u.forEach(t => {
      const xLeft   = PAD.l + slotStart * colW;
      const xCenter = xLeft + K * colW / 2;
      // topic label — bold, near-white, readable on dark background
      ctx.textAlign   = 'center';
      ctx.font        = 'bold 10.5px system-ui,sans-serif';
      ctx.fillStyle   = 'rgba(238,238,238,0.96)';
      ctx.globalAlpha = 1;
      ctx.fillText(t.length > 16 ? t.slice(0, 14) + '…' : t, xCenter, H - PAD.b + 12);
      // small colored underline stripe below topic label
      ctx.fillStyle   = TOPIC_COLOR[t] ?? '#999';
      ctx.globalAlpha = 0.75;
      ctx.fillRect(xLeft + 2, H - PAD.b + 14, K * colW - 4, 2);
      // per-word rotated labels — lighter gray, slightly larger
      const stems = (WS.topicWords[t] ?? []).slice(0, K).map(([si]) => si);
      ctx.fillStyle   = 'rgba(205,205,205,0.92)';
      ctx.globalAlpha = 1;
      stems.forEach((si, wi) => {
        const xLabel = PAD.l + (slotStart + wi + 0.5) * colW;
        ctx.save();
        ctx.translate(xLabel, H - PAD.b + 18);
        ctx.rotate(-Math.PI * 0.42);
        ctx.textAlign = 'right';
        ctx.font = '8.5px system-ui,sans-serif';
        ctx.fillText(WS.stems[si] ?? '', 0, 0);
        ctx.restore();
      });
      slotStart += K + 1;
    });
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

export default WordParticleVis;
