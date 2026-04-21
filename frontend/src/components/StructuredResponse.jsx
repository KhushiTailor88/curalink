import React from 'react';
import { Sparkles, FileText, Activity, Link as LinkIcon } from 'lucide-react';

const StructuredResponse = ({ summary }) => {
  if (!summary) return null;

  // Simple rendering of the markdown content by splitting based on markdown headers.
  // Real implementation might use react-markdown, doing simple generic splits here. 
  
  // Actually, let's just dangerously inject if it's super simple or just map it as paragraphs.
  // Because we want a nice design, let's use the explicit fields if available, otherwise raw.
  
  const rawText = summary.rawMarkdown || '';
  const paragraphs = rawText.split('\\n').filter(p => p.trim() !== '');

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 className="section-title" style={{marginBottom: '1.5rem', color: '#818cf8', display: 'flex', alignItems: 'center'}}>
        <Sparkles size={24} style={{ marginRight: '0.5rem' }}/>
        AI-Generated Research Overview
      </h2>
      
      <div className="ai-summary-content">
         {/* Render lines somewhat intelligently */}
         {paragraphs.map((para, idx) => {
           if (para.startsWith('###') || para.startsWith('##') || para.startsWith('#')) {
             const Title = para.replace(/#/g, '').trim();
             return <h3 key={idx}>{Title}</h3>;
           }
           if (para.startsWith('- ') || para.startsWith('* ')) {
             return <li key={idx} style={{marginLeft: '1rem', marginBottom: '0.5rem'}}>{para.substring(2)}</li>;
           }
           return <p key={idx}>{para}</p>;
         })}
      </div>

      {summary.sources && summary.sources.length > 0 && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--panel-border)', paddingTop: '1rem'}}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LinkIcon size={16} /> Verified Sources Used
          </h3>
          <ul style={{ listStyleType: 'none' }}>
            {summary.sources.map((src, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>
                <a href={src} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-hover)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  {src}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StructuredResponse;
