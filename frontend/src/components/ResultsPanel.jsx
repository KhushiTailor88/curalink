import React from 'react';
import { BookOpen, Stethoscope, ExternalLink } from 'lucide-react';

const ResultsPanel = ({ publications = [], trials = [] }) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
      {/* Publications */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 className="section-title">
          <BookOpen size={20} style={{color: 'var(--accent-color)'}}/>
          Top Research Papers ({publications.length})
        </h2>
        {publications.length === 0 ? (
          <p style={{color: 'var(--text-secondary)'}}>No publications found.</p>
        ) : (
          <div className="card-grid">
            {publications.map((item, idx) => (
              <div key={idx} className="item-card">
                <h3>{item.title}</h3>
                <div className="meta">
                  {item.year || 'Unknown Year'} • {item.source}
                </div>
                <div className="abstract">
                  {item.abstract && item.abstract.length > 5 ? item.abstract : 'Abstract not fully loaded or unavailable from the generic endpoint.'}
                </div>
                {item.url && (
                  <a href={item.url.startsWith('http') ? item.url : `https://doi.org/${item.url}`} target="_blank" rel="noreferrer" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                    Read Full Paper <ExternalLink size={14}/>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clinical Trials */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 className="section-title">
          <Stethoscope size={20} style={{color: 'var(--accent-color)'}}/>
          Relevant Clinical Trials ({trials.length})
        </h2>
        {trials.length === 0 ? (
          <p style={{color: 'var(--text-secondary)'}}>No trials found.</p>
        ) : (
          <div className="card-grid">
            {trials.map((item, idx) => (
              <div key={idx} className="item-card">
                <h3>{item.title}</h3>
                <div className="meta">
                  {(item.authors && item.authors.length > 0) ? item.authors[0] : 'ClinicalTrials.gov'} • {item.year || 'Recently'}
                </div>
                <div className="abstract">
                  {item.abstract || 'No abstract provided.'}
                </div>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noreferrer" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                    View Trial Details <ExternalLink size={14}/>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
