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
const OLD_TO_NEW: Record<string, string> = {
  'Hypertext & Links':      'Hypertext & Links',
  'Computer Graphics':      'Computer Graphics & AR/VR',
  '3D Navigation & Camera': 'Storytelling, Presentation & Cameras',
  'Robotics & Sensing':     'Robotics & Sensing',
  'Online Communities':     'Online Communities',
  'Photo & Image Tools':    'Photo/Video Tools',
  'Video & Rich Media':     'Photo/Video Tools',
  'Web Search & Content':   'Web Search & Content',
  'Visualization':          'Visualization',
  'Visual Analytics':       'Visual Analytics',
  'Data Storytelling':      'Storytelling, Presentation & Cameras',
  'Human-in-the-Loop ML':  'UI/Visualization for ML',
  'AI Assistance':          'AI Assistance',
  'Notebooks & Code':       'Notebooks & Code',
  'Immersive & AR/VR':      'Computer Graphics & AR/VR',
  'Interaction Design':     'Interaction Design',
};

// ─── subject ordering + coloring ─────────────────────────────────────────────
// Each subject is assigned to its closest topic for color and group ordering.
// Subjects within a group are listed together; groups follow TOPIC_ORDER.
const SUBJECT_META: { subject: string; topic: string }[] = [
  // Robotics & Sensing
  { subject: 'Robotics',          topic: 'Robotics & Sensing' },
  { subject: 'Touch',             topic: 'Robotics & Sensing' },
  // Hypertext & Links
  { subject: 'Hypertext',         topic: 'Hypertext & Links' },
  // Computer Graphics & AR/VR
  { subject: 'Graphics',          topic: 'Computer Graphics & AR/VR' },
  { subject: 'Animation',         topic: 'Computer Graphics & AR/VR' },
  { subject: 'Parallel Computing',topic: 'Computer Graphics & AR/VR' },
  // Storytelling, Presentation & Cameras
  { subject: 'Camera',            topic: 'Storytelling, Presentation & Cameras' },
  { subject: 'Presentation',      topic: 'Storytelling, Presentation & Cameras' },
  { subject: 'Games',             topic: 'Storytelling, Presentation & Cameras' },
  // Online Communities
  { subject: 'Social',            topic: 'Online Communities' },
  // Visualization
  { subject: 'Visualization',     topic: 'Visualization' },
  { subject: 'Data',              topic: 'Visualization' },
  { subject: 'Temporal',          topic: 'Visualization' },
  { subject: 'Big Data',          topic: 'Visual Analytics' },
  { subject: 'Sequences',         topic: 'Visual Analytics' },
  // Photo/Video Tools
  { subject: 'Photos',            topic: 'Photo/Video Tools' },
  { subject: 'Media',             topic: 'Photo/Video Tools' },
  { subject: 'TV',                topic: 'Photo/Video Tools' },
  { subject: 'Movies',            topic: 'Photo/Video Tools' },
  // Web Search & Content
  { subject: 'Web',               topic: 'Web Search & Content' },
  { subject: 'Search',            topic: 'Web Search & Content' },
  // Notebooks & Code
  { subject: 'Programming',       topic: 'Notebooks & Code' },
  // Interaction Design
  { subject: 'Design',            topic: 'Interaction Design' },
  { subject: 'Creativity',        topic: 'Interaction Design' },
  // UI/Visualization for ML
  { subject: 'Machine Learning',  topic: 'UI/Visualization for ML' },
  // AI Assistance
  { subject: 'AI',                topic: 'AI Assistance' },
];

const SUBJECT_ORDER  = SUBJECT_META.map(m => m.subject);
const SUBJECT_COLORS = Object.fromEntries(
  SUBJECT_META.map(m => [m.subject, TOPIC_COLOR[m.topic] ?? '#888'])
);

// ─── constants ───────────────────────────────────────────────────────────────
const MAX_R   = 8;    // radius at 100 % topic weight (area ∝ weight via √)
const MIN_W   = 0.04; // topic weights below this are not drawn
const DOT_R   = 5;    // fixed radius for subject-mode marks
const MARGIN  = { x: 270, y: 170 } as const;
const Y_GAP   = 22;   // px between rows

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

  const [visMode,    setVisMode]    = useState<'topics' | 'subjects'>('topics');
  const [hovProject, setHovProject] = useState('');
  const [hovRow,     setHovRow]     = useState('');   // topic or subject name
  const [hlProjects, setHlProjects] = useState<string[]>([]);
  const [hlRows,     setHlRows]     = useState<string[]>([]);

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

  // ── active rows for current mode ───────────────────────────────────────────
  const activeTopics = useMemo(() => {
    const present = new Set(sortedItems.map(d => resolveTopic(d.caption)));
    return TOPIC_ORDER.filter(t => present.has(t));
  }, [sortedItems]);

  const activeSubjects = useMemo(() => {
    const present = new Set(sortedItems.flatMap(d => d.tags?.subject ?? []));
    return SUBJECT_ORDER.filter(s => present.has(s));
  }, [sortedItems]);

  const rows   = visMode === 'topics' ? activeTopics : activeSubjects;
  const rowColor = (r: string) =>
    visMode === 'topics' ? (TOPIC_COLOR[r] ?? '#888') : (SUBJECT_COLORS[r] ?? '#888');

  const N  = sortedItems.length;
  const NR = rows.length;

  // ── x spacing ──────────────────────────────────────────────────────────────
  const xspacing = (fitMode && containerWidth > 0)
    ? Math.max(4, (containerWidth - MARGIN.x - 20) / N)
    : 16;

  const xOf = (i: number)  => MARGIN.x + (i + 0.5) * xspacing;
  const yOf = (ri: number) => MARGIN.y + ri * Y_GAP;

  const svgW = Math.ceil(MARGIN.x + xspacing * N + 20);
  const svgH = Math.ceil(MARGIN.y + Y_GAP * NR + 10);

  // ── highlight helpers ──────────────────────────────────────────────────────
  const isHlProject = (cap: string) =>
    currentProjects.includes(cap) || hlProjects.includes(cap) || hovProject === cap;
  const isHlRow = (r: string) =>
    hlRows.includes(r) || hovRow === r ||
    (highlight.length > 1 && highlight[0] === 'topic' && highlight[1] === r);

  const hasBrush = hovProject !== '' || hovRow !== '' || hlProjects.length > 0;

  const onEnterRow = (r: string) => {
    if (visMode === 'topics') {
      setHlProjects(
        sortedItems
          .filter(d => (paperWeights.get(d.caption)?.[r] ?? 0) >= MIN_W)
          .map(d => d.caption)
      );
    } else {
      setHlProjects(
        sortedItems
          .filter(d => (d.tags?.subject ?? []).includes(r))
          .map(d => d.caption)
      );
    }
    setHovRow(r);
  };
  const onLeaveRow = () => { setHlProjects([]); setHovRow(''); };

  const onEnterProject = (cap: string) => {
    if (visMode === 'topics') {
      const wts = paperWeights.get(cap) ?? {};
      setHlRows(Object.entries(wts).filter(([, w]) => w >= MIN_W).map(([t]) => t));
    } else {
      setHlRows(sortedItems.find(d => d.caption === cap)?.tags?.subject ?? []);
    }
    setHovProject(cap);
  };
  const onLeaveProject = () => { setHlRows([]); setHovProject(''); };

  // ── topic group boundaries (dashed dividers on X-axis) ────────────────────
  const groupStarts = useMemo(() => {
    const starts: number[] = [];
    let last = '';
    sortedItems.forEach((d, i) => {
      const t = resolveTopic(d.caption);
      if (t !== last) { starts.push(i); last = t; }
    });
    return starts;
  }, [sortedItems]);

  // ── SVG elements ───────────────────────────────────────────────────────────

  // Row band backgrounds
  const rowBands = rows.map((r, ri) => (
    <rect
      key={`band${ri}`}
      x={MARGIN.x}
      y={yOf(ri) - Y_GAP / 2}
      width={xOf(N - 1) - MARGIN.x}
      height={Y_GAP}
      fill={rowColor(r)}
      fillOpacity={0.07}
    />
  ));

  // Row labels (Y-axis)
  const rowLabels = rows.map((r, ri) => {
    const col = rowColor(r);
    const hl  = isHlRow(r);
    return (
      <text
        key={`rl${ri}`}
        x={MARGIN.x - 8}
        y={yOf(ri)}
        dy="0.35em"
        textAnchor="end"
        style={{ fill: col, opacity: hl ? 1 : 0.72, fontWeight: hl ? 700 : 400, fontSize: 11, cursor: 'default' }}
        onMouseEnter={() => onEnterRow(r)}
        onMouseLeave={onLeaveRow}
      >{r}</text>
    );
  });

  // Horizontal grid lines
  const horLines = rows.map((r, ri) => (
    <line
      key={`hl${ri}`}
      x1={MARGIN.x} x2={xOf(N - 1)}
      y1={yOf(ri)}  y2={yOf(ri)}
      stroke={rowColor(r)}
      strokeOpacity={isHlRow(r) ? 0.35 : 0.12}
      strokeWidth={isHlRow(r) ? 1 : 0.5}
    />
  ));

  // Vertical guide lines per paper
  const vertLines = sortedItems.map((d, i) => (
    <line
      key={`vl${i}`}
      x1={xOf(i)} x2={xOf(i)}
      y1={MARGIN.y - 6} y2={yOf(NR - 1) + Y_GAP / 2}
      stroke="#888"
      strokeOpacity={isHlProject(d.caption) ? 0.40 : 0.08}
      strokeWidth={isHlProject(d.caption) ? 1 : 0.5}
    />
  ));

  // Topic-group dividers
  const groupDividers = groupStarts.slice(1).map((gi, k) => {
    const xMid = (xOf(gi - 1) + xOf(gi)) / 2;
    return (
      <line
        key={`gd${k}`}
        x1={xMid} x2={xMid}
        y1={MARGIN.y - 6} y2={yOf(NR - 1) + Y_GAP / 2}
        stroke="#aaa" strokeOpacity={0.35} strokeWidth={1} strokeDasharray="3 3"
      />
    );
  });

  // Paper labels (colored by primary topic)
  const paperLabels = sortedItems.map((d, i) => {
    const col  = TOPIC_COLOR[resolveTopic(d.caption)] ?? '#aaa';
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

  // Marks
  const marks = _.flatten(sortedItems.map((d, i) => {
    const isHL = isHlProject(d.caption);
    if (visMode === 'topics') {
      // Sized circles by ML weight
      const weights = paperWeights.get(d.caption) ?? {};
      return rows.map((r, ri) => {
        const w = weights[r] ?? 0;
        if (w < MIN_W) return null;
        const radius = MAX_R * Math.sqrt(w);
        const col    = rowColor(r);
        const dimmed = hasBrush && !isHL && !isHlRow(r);
        return (
          <circle
            key={`m${i}r${ri}`}
            cx={xOf(i)} cy={yOf(ri)} r={radius}
            fill={col} fillOpacity={dimmed ? 0.10 : 0.80}
            stroke={isHL || isHlRow(r) ? col : 'none'}
            strokeWidth={isHL || isHlRow(r) ? 1 : 0}
            strokeOpacity={0.9}
          />
        );
      }).filter(Boolean);
    } else {
      // Fixed-size dots for subject membership
      const subjects: string[] = d.tags?.subject ?? [];
      return rows.map((r, ri) => {
        if (!subjects.includes(r)) return null;
        const col    = rowColor(r);
        const dimmed = hasBrush && !isHL && !isHlRow(r);
        return (
          <circle
            key={`m${i}r${ri}`}
            cx={xOf(i)} cy={yOf(ri)} r={DOT_R}
            fill={col} fillOpacity={dimmed ? 0.10 : 0.80}
            stroke={isHL || isHlRow(r) ? col : 'none'}
            strokeWidth={isHL || isHlRow(r) ? 1 : 0}
            strokeOpacity={0.9}
          />
        );
      }).filter(Boolean);
    }
  }));

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
        {(['topics', 'subjects'] as const).map(m => (
          <button
            key={m}
            className={`view-btn${visMode === m ? ' active' : ''}`}
            onClick={() => { setVisMode(m); setHovRow(''); setHovProject(''); setHlProjects([]); setHlRows([]); }}
          >
            {m === 'topics' ? '⊛ Topics' : '# Subjects'}
          </button>
        ))}
      </div>

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
        {rowLabels}
        {paperLabels}
        {marks}
      </svg>
    </div>
  );
}

export default KeywordVis;
