import { useState } from 'react';
import * as D3 from 'd3';
import _ from 'lodash';

interface KeywordVisProps {
  items: any[];
  currentProjects: string[];
  highlight: any[];
  handleClick: (val: any) => void;
  containerWidth?: number;
  fitMode?: boolean;
}

export function KeywordVis({ items, currentProjects, highlight, handleClick, containerWidth = 800, fitMode = false }: KeywordVisProps) {
  const [highlightProjects, setHighlightProjects] = useState<string[]>([]);
  const [highlightSubjects, setHighlightSubjects] = useState<string[]>([]);
  const [currentProject, setCurrentProject] = useState('');
  const [currentSubject, setCurrentSubject] = useState('');

  const keywords = _.orderBy(_.uniq(_.flatten(_.map(items, d => d.tags['subject']))));
  const projects = _.map(items, d => d.caption);
  const N = projects.length;

  const marginx = 150;
  const marginy = 170;
  const yspacing = 18;

  // --- Dynamic x-spacing ---
  // In fit mode: shrink column spacing so the SVG exactly fills containerWidth with no
  //   horizontal scroll.  Circle radius scales with spacing; floor at 1 px so dots remain
  //   visible.  No viewBox tricks – we just recompute the natural SVG width.
  // In non-fit (scroll) mode: use the natural 16 px spacing.  If the total width exceeds
  //   the container, the parent's vis-scroll class handles scrolling.
  const naturalXSpacing = 16;
  const xspacing = (fitMode && containerWidth > 0)
    ? Math.max(4, (containerWidth - marginx - 20) / N)
    : naturalXSpacing;
  const circleRadius = fitMode ? Math.max(1, Math.min(2, xspacing / 4)) : 2;

  const xmaxpos  = marginx + xspacing * N;
  const ymaxpos  = marginy + yspacing * keywords.length;
  const svgWidth  = Math.ceil(xmaxpos + 20);
  const svgHeight = Math.ceil(ymaxpos + 10);

  const y = D3.scaleLinear().domain([0, keywords.length]).range([marginy, ymaxpos]);
  const x = D3.scaleLinear().domain([0, N]).range([marginx, xmaxpos]);

  const calcHighlight = (aproject: string) => {
    if (currentProjects.indexOf(aproject) >= 0 || highlightProjects.indexOf(aproject) >= 0) {
      return 'highlighted';
    }
    if (currentProject === aproject) return 'highlighted';
    return 'normal';
  };

  const calcHighlightSubject = (aSubject: string) => {
    if (highlightSubjects.indexOf(aSubject) >= 0) return 'highlighted';
    if (currentSubject === aSubject) return 'highlighted';
    if (highlight.length > 1 && highlight[0] === 'subject' && highlight[1] === aSubject) return 'highlighted';
    return 'normal';
  };

  const doHighlightProjects = (aKey: string) => {
    const toHighlight = _.filter(items, anItem => anItem.tags.subject.indexOf(aKey) >= 0);
    setHighlightProjects(_.map(toHighlight, e => e.caption));
    setCurrentSubject(aKey);
  };

  const clearHighlightProjects = () => {
    setHighlightProjects([]);
    setCurrentSubject('');
  };

  const doHighlightSubjects = (aProject: string) => {
    const theProject = _.filter(items, anItem => anItem.caption === aProject);
    if (theProject.length > 0) setHighlightSubjects(theProject[0].tags.subject);
    setCurrentProject(aProject);
  };

  const clearHighlightSubjects = () => {
    setHighlightSubjects([]);
    setCurrentProject('');
  };

  const keywordlist = keywords.map((akey, i) => (
    <g key={`k${i}`} transform={`translate(${marginx - 5},${y(i)})`}>
      <text
        dy="-.3em"
        className={`keyword ${calcHighlightSubject(akey)}`}
        onMouseEnter={() => doHighlightProjects(akey)}
        onMouseLeave={() => clearHighlightProjects()}
      >{akey}</text>
    </g>
  ));

  const projectlist = projects.map((akey, i) => (
    <g key={`p${i}`} transform={`translate(${x(i)},150)`}>
      <text
        onClick={() => handleClick(akey)}
        dy=".3em"
        transform="rotate(-90)"
        className={`project ${calcHighlight(akey)}`}
        onMouseEnter={() => doHighlightSubjects(akey)}
        onMouseLeave={() => clearHighlightSubjects()}
      >{akey}</text>
    </g>
  ));

  const vertlines = projects.map((akey, i) => (
    <line key={`l${i}`} x1={x(i)} x2={x(i)} y1={marginy - 7} y2={y(keywords.length - 1) - 7} className={`vertline ${calcHighlight(akey)}`} />
  ));

  const horlines = keywords.map((akey, i) => (
    <line key={`hl${i}`} x1={marginx} x2={x(N - 1)} y1={y(i) - 7} y2={y(i) - 7} className={`horline ${calcHighlightSubject(akey)}`} />
  ));

  const circles = _.flatten(items.map((anItem, i) =>
    anItem.tags.subject.map((sItem: string, j: number) => {
      const vertPosition = y(keywords.indexOf(sItem)) - 7;
      const horPosition  = x(i);
      return <circle key={`c${i}d${j}`} cx={horPosition} cy={vertPosition} r={circleRadius} fill="red" />;
    })
  ));

  return (
    <svg
      cursor="pointer"
      width={svgWidth}
      height={svgHeight}
      className="chart"
      style={{ display: 'block' }}
    >
      {keywordlist}
      {projectlist}
      {vertlines}
      {horlines}
      {circles}
    </svg>
  );
}

export default KeywordVis;
