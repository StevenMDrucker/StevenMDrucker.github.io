import { useState, useMemo } from 'react';
import _ from 'lodash';
import topicDataRaw from '../data/topicData.json';
import { TOPIC_COLOR, TOPIC_ORDER, resolveTopic } from '../data/topicColors';

// ─── types ───────────────────────────────────────────────────────────────────
interface TData {
  topics: string[];
  papers: Record<string, { year: number; weights: Record<string, number> }>;
}
const TD = topicDataRaw as TData;

// ─── aggregate old ML topic weights → new canonical topics ───────────────────
// Merged topics (Photo & Image Tools + Video & Rich Media → Photo/Video Tools,
// Computer Graphics + Immersive & AR/VR → Computer Graphics & AR/VR, etc.)
// sum their constituent old-topic weights.
const OLD_TO_NEW: Record<string, string> = {
  'Hypertext & Links':        'Hypertext & Links',
  'Computer Graphics':        'Computer Graphics & AR/VR',
  '3D Navigation & Camera':   'Storytelling, Presentation & Cameras',
  'Robotics & Sensing':       'Robotics & Sensing',
  'Online Communities':       'Online Communities',
  'Photo & Image Tools':      'Photo/Video Tools',
  'Video & Rich Media':       'Photo/Video Tools',
  'Web Search & Content':     'Web Search & Content',
  'Visualization':            'Visualization',
  'Visual Analytics':         'Visual Analytics',
  'Data Storytelling':        'Storytelling, Presentation & Cameras',
  'Human-in-the-Loop ML':    'UI/Visualization for ML',
  'AI Assistance':            'AI Assistance',
  'Notebooks & Code':         'Notebooks & Code',
  'Immersive & AR/VR':        'Computer Graphics & AR/VR',
  'Interaction Design':       'Interaction Design',
};

// ─── constants ───────────────────────────────────────────────────────────────
const MAX_R  = 8;    // radius at 100 % topic weight (area ∝ weight via √)
const MIN_W  = 0.04; // weights below this are not drawn
const MARGIN = { x: 270, y: 170 } as const; // space for labels
const Y_GAP  = 22;   // px between topic rows

// ─── props ───────────────────────────────────────────────────────────────────
interface KeywordVisProps {
  items: any[];
  currentProjects: string[];
  highlight: any[];
  handleClick: (val: any) => void;
  containerWidth?: number;
  fitMode?: boolean;
}

export function KeywordVis({
  items,
  currentProjects,
  highlight,
  handleClick,
  containerWidth = 800,
  fitMode = false,
}: KeywordVisProps) {

  const [hovProject,  setHovProject]  = useState('');
  const [hovTopic,    setHovTopic]    = useState('');
  const [hlProjects,  setHlProjects]  = useState<string[]>([]);
  const [hlTopics,    setHlTopics]    = useState<string[]>([]);

  // ── sort papers: primary topic order → year within topic ──────────────────
  const sortedItems = useMemo(() => [...items].sort((a, b) => {
    const ta = TOPIC_ORDER.indexOf(resolveTopic(a.caption));
    const tb = TOPIC_ORDER.indexOf(resolveTopic(b.caption));
    if (ta !== tb) return ta - tb;
    const ya = Number((a.tags.year?.[0] ?? a.tags.year) || 0);
    const yb = Number((b.tags.year?.[0] ?? b.tags.year) || 0);
    return ya - yb;
  }), [items]);

  // ── aggregate ML weights → new topic taxonomy, normalised per paper ────────
  const paperWeights = useMemo(() => {
    const map = new Map<string, Record<string, number>>();
    for (const item of sortedItems) {
      const raw = TD.papers[item.caption]?.weights ?? {};
      const agg: Record<string, number> = {};
      for (const [old, w] of Object.entries(raw)) {
        const nt = OLD_TO_NEW[old];
        if (nt) agg[nt] = (agg[nt] ?? 0) + (w as number);
      }
      const total = Object.values(agg).reduce((s, v) => s + v, 0) || 1;
      for (const t of Object.keys(agg)) agg[t] /= total;
      map.set(item.caption, agg);
    }
    return map;
  }, [sortedItems]);

  // ── active topics (only those present in current items) ───────────────────
  const activeTopics = useMemo(() => {
    const present = new Set(sortedItems.map(d => resolveTopic(d.caption)));
    return TOPIC_ORDER.filter(t => present.has(t));
  }, [sortedItems]);

  const N  = sortedItems.length;
  const NT = activeTopics.length;

  // ── x spacing ──────────────────────────────────────────────────────────────
  const xNatural = 16;
  const xspacing = (fitMode && containerWidth > 0)
    ? Math.max(4, (containerWidth - MARGIN.x - 20) / N)
    : xNatural;

  const xOf  = (i: number)  => MARGIN.x + (i + 0.5) * xspacing;
  const yOf  = (ti: number) => MARGIN.y + ti * Y_GAP;

  const svgW = Math.ceil(MARGIN.x + xspacing * N + 20);
  const svgH = Math.ceil(MARGIN.y + Y_GAP * NT + 10);

  // ── highlight helpers ──────────────────────────────────────────────────────
  const isHlProject = (cap: string) =>
    currentProjects.includes(cap) || hlProjects.includes(cap) || hovProject === cap;
  const isHlTopic = (t: string) =>
    hlTopics.includes(t) || hovTopic === t ||
    (highlight.length > 1 && highlight[0] === 'topic' && highlight[1] === t);

  const onEnterTopic = (t: string) => {
    setHlProjects(
      sortedItems
        .filter(d => (paperWeights.get(d.caption)?.[t] ?? 0) >= MIN_W)
        .map(d => d.caption)
    );
    setHovTopic(t);
  };
  const onLeaveTopic = () => { setHlProjects([]); setHovTopic(''); };

  const onEnterProject = (cap: string) => {
    const wts = paperWeights.get(cap) ?? {};
    setHlTopics(Object.entries(wts).filter(([, w]) => w >= MIN_W).map(([t]) => t));
    setHovProject(cap);
  };
  const onLeaveProject = () => { setHlTopics([]); setHovProject(''); };

  const hasBrush = hovProject !== '' || hovTopic !== '' || hlProjects.length > 0;

  // ── topic group boundaries (X-axis dividers) ───────────────────────────────
  // Find first paper index in each topic group for divider placement
  const groupStarts = useMemo(() => {
    const starts: number[] = [];
    let lastTopic = '';
    sortedItems.forEach((d, i) => {
      const t = resolveTopic(d.caption);
      if (t !== lastTopic) { starts.push(i); lastTopic = t; }
    });
    return starts;
  }, [sortedItems]);

  // ── SVG elements ───────────────────────────────────────────────────────────

  // Horizontal row bands (faint tinted background per topic)
  const rowBands = activeTopics.map((t, ti) => (
    <rect
      key={`band${ti}`}
      x={MARGIN.x}
      y={yOf(ti) - Y_GAP / 2}
      width={xOf(N - 1) - MARGIN.x}
      height={Y_GAP}
      fill={TOPIC_COLOR[t] ?? '#888'}
      fillOpacity={0.07}
    />
  ));

  // Topic labels (Y-axis)
  const topicLabels = activeTopics.map((t, ti) => (
    <text
      key={`tl${ti}`}
      x={MARGIN.x - 8}
      y={yOf(ti)}
      dy="0.35em"
      textAnchor="end"
      className={`keyword ${isHlTopic(t) ? 'highlighted' : 'normal'}`}
      fill={TOPIC_COLOR[t] ?? '#aaa'}
      fontWeight={isHlTopic(t) ? 700 : 400}
      fontSize={11}
      onMouseEnter={() => onEnterTopic(t)}
      onMouseLeave={onLeaveTopic}
      style={{ cursor: 'default' }}
    >{t}</text>
  ));

  // Horizontal grid lines
  const horLines = activeTopics.map((t, ti) => (
    <line
      key={`hl${ti}`}
      x1={MARGIN.x}
      x2={xOf(N - 1)}
      y1={yOf(ti)}
      y2={yOf(ti)}
      stroke={TOPIC_COLOR[t] ?? '#888'}
      strokeOpacity={isHlTopic(t) ? 0.35 : 0.12}
      strokeWidth={isHlTopic(t) ? 1 : 0.5}
    />
  ));

  // Vertical guide lines per paper
  const vertLines = sortedItems.map((d, i) => (
    <line
      key={`vl${i}`}
      x1={xOf(i)} x2={xOf(i)}
      y1={MARGIN.y - 6} y2={yOf(NT - 1) + Y_GAP / 2}
      stroke="#888"
      strokeOpacity={isHlProject(d.caption) ? 0.40 : 0.08}
      strokeWidth={isHlProject(d.caption) ? 1 : 0.5}
    />
  ));

  // Topic-group dividers on X-axis (skip index 0)
  const groupDividers = groupStarts.slice(1).map((gi, k) => {
    const xMid = (xOf(gi - 1) + xOf(gi)) / 2;
    return (
      <line
        key={`gd${k}`}
        x1={xMid} x2={xMid}
        y1={MARGIN.y - 6} y2={yOf(NT - 1) + Y_GAP / 2}
        stroke="#aaa"
        strokeOpacity={0.35}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
    );
  });

  // Paper labels (rotated at top, colored by primary topic)
  const paperLabels = sortedItems.map((d, i) => {
    const pt = resolveTopic(d.caption);
    const col = TOPIC_COLOR[pt] ?? '#aaa';
    const isHL = isHlProject(d.caption);
    return (
      <g key={`pl${i}`} transform={`translate(${xOf(i)}, ${MARGIN.y - 8})`}>
        <text
          onClick={() => handleClick(d.caption)}
          dy="0.3em"
          transform="rotate(-90)"
          textAnchor="start"
          fontSize={10}
          fill={isHL ? col : hasBrush ? '#555' : col}
          fillOpacity={hasBrush ? (isHL ? 1 : 0.25) : 0.75}
          fontWeight={isHL ? 600 : 400}
          onMouseEnter={() => onEnterProject(d.caption)}
          onMouseLeave={onLeaveProject}
          style={{ cursor: 'pointer' }}
        >{d.caption}</text>
      </g>
    );
  });

  // Marks: circle at each (paper, topic) cell, sized by weight
  const marks = _.flatten(sortedItems.map((d, i) => {
    const weights = paperWeights.get(d.caption) ?? {};
    const isHL = isHlProject(d.caption);
    return activeTopics.map((t, ti) => {
      const w = weights[t] ?? 0;
      if (w < MIN_W) return null;
      const r = MAX_R * Math.sqrt(w);
      const col = TOPIC_COLOR[t] ?? '#888';
      const dimmed = hasBrush && !isHL && !isHlTopic(t);
      return (
        <circle
          key={`m${i}t${ti}`}
          cx={xOf(i)}
          cy={yOf(ti)}
          r={r}
          fill={col}
          fillOpacity={dimmed ? 0.10 : 0.80}
          stroke={isHL || isHlTopic(t) ? col : 'none'}
          strokeWidth={isHL || isHlTopic(t) ? 1 : 0}
          strokeOpacity={0.9}
        />
      );
    }).filter(Boolean);
  }));

  return (
    <svg
      cursor="pointer"
      width={svgW}
      height={svgH}
      className="chart"
      style={{ display: 'block' }}
    >
      {rowBands}
      {horLines}
      {vertLines}
      {groupDividers}
      {topicLabels}
      {paperLabels}
      {marks}
    </svg>
  );
}

export default KeywordVis;
