import * as d3 from 'd3';
import _ from 'lodash';

interface TimelineVisProps {
  items: any[];
  currentProjects: string[];
  handleClick: (val: any) => void;
  width: number;
  height: number;
  containerWidth?: number;
  fitMode?: boolean;
}

export function TimelineVis({ items, currentProjects, handleClick, containerWidth, fitMode = false }: TimelineVisProps) {
  const primaryList = [
    'Hypertext', 'Robotics', 'Graphics', 'Camera', 'Social',
    'UI-Information', 'Media', 'Photos', 'Presentation',
    'Machine Learning', 'Visualization'
  ];

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  const marginx = 50;
  const marginy = 20;

  const b = _.countBy(items, d => d.primary);
  const foo = _.sortBy(_.uniq(_.flatten(_.map(items, d => d.primary))));
  const counts = _.map(primaryList, d => (typeof b[d] !== 'undefined' ? b[d] : 0));

  let sm = 0;
  const runsum: number[] = [];
  _.each(counts, d => { sm += d; runsum.push(sm); });

  const x_extent = d3.extent(items, d => d.tags.year) as [any, any];
  const length = items.length;
  const currentYear = new Date().getFullYear();
  const domainMax = Math.max(Math.floor(x_extent[1]) + 2, currentYear + 1);
  const domainMin = x_extent[0] - 2;
  const yearSpan  = domainMax - domainMin;

  // --- Square-ish layout ---
  // Derive height from item count, then choose pxPerYear so width ≈ height / 1.05
  // (layout is slightly taller than wide).  Enforce ≥ 30 px/year so year labels
  // never crowd.  The SVG may be wider than containerWidth; scroll mode handles
  // that and fit mode scales uniformly (xMinYMin meet) preserving the square shape.
  const rowHeight = 14;
  const svgHeight = Math.max(600, length * rowHeight + 2 * marginy);
  const pxPerYear = Math.max(30, (svgHeight / 1.05 - marginx) / yearSpan);
  const svgWidth  = Math.round(marginx + yearSpan * pxPerYear);

  const x_scale = d3.scaleLinear()
    .range([marginx, svgWidth])
    .domain([domainMin, domainMax]);

  const y_scale = d3.scaleLinear()
    .range([svgHeight - marginy, marginy])
    .domain([0, length]);

  const height_scale = d3.scaleLinear()
    .range([0, svgHeight - 2 * marginy])
    .domain([0, length]);

  const calcHighlight = (aproject: string) => {
    if (currentProjects.indexOf(aproject) >= 0) return 'titleClass highlighted';
    return 'titleClass normal';
  };

  // --- Per-year clip paths ---
  // Each paper label at year Y is clipped to [x(Y)+5 … x(Y+1)−5] so it never
  // overlaps the dot of the next year's papers.  An SVG <title> inside the text
  // element still exposes the full name as a native tooltip.
  const allYears = d3.range(Math.floor(x_extent[0]) - 2, domainMax + 2);
  const clipDefs = (
    <defs>
      {allYears.map(yr => {
        const x0 = x_scale(yr) + 5;
        const x1 = x_scale(yr + 1) - 5;
        return (
          <clipPath key={`cp${yr}`} id={`yr-clip-${yr}`}>
            <rect x={x0} y={0} width={Math.max(0, x1 - x0)} height={svgHeight} />
          </clipPath>
        );
      })}
    </defs>
  );

  const rects = primaryList.map((d, i) => (
    <rect
      key={`r${i}`}
      x={0}
      y={y_scale(runsum[i])}
      width={svgWidth}
      height={height_scale(counts[i])}
      fill={colorScale(String(_.indexOf(foo, d)))}
      fillOpacity={0.3}
    />
  ));

  const yearStart = Math.floor(x_extent[0] / 2) * 2;
  const years = d3.range(yearStart, currentYear + 4, 2);
  const legend = years.map((d, i) => (
    <text key={`title${i}`} x={x_scale(d)} y={svgHeight - 5} className="titleClass">{d}</text>
  ));

  const groupedList = _.groupBy(items, d => d.primary);

  function layoutGroup(groupArray: any[], groupName: string): React.ReactNode[] {
    const baseIndex = _.indexOf(primaryList, groupName);
    const baseCount = baseIndex === 0 ? 0 : runsum[baseIndex - 1];
    const sortedGroup = _.sortBy(groupArray, d => d.tags.year);

    // Render the group label once, centered in the band
    const groupLabelY = y_scale(baseCount + sortedGroup.length / 2) + 5;
    const groupLabel = (
      <text key={`gl-${groupName}`} x={3} y={groupLabelY} className="titleClass">
        {groupName}
      </text>
    );

    const paperNodes = _.map(sortedGroup, (d, i) => {
      const captionY = y_scale(baseCount + i) - 2;
      const yr       = Math.floor(d.tags.year);
      return (
        <g key={`g${groupName}${i}`} cursor="pointer" onClick={() => handleClick(d.caption)}>
          <text
            className={calcHighlight(d.caption)}
            x={x_scale(d.tags.year) + 5}
            y={captionY}
            clipPath={`url(#yr-clip-${yr})`}
          >
            <title>{d.caption}</title>
            {d.caption}
          </text>
          <circle
            className={calcHighlight(d.caption)}
            cx={x_scale(d.tags.year) - 2}
            cy={y_scale(baseCount + i) - 5}
            r={3}
          />
        </g>
      );
    });

    return [groupLabel, ...paperNodes];
  }

  const groups: React.ReactNode[] = [];
  _.each(groupedList, (d, index) => { groups.push(...layoutGroup(d, index)); });

  // Fit mode: scale the square-ish SVG uniformly to containerWidth.
  // Scroll mode: natural pixel size.
  const fitStyle: React.CSSProperties = fitMode
    ? { width: '100%', display: 'block' }
    : { display: 'block' };

  return (
    <svg
      cursor="pointer"
      width={fitMode ? undefined : svgWidth}
      height={fitMode ? undefined : svgHeight}
      viewBox={fitMode ? `0 0 ${svgWidth} ${svgHeight}` : undefined}
      preserveAspectRatio={fitMode ? 'xMinYMin meet' : undefined}
      className="chart"
      style={fitStyle}
    >
      {clipDefs}
      {rects}
      {groups}
      {legend}
    </svg>
  );
}

export default TimelineVis;
