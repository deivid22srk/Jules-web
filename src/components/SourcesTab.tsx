import { useState, useEffect } from 'react';
import { RefreshCw, FolderGit2 } from 'lucide-react';
import { JulesAPI } from '../services/jules';
import type { Source } from '../types/jules';

interface SourcesTabProps {
  julesAPI: JulesAPI;
}

function SourcesTab({ julesAPI }: SourcesTabProps) {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSources = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await julesAPI.listSources(50);
      setSources(data.sources || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar sources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  return (
    <div className="content-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Sources Disponíveis</h2>
        <button className="btn btn-secondary" onClick={loadSources} disabled={loading}>
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : sources.length === 0 ? (
        <div className="empty">
          <FolderGit2 size={48} />
          <p>Nenhuma source encontrada</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Conecte repositórios no <a href="https://jules.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1a73e8' }}>jules.google.com</a>
          </p>
        </div>
      ) : (
        <div>
          {sources.map((source) => (
            <div key={source.id} className="list-item">
              <h3>{source.githubRepo?.owner}/{source.githubRepo?.repo}</h3>
              <p>
                <code>{source.name}</code>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SourcesTab;
