import Slider from 'react-slick';
import parse from 'html-react-parser';

const RC = 'https://stevenmdrucker.github.io/ResearchContent/';

interface Slide {
  title: string;
  year: number;
  venue: string;
  citations: number;
  img: string;
  text: string;
  citation: string;
  pdf?: string;
  video?: string;
}

const slides: Slide[] = [
  {
    title: 'SandDance',
    year: 2013,
    venue: 'Microsoft Research',
    citations: 520,
    img: RC + 'researchImages/sanddance.png',
    citation: '<div class="csl-entry">Drucker, S. M., and Fernandez, R. (2013). <i>SandDance</i>. Microsoft Research.</div>',
    text: `A browser-based information visualization system that scales to hundreds of thousands of items while keeping every individual record visible as a distinct mark. SandDance focuses on natural interaction techniques — touch, speech, and gesture — so the entire experience can be operated without a mouse. Users fluidly transition between unit, aggregate, and relational views of the same dataset. The system has shipped in Microsoft PowerBI, Azure Data Explorer, and Visual Studio Code.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/sanddance.pdf',
    video: 'http://research.microsoft.com/~sdrucker/video/TouchViz2.mp4',
  },
  {
    title: 'MyLifeBits: Fulfilling the Memex Vision',
    year: 2002,
    venue: 'ACM Multimedia',
    citations: 847,
    img: RC + 'researchImages/memex1.png',
    citation: '<div class="csl-entry">Gemmell, J., Bell, G., Lueder, R., Drucker, S., and Wong, C. (2002). MyLifeBits: fulfilling the Memex vision. In <i>Proceedings of the tenth ACM international conference on Multimedia</i> (pp. 235–238). ACM.</div>',
    text: `An implementation of Vannevar Bush's 1945 Memex concept: a system for storing everything a person sees, hears, and reads in digital form. MyLifeBits organizes this lifetime store through collections, full-text search, and rich annotations, while supporting multiple visualizations to help users navigate their personal history. It introduced transclusion-based authoring to weave together items from the store, and surfaced deep questions about memory, privacy, and the future of personal information management.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/mylifebits.pdf',
  },
  {
    title: 'Interactive Digital Photomontage',
    year: 2004,
    venue: 'ACM SIGGRAPH',
    citations: 1411,
    img: RC + 'researchImages/photomontage.jpg',
    citation: '<div class="csl-entry">Agarwala, A., Dontcheva, M., Agrawala, M., Drucker, S., Colburn, A., Curless, B., … Cohen, M. (2004). Interactive digital photomontage. In <i>ACM Transactions on Graphics (TOG)</i> (Vol. 23, pp. 294–302). ACM.</div>',
    text: `A framework for combining parts of a set of photographs into a single composite. Users specify high-level image objectives — such as "best focus" or "all eyes open" — which the system satisfies using graph-cut optimization to select regions from source images and gradient-domain fusion to seamlessly blend them. The interactive tools let users refine results globally or locally, making it practical to build composites that would be impossible or extremely tedious to create manually.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/photomontage.pdf',
    video: 'http://grail.cs.washington.edu/projects/photomontage/video.avi',
  },
  {
    title: 'Intermedia: A Seamless Information Environment',
    year: 1988,
    venue: 'IEEE Computer',
    citations: 840,
    img: RC + 'researchImages/intermedia.gif',
    citation: '<div class="csl-entry">Yankelovich, N., Haan, B. J., Meyrowitz, N. K., and Drucker, S. M. (1988). Intermedia: The concept and the construction of a seamless information environment. <i>IEEE Computer</i>, <i>21</i>(1), 81–96.</div>',
    text: `One of the earliest and most influential hypertext systems, developed at Brown University's Institute for Research in Information and Scholarship (IRIS). Intermedia provided a seamless environment in which documents of every type — text, graphics, timelines, video — could be linked through bidirectional web connections. Unlike earlier hypertext systems, links in Intermedia were first-class objects: any selection in any document could anchor a link, and following a link preserved context by showing both endpoints. Multi-user collaboration and context-sensitive webs of documents were supported from the start. Intermedia directly shaped the design of the World Wide Web and remains a foundational work of the hypertext field.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/intermedia1.pdf',
  },
  {
    title: 'Foveated 3D Graphics',
    year: 2012,
    venue: 'ACM SIGGRAPH Asia',
    citations: 629,
    img: RC + 'researchImages/foveated.png',
    citation: '<div class="csl-entry">Guenter, B., Finch, M., Drucker, S., Tan, D., and Snyder, J. (2012). Foveated 3D graphics. <i>ACM Transactions on Graphics (TOG)</i>, <i>31</i>(6), 164.</div>',
    text: `A rendering system that exploits the human eye's sharply limited acuity outside the fovea: only the small region where a user is actually looking is rendered at full resolution, while the periphery is rendered at progressively lower resolutions. Eye-tracking drives the system in real time, achieving 5–6× reductions in GPU workload with differences that are imperceptible to the viewer. This work is a foundational technique for modern VR and AR headsets, where rendering budget is critical.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/userstudy07.pdf',
  },
  {
    title: 'Interactions with Big Data Analytics',
    year: 2012,
    venue: 'ACM Interactions',
    citations: 512,
    img: RC + 'researchImages/bigdata.png',
    citation: '<div class="csl-entry">Fisher, D., DeLine, R., Czerwinski, M., and Drucker, S. (2012). Interactions with big data analytics. <i>Interactions</i>, <i>19</i>(3), 50–59.</div>',
    text: `An exploration of how the explosion of personal and organizational data — tweets, social graphs, purchases, search histories, sensor streams — demands fundamentally new interaction paradigms. Traditional query-and-result interfaces break down at scale; this work examines progressive querying, latency-aware UI design, and visualizations that let analysts steer computations as they run, rather than waiting for batch jobs to finish. A call to rethink the contract between users and large-scale data systems.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/inteactions_big_data.pdf',
  },
  {
    title: 'Investigating Behavioral Variability in Web Search',
    year: 2007,
    venue: 'WWW',
    citations: 423,
    img: RC + 'researchImages/websearch.png',
    citation: '<div class="csl-entry">White, R. W., and Drucker, S. M. (2007). Investigating behavioral variability in web search. In <i>Proceedings of the 16th international conference on World Wide Web</i> (pp. 21–30). ACM.</div>',
    text: `A large-scale longitudinal study of how dramatically search behavior differs between people — and within the same person across different queries. Analyzing five months of interaction logs from over two thousand volunteer users, the study found striking variation in interaction style: how deeply users explore results, how many queries they reformulate, how much they click vs. scan. The work identifies two extreme classes — "navigators" (highly consistent, goal-directed) and "explorers" (highly variable, discovery-oriented) — whose contrasting strategies offer concrete design targets for adaptive search interfaces that better support everyone.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/WhiteWWW2007.pdf',
  },
  {
    title: 'Modeltracker',
    year: 2015,
    venue: 'ACM SIGCHI',
    citations: 405,
    img: RC + 'researchImages/modeltracker.png',
    citation: '<div class="csl-entry">Amershi, S., Chickering, M., Drucker, S. M., Lee, B., Simard, P., and Suh, J. (2015). Modeltracker: Redesigning performance analysis tools for machine learning. In <i>Proceedings of the 33rd Annual ACM Conference on Human Factors in Computing Systems</i> (pp. 337–346). ACM.</div>',
    text: `A redesign of performance-analysis tools for machine learning that consolidates summary statistics (confusion matrices, ROC curves, precision-recall) with example-level inspection in a single interactive visualization. Rather than cycling between aggregate views and raw data files, practitioners can click directly from a model metric into the individual examples driving it — finding systematic errors, discovering data-quality issues, and understanding model behavior in a fraction of the time required by conventional ML toolkits.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/pn2048-amershi-fixed.pdf',
  },
  {
    title: 'TouchViz',
    year: 2013,
    venue: 'ACM SIGCHI',
    citations: 180,
    img: RC + 'researchImages/touchvis.png',
    citation: '<div class="csl-entry">Drucker, S. M., Fisher, D., Sadana, R., and Herron, J. (2013). TouchViz: a case study comparing two interfaces for data analytics on tablets. In <i>Proceedings of the SIGCHI Conference on Human Factors in Computing Systems</i> (pp. 2301–2310). ACM.</div>',
    text: `A study of the tradeoffs between two UI designs for data visualization on touch tablets: a conventional desktop-style (WIMP) interface with a control panel and checkboxes, versus a FLUID interface that eliminates the control panel and places all interactions directly on the visualization itself. The comparison reveals when direct-touch data manipulation outperforms translated desktop metaphors, providing design guidelines for building data tools that are genuinely optimized for touch rather than merely ported from the desktop.`,
  },
  {
    title: 'Atom: A Grammar for Unit Visualizations',
    year: 2018,
    venue: 'IEEE VIS',
    citations: 120,
    img: RC + 'researchImages/atom.png',
    citation: '<div class="csl-entry">Park, D., Drucker, S. M., Fernandez, R., &amp; Elmqvist, N. (2018). Atom: A Grammar for Unit Visualizations. <i>IEEE Transactions on Visualization and Computer Graphics</i>, <i>24</i>(12), 3032–3043.</div>',
    text: `Unit visualizations represent every data record as a distinct visual mark, offering richer information and better mental-model alignment than aggregated charts for many tasks. Atom formalizes a grammar for this family: data passes through a pipeline of layout operations — bin, stack, pack, dodge — applied recursively until every point's size and position is determined. The grammar subsumes existing unit chart types (dot plots, unit bar charts, waffle charts) and enables novel ones, with a proof-of-concept implementation demonstrating interactive authoring of unit visualizations from declarative specifications.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/atom.pdf',
  },
];

export function Feature() {
  const settings = {
    dots: true,
    infinite: true,
    adaptiveHeight: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: false,
  };

  return (
    <div className="feature-outer">
      <div style={{ width: '100%' }}>
        <Slider {...settings}>
          {slides.map(slide => (
            <div key={slide.title}>
              <div className="feature-slide">
                <div className="feature-header">
                  <h2 className="feature-title">{slide.title}</h2>
                  <div className="feature-meta">
                    <span className="feature-venue">{slide.venue} {slide.year}</span>
                    <span className="feature-citations">⭐ {slide.citations.toLocaleString()} citations</span>
                    <div className="feature-links">
                      {slide.pdf && <a href={slide.pdf} target="_blank" rel="noreferrer" className="feature-link">PDF</a>}
                      {slide.video && <a href={slide.video} target="_blank" rel="noreferrer" className="feature-link">Video</a>}
                    </div>
                    <div className="feature-citation">{parse(slide.citation)}</div>
                  </div>
                </div>
                <div className="feature-body">
                  <img className="feature-img" src={slide.img} alt={slide.title} />
                  <p className="feature-text-body">{slide.text}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
