import React, { useState, useEffect, useContext } from 'react';
import { performResearch, fetchHistory } from './services/api';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import StructuredResponse from './components/StructuredResponse';
import Auth from './components/Auth';
import { AuthContext } from './context/AuthContext';
import { Activity, Clock, LogOut } from 'lucide-react';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    try {
      const res = await fetchHistory();
      if (res.success) {
        setHistory(res.data);
      }
    } catch(e) {
      console.error('Failed to fetch history', e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSearch = async (data) => {
    setLoading(true);
    setError('');
    setCurrentResult(null);
    
    try {
      const res = await performResearch(data);
      if (res.success) {
        setCurrentResult(res.data);
        loadHistory();
      } else {
        setError(res.error || 'Failed to process query.');
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>
            <Activity size={32} />
            Curalink
          </h1>
          <p>AI Medical Research Assistant</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Dr. {user?.name}</span>
          <button 
            onClick={logout} 
            style={{ background: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <main className="main-layout">
        <aside className="input-panel-container glass-panel">
          <InputPanel onSubmit={handleSearch} loading={loading} />
          
          <div style={{marginTop: 'auto', flex: 1, display: 'flex', flexDirection: 'column'}}>
            <h3 className="section-title" style={{marginTop: '1rem'}}>
              <Clock size={18} style={{color: 'var(--accent-color)'}}/>
              Recent Queries
            </h3>
            <div style={{overflowY: 'auto', flex: 1, paddingRight: '0.5rem'}}>
              {history.length === 0 && (
                <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>No history yet.</p>
              )}
              {history.map(item => (
                <div key={item._id} className="history-item" onClick={() => setCurrentResult(item)}>
                  <div className="history-item-title">{item.disease}</div>
                  <div className="history-item-date">{new Date(item.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="results-panel-container">
          {error && (
            <div className="glass-panel" style={{padding: '1rem', borderLeft: '4px solid #ef4444'}}>
              <p style={{color: '#fca5a5'}}>{error}</p>
            </div>
          )}

          {!currentResult && !loading && !error && (
            <div className="glass-panel" style={{padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)'}}>
              <Activity size={64} style={{margin: '0 auto 1.5rem auto', opacity: 0.2}} />
              <h3>Ready to Research</h3>
              <p>Enter a condition and query to synthesize data from PubMed, OpenAlex, and ClinicalTrials.gov.</p>
            </div>
          )}

          {currentResult && (
            <>
              {currentResult.aiSummary && <StructuredResponse summary={currentResult.aiSummary} />}
              <ResultsPanel publications={currentResult.publications} trials={currentResult.trials} />
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function App() {
  const { user } = useContext(AuthContext);
  return user ? <Dashboard /> : <Auth />;
}

export default App;
