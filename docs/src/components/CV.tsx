import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function CV() {
  const [info, setInfo] = useState<string>('');

  useEffect(() => {
    fetch('https://stevenmdrucker.github.io/ResearchContent/CV.md')
      .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.text();
      })
      .then(text => setInfo(text));
  }, []);

  return (
    <div className="cv-wrapper">
      <div className="row">
        <div className="col-lg-10 offset-lg-1 col-md-12">
          <div className="cv">
            <div className="row">
              <div className="col-lg-1 col-md-1 col-sm-1"></div>
              <div className="col-lg-11 col-md-11 col-sm-11">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{info}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
