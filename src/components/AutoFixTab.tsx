import { useState, useEffect } from 'react';
import { Upload, RefreshCw, MessageSquare, Sparkles, Send } from 'lucide-react';
import { JulesAPI } from '../services/jules';
import { DeepSeekAPI } from '../services/deepseek';
import type { Session, Source } from '../types/jules';

interface AutoFixTabProps {
  julesAPI: JulesAPI;
  deepseekAPI: DeepSeekAPI | null;
}

function AutoFixTab({ julesAPI, deepseekAPI }: AutoFixTabProps) {
  const [autoFixEnabled, setAutoFixEnabled] = useState(false);
  const [logContent, setLogContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [startingBranch, setStartingBranch] = useState('main');
  const [sessionTitle, setSessionTitle] = useState('');

  const loadSources = async () => {
    try {
      const data = await julesAPI.listSources(50);
      setSources(data.sources || []);
    } catch (err) {
      console.error('Erro ao carregar sources:', err);
    }
  };

  const loadSessions = async () => {
    try {
      const data = await julesAPI.listSessions(50);
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Erro ao carregar sessions:', err);
    }
  };

  useEffect(() => {
    loadSources();
    loadSessions();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setLogContent(content);
    };
    reader.readAsText(file);
  };

  const analyzeWithDeepSeek = async () => {
    if (!deepseekAPI) {
      setError('Configure a API key do OpenRouter nas configurações');
      return;
    }

    if (!logContent) {
      setError('Nenhum log foi carregado');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const result = await deepseekAPI.analyzeLogs(logContent);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar logs');
    } finally {
      setLoading(false);
    }
  };

  const sendToJules = async (useSession: boolean = false) => {
    if (!analysis) {
      setError('Primeiro analise os logs com DeepSeek');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (useSession && selectedSession) {
        await julesAPI.sendMessage(selectedSession, analysis);
        setError('');
        alert('Instruções enviadas para a session existente!');
      } else {
        if (!selectedSource) {
          setError('Selecione uma source');
          setLoading(false);
          return;
        }

        const title = sessionTitle || `Auto-Fix: ${new Date().toLocaleString('pt-BR')}`;
        await julesAPI.createSession({
          prompt: `Por favor, corrija os seguintes problemas identificados nos logs:\n\n${analysis}`,
          title,
          sourceContext: {
            source: selectedSource,
            githubRepoContext: {
              startingBranch,
            },
          },
          automationMode: 'AUTO_CREATE_PR',
        });

        alert('Nova session criada com as instruções de correção!');
        setLogContent('');
        setAnalysis('');
        await loadSessions();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar para Jules');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-panel">
      <div className="auto-fix-header">
        <h2>
          <Sparkles size={24} />
          Auto-Fix com DeepSeek
        </h2>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={autoFixEnabled}
            onChange={(e) => setAutoFixEnabled(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      {!deepseekAPI && (
        <div className="error">
          Configure a API key do OpenRouter nas configurações para usar o Auto-Fix
        </div>
      )}

      <p style={{ color: '#9aa0a6', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        {autoFixEnabled
          ? '✅ Modo auto-fix ativado. Carregue logs para análise automática.'
          : '⏸️ Modo auto-fix desativado. Ative para analisar logs automaticamente.'}
      </p>

      {error && <div className="error">{error}</div>}

      <div className="file-input-area">
        <input
          type="file"
          id="log-file"
          accept=".log,.txt"
          onChange={handleFileUpload}
        />
        <label htmlFor="log-file" style={{ cursor: 'pointer' }}>
          <Upload size={32} style={{ marginBottom: '0.5rem', opacity: 0.7 }} />
          <p>Clique para selecionar arquivo de log</p>
          <p style={{ fontSize: '0.85rem', color: '#9aa0a6', marginTop: '0.5rem' }}>
            Suporta arquivos .log e .txt
          </p>
        </label>
      </div>

      {logContent && (
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginBottom: '0.75rem', color: '#e8eaed' }}>Log Carregado</h3>
          <div style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '8px', maxHeight: '200px', overflow: 'auto' }}>
            <pre style={{ fontSize: '0.75rem', color: '#9aa0a6', margin: 0 }}>
              {logContent.substring(0, 500)}
              {logContent.length > 500 ? '...' : ''}
            </pre>
          </div>
          <button
            className="btn"
            onClick={analyzeWithDeepSeek}
            disabled={loading || !deepseekAPI}
            style={{ marginTop: '0.75rem' }}
          >
            <Sparkles size={16} />
            {loading ? 'Analisando...' : 'Analisar com DeepSeek'}
          </button>
        </div>
      )}

      {analysis && (
        <div className="analysis-result">
          <h3>📊 Análise do DeepSeek</h3>
          <pre>{analysis}</pre>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#1e1e1e', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '1rem', color: '#e8eaed' }}>Enviar correção para Jules</h4>

            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#9aa0a6' }}>
                Opção 1: Criar Nova Session
              </h5>
              
              <div className="form-group">
                <label>Título da Session</label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder={`Auto-Fix: ${new Date().toLocaleString('pt-BR')}`}
                />
              </div>

              <div className="form-group">
                <label>Source *</label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#2a2a2a',
                    border: '1px solid #3c4043',
                    borderRadius: '8px',
                    color: '#e8eaed',
                  }}
                >
                  <option value="">Selecione uma source...</option>
                  {sources.map((source) => (
                    <option key={source.id} value={source.name}>
                      {source.githubRepo?.owner}/{source.githubRepo?.repo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Branch inicial</label>
                <input
                  type="text"
                  value={startingBranch}
                  onChange={(e) => setStartingBranch(e.target.value)}
                  placeholder="main"
                />
              </div>

              <button className="btn" onClick={() => sendToJules(false)} disabled={loading}>
                <Send size={16} />
                Criar Session e Enviar
              </button>
            </div>

            <div style={{ borderTop: '1px solid #3c4043', paddingTop: '1rem' }}>
              <h5 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#9aa0a6' }}>
                Opção 2: Enviar para Session Existente
              </h5>

              <div className="form-group">
                <label>Session</label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#2a2a2a',
                    border: '1px solid #3c4043',
                    borderRadius: '8px',
                    color: '#e8eaed',
                  }}
                >
                  <option value="">Selecione uma session...</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => sendToJules(true)}
                disabled={loading || !selectedSession}
              >
                <MessageSquare size={16} />
                Enviar para Session
              </button>
            </div>
          </div>
        </div>
      )}

      {autoFixEnabled && !logContent && (
        <div className="empty">
          <Sparkles size={48} />
          <p>Aguardando upload de logs...</p>
        </div>
      )}
    </div>
  );
}

export default AutoFixTab;
