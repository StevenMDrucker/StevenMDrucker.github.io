import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import _ from 'lodash';
import { Index } from './Index';
import { FacetPanel } from './FacetPanel';
import { MyPopup } from './MyPopup';
import { KeywordVis } from './KeywordVis';
import { TimelineVis } from './TimelineVis';
import { StreamgraphVis } from './StreamgraphVis';
import { WordParticleVis } from './WordParticleVis';

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return width;
}

function calcResults(
  globalData: any[],
  filterSpec: Record<string, string[]>,
  orderBy: string,
  reverse: boolean,
  searchTerm: string
): any[] {
  const filtered = _.reduce(filterSpec, (result, value, key) => {
    return _.filter(result, o => !_.isEmpty(_.intersection(value, o.tags[key])));
  }, globalData);

  const sorted = reverse
    ? _.reverse(_.sortBy(filtered, a => a.tags[orderBy]))
    : _.sortBy(filtered, a => a.tags[orderBy]);

  return searchTerm.length === 0
    ? sorted
    : sorted.filter(a => _.startsWith(_.toLower(a.caption), _.toLower(searchTerm)));
}

export function Research() {
  const globalDataRef = useRef<any[]>([]);
  const visContainerRef = useRef<HTMLDivElement>(null);
  const visWidth = useContainerWidth(visContainerRef);
  const dropRef = useRef<HTMLDivElement>(null);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [researchData, setResearchData] = useState<any[]>([]);
  const [currentProjects, setCurrentProjects] = useState<string[]>([]);
  const [itemHovered, setItemHovered] = useState<any>(null);
  const [sortedBy, setSortedBy] = useState('year');
  const [reverse, setReverse] = useState(false);
  const [mode, setMode] = useState('tile');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpec, setFilterSpec] = useState<Record<string, string[]>>({});
  const [modalItem, setModalItem] = useState<any | null>(null);
  const [dropOpen, setDropOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<number | null>(0);
  const [fitMode, setFitMode] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch data once
  useEffect(() => {
    fetch('https://stevenmdrucker.github.io/ResearchContent/researchData.json')
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        let uid = 0;
        const withIds = _.map(data, d => { d.id = uid++; return d; });
        const sorted = _.reverse(_.sortBy(withIds, a => a.tags['year']));
        globalDataRef.current = sorted;
        setDataLoaded(true);
        setResearchData(sorted);
      });
  }, []);

  // Facet panels derived from full data + current filter spec (excluding each facet's own filter)
  const facetPanels: Record<string, any[]> = useMemo(() => {
    if (!dataLoaded || globalDataRef.current.length === 0) return {};
    const facets = _.keys(globalDataRef.current[0]?.tags ?? {});
    const panels: Record<string, any[]> = {};
    facets.forEach(facet => {
      const localFilterSpec = _.omit(filterSpec, facet);
      panels[facet] = _.reduce(localFilterSpec, (result: any[], value, key) => {
        return _.filter(result, o => !_.isEmpty(_.intersection(value as string[], o.tags[key])));
      }, globalDataRef.current);
    });
    return panels;
  }, [filterSpec, dataLoaded]);

  const onSortBy = useCallback((facet: string) => {
    let newReverse = false;
    if (sortedBy === facet) {
      newReverse = !reverse;
      setReverse(newReverse);
    } else {
      setSortedBy(facet);
      setReverse(false);
    }
    setResearchData(calcResults(globalDataRef.current, filterSpec, facet, newReverse, searchTerm));
    setDropOpen(false);
  }, [sortedBy, reverse, filterSpec, searchTerm]);

  const handleFilter = useCallback((title: string, val: string) => {
    setFilterSpec(prev => {
      const next = { ...prev };
      if (title in next) {
        if (next[title].includes(val)) {
          next[title] = next[title].filter(a => a !== val);
          if (next[title].length === 0) delete next[title];
        } else {
          next[title] = [...next[title], val];
        }
      } else {
        next[title] = [val];
      }
      setResearchData(calcResults(globalDataRef.current, next, sortedBy, reverse, searchTerm));
      return next;
    });
  }, [sortedBy, reverse, searchTerm]);

  const handleBrush = useCallback((title: string, val: string) => {
    const projList = _.map(
      _.filter(researchData, proj => _.includes(proj.tags[title], val)),
      p => p.caption
    );
    setCurrentProjects(projList);
  }, [researchData]);

  const handleBrushReset = useCallback(() => {
    setItemHovered(null);
    setCurrentProjects([]);
  }, []);

  const handleExit = useCallback(() => {
    setItemHovered(null);
    setCurrentProjects([]);
  }, []);

  const searchUpdated = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setResearchData(calcResults(globalDataRef.current, filterSpec, sortedBy, reverse, term));
  };

  const resetData = () => {
    setSearchTerm('');
    setFilterSpec({});
    setReverse(false);
    setResearchData(globalDataRef.current);
  };

  const openModal = (myval: any) => {
    if (typeof myval === 'string') {
      const found = _.find(globalDataRef.current, a => a.caption === myval);
      if (found) setModalItem(found);
    } else {
      setModalItem(myval);
    }
  };

  // Facets for sort dropdown
  const facets = dataLoaded && researchData.length > 0
    ? _.keys(researchData[0].tags)
    : [];

  const itemsDisplayedString = researchData.length === 1
    ? '1 item displayed'
    : `${researchData.length} items displayed`;

  let resultsDisplay: React.ReactNode = null;
  if (mode === 'tile' || mode === 'details' || mode === 'publication') {
    resultsDisplay = (
      <Index
        mode={mode}
        items={researchData}
        currentProjects={currentProjects}
        handleClick={openModal}
        brushOut={e => { setItemHovered(e); }}
        brushReset={() => handleBrushReset()}
      />
    );
  } else if (mode === 'keyword') {
    resultsDisplay = (
      <div className={fitMode ? '' : 'vis-scroll'}>
        <KeywordVis
          items={researchData}
          currentProjects={currentProjects}
          highlight={[]}
          handleClick={openModal}
          containerWidth={visWidth || 800}
          fitMode={fitMode}
        />
      </div>
    );
  } else if (mode === 'timeline') {
    resultsDisplay = (
      <div className={fitMode ? '' : 'vis-scroll'}>
        <TimelineVis
          items={researchData}
          currentProjects={currentProjects}
          handleClick={openModal}
          width={visWidth || 800}
          height={0}
          containerWidth={visWidth || 800}
          fitMode={fitMode}
        />
      </div>
    );
  } else if (mode === 'stream') {
    resultsDisplay = (
      <div className={fitMode ? '' : 'vis-scroll'}>
        <StreamgraphVis
          items={researchData}
          handleClick={openModal}
          containerWidth={visWidth || 800}
          fitMode={fitMode}
        />
      </div>
    );
  } else if (mode === 'particles') {
    resultsDisplay = (
      <div className={fitMode ? '' : 'vis-scroll'}>
        <WordParticleVis
          items={researchData}
          containerWidth={visWidth || 800}
          fitMode={fitMode}
        />
      </div>
    );
  }

  const viewModes = [
    { id: 'tile',        label: 'Tile',        icon: '⊞' },
    { id: 'details',     label: 'Detail',      icon: '≡' },
    { id: 'publication', label: 'Publication', icon: '¶' },
    { id: 'timeline',    label: 'Timeline',    icon: '◷' },
    { id: 'keyword',     label: 'Keywords',    icon: '⊛' },
    { id: 'stream',      label: 'Streamgraph', icon: '〜' },
    { id: 'particles',   label: 'Particles',   icon: '·' },
  ];

  return (
    <div>
      <div className="container-fluid" style={{ padding: '0 1.25rem' }}>
        <div className="row">
          <div className="col-lg-10 col-sm-10 col-md-10">
            <div className="row mb-2 pt-2">
              <div className="col-12 d-flex flex-wrap align-items-center gap-2">

                {/* View toggle pill group */}
                <div className="view-toggle">
                  {viewModes.map(vm => (
                    <button
                      key={vm.id}
                      className={`view-btn${mode === vm.id ? ' active' : ''}`}
                      onClick={() => setMode(vm.id)}
                    >
                      <span className="view-icon">{vm.icon}</span>
                      <span>{vm.label}</span>
                    </button>
                  ))}
                </div>

                {/* Fit/Zoom toggle */}
                {(mode === 'timeline' || mode === 'keyword' || mode === 'stream' || mode === 'particles') && (
                  <button
                    className={`fit-zoom-btn${fitMode ? ' active' : ''}`}
                    onClick={() => setFitMode(f => !f)}
                    title={fitMode ? 'Switch to scrollable full-size view' : 'Scale to fit in page'}
                  >
                    {fitMode ? '⤡ Zoom' : '⤢ Fit'}
                  </button>
                )}

                {/* Sort dropdown */}
                <div className="dropdown" ref={dropRef}>
                  <button
                    className="sort-dropdown-btn dropdown-toggle"
                    onClick={() => setDropOpen(o => !o)}
                  >
                    Sort: {sortedBy} {reverse ? '↓' : '↑'}
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-dark${dropOpen ? ' show' : ''}`} style={{ fontSize: '0.8rem' }}>
                    {facets.map((facet, i) => (
                      <li key={i}>
                        <button className="dropdown-item" onClick={() => onSortBy(facet)}>{facet}</button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Count + search */}
                <span className="items-count ms-auto">{itemsDisplayedString}</span>
                <input
                  className="research-search form-control form-control-sm"
                  style={{ width: '140px' }}
                  type="text"
                  value={searchTerm}
                  placeholder="Search"
                  onChange={searchUpdated}
                />
              </div>
            </div>
            <div ref={visContainerRef} className="row resultsDisplay">
              {resultsDisplay}
            </div>
          </div>

          <div className="col-lg-2 col-sm-2 col-md-2">
            <div className="pt-2 mb-2">
              <button className="reset-filter-btn" onClick={resetData}>
                Reset Filter
              </button>
            </div>

            <div className="accordion" id="filterAccordion">
              {Object.entries(facetPanels).map(([tag, filteredVals], i) => {
                const values = _.countBy(_.flatMap(filteredVals, val => val.tags[tag]));
                const isOpen = openPanel === i;
                return (
                  <div className="accordion-item" key={i}>
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button py-1 px-2${isOpen ? '' : ' collapsed'}`}
                        style={{ fontSize: '13px', fontWeight: 'bold' }}
                        onClick={() => setOpenPanel(isOpen ? null : i)}
                      >
                        {tag}
                      </button>
                    </h2>
                    <div className={`accordion-collapse collapse${isOpen ? ' show' : ''}`}>
                      <div className="accordion-body p-1" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                        <FacetPanel
                          items={values}
                          filterSpec={filterSpec}
                          itemTitle={tag}
                          selected={itemHovered}
                          brush={handleBrush}
                          filter={handleFilter}
                          clearFilter={handleExit}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <MyPopup item={modalItem} onClose={() => setModalItem(null)} />
    </div>
  );
}
