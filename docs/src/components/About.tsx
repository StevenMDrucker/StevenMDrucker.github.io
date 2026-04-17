import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import headShot from '../../images/justheadmed.jpg';

type BioTab = 'Full' | 'Medium' | 'Short';

function parseBioSections(text: string): Record<BioTab, string> {
  const sections: Record<BioTab, string> = { Full: '', Medium: '', Short: '' };
  const parts = text.split(/^(?=(?:Full|Medium|Short):)/m);
  parts.forEach(part => {
    const match = part.match(/^(Full|Medium|Short):\s*([\s\S]*)/);
    if (match) {
      sections[match[1] as BioTab] = match[2].trim();
    }
  });
  // If no sections found, put everything in Full
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
      .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.text();
      })
      .then(text => setSections(parseBioSections(text)));
  }, []);

  return (
    <div className="row">
      <div className="col-lg-2 col-md-2 col-sm-1"></div>
      <div className="col-lg-8 col-md-8 col-sm-10">
        <div className="bio">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-5">
              <img src={headShot} className="img-fluid" alt="Steven Drucker" />
            </div>
            <div className="col-lg-9 col-md-8 col-sm-7">
              <ul className="nav nav-tabs bio-tabs mb-3">
                {(['Full', 'Medium', 'Short'] as BioTab[]).map(tab => (
                  <li className="nav-item" key={tab}>
                    <button
                      className={`nav-link${activeTab === tab ? ' active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >{tab}</button>
                  </li>
                ))}
              </ul>
              <div className="bio-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{sections[activeTab]}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-2 col-md-2 col-sm-1"></div>
    </div>
  );
}
