import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

const InputPanel = ({ onSubmit, loading }) => {
  const [disease, setDisease] = useState('');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disease || !query) return;
    onSubmit({ disease, query, location });
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h2 className="section-title">
        <Search size={20} className="text-accent" style={{color: 'var(--accent-color)'}}/>
        New Query
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Disease / Condition (Required)</label>
          <input
            type="text"
            placeholder="e.g. Parkinson's disease"
            value={disease}
            onChange={e => setDisease(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Specific Query (Required)</label>
          <input
            type="text"
            placeholder="e.g. Deep Brain Stimulation"
            value={query}
            onChange={e => setQuery(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Location (Optional)</label>
          <input
            type="text"
            placeholder="e.g. US, London, etc."
            value={location}
            onChange={e => setLocation(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading || !disease || !query} style={{ marginTop: '1rem' }}>
          {loading ? (
            <>
              <div className="loader"></div>
              Analyzing Sources...
            </>
          ) : (
            'Generate Research Summary'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputPanel;
