import * as d3 from 'd3';
import _ from 'lodash';
import { useState, useMemo, useRef } from 'react';
import topicDataRaw from '../data/topicData.json';

// ─── types ────────────────────────────────────────────────────────────────────

interface PaperEntry {
  year: number;
  pages: number;
  weights: Record<string, number>;
}

interface TopicFile {
  topics: string[];
  papers: Record<string, PaperEntry>;
}

const topicData = topicDataRaw as TopicFile;

// ─── colour palette ───────────────────────────────────────────────────────────
const PALETTE = [
  '#4e79a7','#f28e2b','#e15759','#76b7b2','#59a14f',
  '#edc948','#b07aa1','#ff9da7','#9c755f','#bab0ac',
  '#d37295','#fabfd2',
];

// ─── gaussian smoothing ───────────────────────────────────────────────────────
function gaussianSmooth(
  yearValues: Record<number, number>,
  allYears: number[],
  bw: number
): Record<number, number> {
  const out: Record<number, number> = {};
  for (const yr of allYears) {
    let num = 0, den = 0;
    for (const y2 of allYears) {
      const w = Math.exp(-0.5 * ((yr - y2) / bw) ** 2);
      num += w * (yearValues[y2] ?? 0);
      den += w;
    }
    out[yr] = den > 0 ? num / den : 0;
  }
  return out;
}

// ─── weighting scale ──────────────────────────────────────────────────────────
type WeightMode = 'none' | 'absolute' | 'log';

function pageScale(pages: number, mode: WeightMode): number {
  if (mode === 'none')     return 1;
  if (mode === 'absolute') return pages || 1;
  return Math.log1p(pages || 1);
}

// ─── props ────────────────────────────────────────────────────────────────────

interface StreamgraphVisProps {
  items: any[];
  handleClick?: (val: any) => void;
  containerWidth?: number;
  fitMode?: boolean;
}

const WEIGHT_THRESHOLD = 0.15; // min topic weight to include a paper in the list

// ─── component ────────────────────────────────────────────────────────────────

export function StreamgraphVis({
  items,
  handleClick,
  containerWidth = 800,
  fitMode = false,
}: StreamgraphVisProps) {
  const [hoveredTopic,  setHoveredTopic]  = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [smoothing,     setSmoothing]     = useState<number>(0.5);
  const [weightMode,    setWeightMode]    = useState<WeightMode>('log');
  const [tooltip, setTooltip] = useState<{
    x: number; y: number; topic: string; value: number; count: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W  = containerWidth;
  const H  = fitMode ? Math.round(window.innerHeight * 0.65) : 380;
  const mx = { top: 8, right: 16, bottom: 36, left: 16 };

  const topics = topicData.topics ?? [];

  // ── build streamgraph ────────────────────────────────────────────────────────

  const { layers, xScale, yScale, colorScale, yearTicks, yearRange, rawYearTopic } = useMemo(() => {
    const empty = {
      layers: [] as d3.Series<any, any>[],
      xScale: d3.scaleLinear(), yScale: d3.scaleLinear(),
      colorScale: d3.scaleOrdinal<string>(),
      yearTicks: [] as number[], yearRange: [] as number[],
      rawYearTopic: {} as Record<number, Record<string, number>>,
    };
    if (!topics.length) return empty;

    const captionSet = new Set(items.map(d => d.caption));
    const active = Object.entries(topicData.papers).filter(
      ([cap, p]) => captionSet.has(cap) && p.year && p.weights
    );
    if (!active.length) return empty;

    const years = active.map(([, p]) => p.year);
    const [yMin, yMax] = d3.extent(years) as [number, number];
    const yearRange = d3.range(yMin, yMax + 1);

    const raw: Record<number, Record<string, number>> = {};
    yearRange.forEach(y => { raw[y] = {}; topics.forEach(t => { raw[y][t] = 0; }); });

    for (const [, paper] of active) {
      const scale = pageScale(paper.pages, weightMode);
      const row = raw[paper.year];
      if (!row) continue;
      for (const t of topics) {
        row[t] += (paper.weights[t] ?? 0) * scale;
      }
    }

    const smoothed: Record<number, Record<string, number>> = {};
    yearRange.forEach(y => { smoothed[y] = {}; });
    for (const t of topics) {
      const series: Record<number, number> = {};
      yearRange.forEach(y => { series[y] = raw[y][t]; });
      const s = gaussianSmooth(series, yearRange, smoothing);
      yearRange.forEach(y => { smoothed[y][t] = s[y]; });
    }

    const stackData = yearRange.map(y => ({ year: y, ...smoothed[y] }));
    const stack = d3.stack<any>()
      .keys(topics).offset(d3.stackOffsetWiggle).order(d3.stackOrderInsideOut);
    const layers = stack(stackData);

    const xScale = d3.scaleLinear().domain([yMin, yMax]).range([mx.left, W - mx.right]);
    const yAll = layers.flatMap(l => l.flatMap(d => [d[0], d[1]]));
    const yScale = d3.scaleLinear()
      .domain([Math.min(...yAll), Math.max(...yAll)])
      .range([H - mx.bottom, mx.top]);
    const colorScale = d3.scaleOrdinal<string>().domain(topics).range(PALETTE);
    const yearTicks = d3.range(Math.ceil(yMin / 2) * 2, yMax + 1, 2);

    return { layers, xScale, yScale, colorScale, yearTicks, yearRange, rawYearTopic: raw };
  }, [items, topics, W, H, smoothing, weightMode]);

  // ── area generator ────────────────────────────────────────────────────────────

  const area = useMemo(() =>
    d3.area<d3.SeriesPoint<any>>()
      .x(d => xScale(d.data.year))
      .y0(d => yScale(d[0])).y1(d => yScale(d[1]))
      .curve(d3.curveBasis),
    [xScale, yScale]
  );

  // ── stream labels ─────────────────────────────────────────────────────────────

  const streamLabels = useMemo(() =>
    layers.map((layer, i) => {
      const peakIdx = d3.maxIndex(layer, d => d[1] - d[0]);
      if (peakIdx < 0) return null;
      const d = layer[peakIdx];
      const bandH = yScale(d[0]) - yScale(d[1]);
      if (bandH < 13) return null;
      return {
        topic: topics[i],
        x: xScale(layer[peakIdx].data.year),
        y: (yScale(d[0]) + yScale(d[1])) / 2,
        fontSize: Math.min(11, Math.max(7, bandH * 0.42)),
      };
    }).filter(Boolean),
    [layers, topics, xScale, yScale]
  );

  // ── paper list for selected topic ─────────────────────────────────────────────

  const selectedPapers = useMemo(() => {
    if (!selectedTopic) return [];
    const captionSet = new Set(items.map(d => d.caption));
    return Object.entries(topicData.papers)
      .filter(([cap, p]) =>
        captionSet.has(cap) &&
        (p.weights?.[selectedTopic] ?? 0) >= WEIGHT_THRESHOLD
      )
      .map(([caption, p]) => ({
        caption,
        year: p.year,
        weight: p.weights[selectedTopic],
        pages: p.pages,
        item: items.find(d => d.caption === caption),
      }))
      .sort((a, b) => b.weight - a.weight || b.year - a.year);
  }, [selectedTopic, items]);

  // ── mouse handlers ────────────────────────────────────────────────────────────

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>, topic: string) => {
    setHoveredTopic(topic);
    const captionSet = new Set(items.map(d => d.caption));
    const count = Object.entries(topicData.papers).filter(
      ([cap, p]) => captionSet.has(cap) && (p.weights?.[topic] ?? 0) >= WEIGHT_THRESHOLD
    ).length;
    const totalRaw = yearRange.reduce((s, y) => s + (rawYearTopic[y]?.[topic] ?? 0), 0);
    const rect = svgRef.current?.getBoundingClientRect();
    setTooltip({
      x: e.clientX - (rect?.left ?? 0),
      y: e.clientY - (rect?.top ?? 0),
      topic, value: +totalRaw.toFixed(1), count,
    });
  };

  const handleStreamClick = (topic: string) => {
    setSelectedTopic(prev => prev === topic ? null : topic);
  };

  const isEmpty = !layers.length;
  const selColor = selectedTopic ? colorScale(selectedTopic) : '#888';

  return (
    <div style={{ userSelect: 'none' }}>

      {/* ── controls ── */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', fontSize: 12 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ opacity: 0.7 }}>Page weight:</span>
          <select
            value={weightMode}
            onChange={e => setWeightMode(e.target.value as WeightMode)}
            style={{ fontSize: 12, padding: '1px 4px', borderRadius: 4, cursor: 'pointer' }}
          >
            <option value="log">Log</option>
            <option value="absolute">Absolute</option>
            <option value="none">None</option>
          </select>
        </label>
        <span style={{ opacity: 0.4 }}>│</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          Smoothing:
          <input
            type="range" min={0} max={5} step={0.5} value={smoothing}
            onChange={e => setSmoothing(Number(e.target.value))}
            style={{ width: 80 }}
          />
          <span style={{ opacity: 0.6 }}>{smoothing}yr</span>
        </label>
      </div>

      {/* ── tooltip ── */}
      {tooltip && (
        <div style={{
          position: 'absolute',
          left: tooltip.x + 14, top: tooltip.y - 36,
          background: 'rgba(16,16,16,0.88)', color: '#fff',
          padding: '4px 10px', borderRadius: 5, fontSize: 12,
          pointerEvents: 'none', zIndex: 20, whiteSpace: 'nowrap',
        }}>
          <strong>{tooltip.topic}</strong>
          &ensp;{tooltip.count} paper{tooltip.count !== 1 ? 's' : ''}
        </div>
      )}

      {/* ── SVG ── */}
      <div style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          width={fitMode ? undefined : W}
          height={fitMode ? undefined : H}
          viewBox={`0 0 ${W} ${H}`}
          style={fitMode ? { width: '100%', height: '65vh', display: 'block' } : { display: 'block' }}
        >
          {isEmpty ? (
            <text x={W / 2} y={H / 2} textAnchor="middle" fill="#888" fontSize={13}>
              Run <tspan fontFamily="monospace">npm run extract-topics</tspan> to generate topic data
            </text>
          ) : (
            <>
              {layers.map((layer, i) => {
                const topic  = topics[i];
                const isHov  = hoveredTopic === topic;
                const isSel  = selectedTopic === topic;
                const dimmed = (hoveredTopic !== null && !isHov) || (selectedTopic !== null && !isSel);
                return (
                  <path
                    key={topic}
                    d={area(layer) ?? ''}
                    fill={colorScale(topic)}
                    fillOpacity={dimmed ? 0.15 : (isHov || isSel) ? 0.95 : 0.72}
                    stroke={(isHov || isSel) ? '#111' : 'none'}
                    strokeWidth={(isHov || isSel) ? 0.8 : 0}
                    cursor="pointer"
                    onMouseEnter={e => handleMouseEnter(e, topic)}
                    onMouseLeave={() => { setHoveredTopic(null); setTooltip(null); }}
                    onClick={() => handleStreamClick(topic)}
                  />
                );
              })}

              {yearTicks.map(yr => (
                <g key={yr} transform={`translate(${xScale(yr)},0)`}>
                  <line y1={mx.top} y2={H - mx.bottom} stroke="#fff" strokeOpacity={0.12} />
                  <text y={H - 5} textAnchor="middle" fontSize={10} fill="#777">{yr}</text>
                </g>
              ))}

              {streamLabels.map(lbl => lbl && (
                <text
                  key={`lbl-${lbl.topic}`}
                  x={lbl.x} y={lbl.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={lbl.fontSize} fill="#111"
                  fillOpacity={
                    (hoveredTopic && hoveredTopic !== lbl.topic) ||
                    (selectedTopic && selectedTopic !== lbl.topic) ? 0.1 : 0.82
                  }
                  fontWeight={500} pointerEvents="none"
                >{lbl.topic}</text>
              ))}
            </>
          )}
        </svg>
      </div>

      {/* ── selected topic paper list ── */}
      {selectedTopic && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{
              display: 'inline-block', width: 12, height: 12,
              borderRadius: 2, background: selColor, flexShrink: 0,
            }} />
            <strong style={{ fontSize: 13 }}>{selectedTopic}</strong>
            <span style={{ fontSize: 12, opacity: 0.6 }}>
              — {selectedPapers.length} paper{selectedPapers.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setSelectedTopic(null)}
              style={{
                marginLeft: 'auto', fontSize: 11, padding: '2px 8px',
                background: 'none', border: '1px solid #555', borderRadius: 4,
                cursor: 'pointer', opacity: 0.7,
              }}
            >✕ Clear</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {selectedPapers.map(({ caption, year, weight, item }) => (
              <div
                key={caption}
                onClick={() => item && handleClick?.(item)}
                title={`Weight: ${(weight * 100).toFixed(0)}%`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', borderRadius: 20,
                  border: `1px solid ${selColor}`,
                  cursor: item ? 'pointer' : 'default',
                  fontSize: 12, opacity: 0.9,
                  background: `${selColor}22`,
                }}
              >
                {/* weight bar */}
                <span style={{
                  display: 'inline-block',
                  width: `${Math.round(weight * 28)}px`,
                  height: 4, borderRadius: 2,
                  background: selColor, flexShrink: 0,
                }} />
                <span>{caption}</span>
                <span style={{ opacity: 0.5, fontSize: 10 }}>{year}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StreamgraphVis;
