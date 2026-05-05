import * as d3 from 'd3';
import _ from 'lodash';
import topicDataRaw from '../data/topicData.json';
import { TOPIC_COLOR, TOPIC_ORDER } from '../data/topicColors';

interface TData {
  topics: string[];
  papers: Record<string, { year: number; weights: Record<string, number> }>;
}
const TD = topicDataRaw as TData;

/** Derive primary ML topic for a paper caption (matches WordParticleVis logic). */
function primaryTopic(caption: string): string {
  const weights = TD.papers[caption]?.weights ?? {};
  let best = 'Visualization';
  let maxW = -Infinity;
  Object.entries(weights).forEach(([t, w]) => {
    if ((w as number) > maxW) { maxW = w as number; best = t; }
  });
  return best;
}

interface TimelineVisProps {
  items: any[];
  currentProjects: string[];
  handleClick: (val: any) => void;
  width: number;
  height: number;
  containerWidth?: number;
  fitMode?: boolean;
}

export function TimelineVis({ items, currentProjects, handleClick, width, containerWidth, fitMode = false }: TimelineVisProps) {

  const marginx = 50;
  const marginy = 20;

  // Assign each item its ML-derived primary topic
  const itemsWithTopic = items.map(d => ({ ...d, mlTopic: primaryTopic(d.caption) }));

  // Active topics in canonical order (only those present in the current items)
  const presentTopics = new Set(itemsWithTopic.map(d => d.mlTopic));
  const activeTopics = TOPIC_ORDER.filter(t => presentTopics.has(t));

  // Running sum of item counts per topic (for Y layout)
  const counts = activeTopics.map(t => itemsWithTopic.filter(d => d.mlTopic === t).length);
  let sm = 0;
  const runsum: number[] = [];
  counts.forEach(c => { sm += c; runsum.push(sm); });

  const x_extent = d3.extent(items, d => d.tags.year) as [any, any];
  const length = items.length;
  const height = Math.max(800, length * 14 + 2 * marginy);
  const currentYear = new Date().getFullYear();
  const domainMax = Math.max(Math.floor(x_extent[1]) + 2, currentYear + 1);

  const x_scale = d3.scaleLinear()
    .range([marginx, width])
    .domain([x_extent[0] - 2, domainMax]);

  const y_scale = d3.scaleLinear()
    .range([height - marginy, marginy])
    .domain([0, length]);

  const height_scale = d3.scaleLinear()
    .range([0, height - 2 * marginy])
    .domain([0, length]);

  // In fit mode the SVG is compressed vertically — correctionY keeps text readable.
  const correctionY = fitMode ? height / (0.8 * window.innerHeight) : 1;
  const tTx = (py: number) =>
    fitMode ? `translate(0,${py}) scale(1,${correctionY}) translate(0,${-py})` : undefined;

  const calcHighlight = (aproject: string) => {
    if (currentProjects.indexOf(aproject) >= 0) return 'titleClass highlighted';
    return 'titleClass normal';
  };

  // Coloured background band per topic group
  const rects = activeTopics.map((t, i) => (
    <rect
      key={`r${i}`}
      x={0}
      y={y_scale(runsum[i])}
      width={width}
      height={height_scale(counts[i])}
      fill={TOPIC_COLOR[t] ?? '#888'}
      fillOpacity={0.25}
    />
  ));

  const yearStart = Math.floor(x_extent[0] / 2) * 2;
  const years = d3.range(yearStart, currentYear + 4, 2);
  const legend = years.map((d, i) => (
    <text key={`title${i}`} x={x_scale(d)} y={height - 5} transform={tTx(height - 5)} className="titleClass">{d}</text>
  ));

  const groupedList = _.groupBy(itemsWithTopic, d => d.mlTopic);

  function layoutGroup(groupArray: any[], groupName: string): React.ReactNode[] {
    const baseIndex = activeTopics.indexOf(groupName);
    if (baseIndex < 0) return [];
    const baseCount = baseIndex === 0 ? 0 : runsum[baseIndex - 1];
    const sortedGroup = _.sortBy(groupArray, d => d.tags.year);

    return _.map(sortedGroup, (d, i) => {
      const captionY = y_scale(baseCount + i) - 2;
      const groupLabelY = y_scale(baseCount + sortedGroup.length / 2) + 5;
      return (
        <g key={`g${groupName}${i}`}>
          <text
            className={calcHighlight(d.caption)}
            onClick={() => handleClick(d.caption)}
            x={x_scale(d.tags.year) + 5}
            y={captionY}
            transform={tTx(captionY)}
            cursor="pointer"
          >{d.caption}</text>
          <circle
            className={calcHighlight(d.caption)}
            onClick={() => handleClick(d.caption)}
            cx={x_scale(d.tags.year) - 2}
            cy={y_scale(baseCount + i) - 5}
            r={3}
            fill={TOPIC_COLOR[groupName] ?? '#888'}
            fillOpacity={0.85}
          />
          <text
            x={3}
            y={groupLabelY}
            transform={tTx(groupLabelY)}
            className="titleClass"
            fill={TOPIC_COLOR[groupName] ?? '#888'}
            fillOpacity={0.7}
          >{groupName}</text>
        </g>
      );
    });
  }

  const groups: React.ReactNode[] = [];
  _.each(groupedList, (d, index) => { groups.push(...layoutGroup(d, index)); });

  const fitStyle = fitMode
    ? { width: '100%', height: '80vh', display: 'block' } as React.CSSProperties
    : { display: 'block' } as React.CSSProperties;

  return (
    <svg
      cursor="pointer"
      width={fitMode ? undefined : width}
      height={fitMode ? undefined : height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={fitMode ? 'none' : undefined}
      className="chart"
      style={fitStyle}
    >
      {rects}
      {groups}
      {legend}
    </svg>
  );
}

export default TimelineVis;
