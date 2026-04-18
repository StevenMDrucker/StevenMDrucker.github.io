import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import headShot from '../../images/justheadmed.jpg';

type BioTab = 'Full' | 'Medium' | 'Short';

const STATS: [string, string][] = [
  ['120+', 'Papers'],
  ['130+', 'Patents'],
  ['30+', 'Years'],
  ['SIGCHI', "Academy '19"],
];

function parseBioSections(text: string): Record<BioTab, string> {
  const sections: Record<BioTab, string> = { Full: '', Medium: '', Short: '' };
  const parts = text.split(/^(?=(?:Full|Medium|Short):)/m);
  parts.forEach(part => {
    const match = part.match(/^(Full|Medium|Short):\s*([\s\S]*)/);
    if (match) sections[match[1] as BioTab] = match[2].trim();
  });
  if (!sections.Full && !sections.Medium && !sections.Short) {
    sections.Full = text.trim();
  }
  return sections;
}

export function About() {
  const [sections, setSections] = useState<Record<BioTab, string>>({ Full: '', Medium: '', Short: '' });
  const [activeTab, setActiveTab] = useState<BioTab>('Full');

  useEffect(() => {
    fetch('https://stevenmdrucker.github.io/ResearchContent/Bio.md')
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(text => setSections(parseBioSections(text)));
  }, []);

  return (
    <div className="bio-hero">
      <div className="row g-4 align-items-start" style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Photo column */}
        <div className="col-lg-3 col-md-4 col-sm-12">
          <div className="bio-photo-wrap">
            <img src={headShot} className="bio-photo" alt="Steven Drucker" />
          </div>
        </div>

        {/* Content column */}
        <div className="col-lg-9 col-md-8 col-sm-12">
          <h1 className="bio-name">Steven M. Drucker</h1>
          <p className="bio-tagline">Researcher · Inventor · Visualist</p>

          <div className="bio-stats">
            {STATS.map(([num, label]) => (
              <div key={label} className="bio-stat-pill">
                <span className="bio-stat-num">{num}</span>
                <span className="bio-stat-label">{label}</span>
              </div>
            ))}
          </div>

          <ul className="nav nav-tabs bio-tabs mb-3">
            {(['Full', 'Medium', 'Short'] as BioTab[]).map(tab => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link${activeTab === tab ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>

          <div className="bio-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{sections[activeTab]}</ReactMarkdown>
          </div>
        </div>

      </div>
    </div>
  );
}
