import { useState, useEffect } from 'react';
import { RefreshCw, MessageSquare, Plus, Send, CheckCircle, ExternalLink, Upload, Sparkles } from 'lucide-react';
import { JulesAPI } from '../services/jules';
import { DeepSeekAPI } from '../services/deepseek';
import type { Session, Activity, Source } from '../types/jules';

interface SessionsTabProps {
  julesAPI: JulesAPI;
  deepseekAPI: DeepSeekAPI | null;
}

function SessionsTab({ julesAPI, deepseekAPI }: SessionsTabProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [newSessionPrompt, setNewSessionPrompt] = useState('');
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [startingBranch, setStartingBranch] = useState('main');
  const [autoCreatePR, setAutoCreatePR] = useState(true);
  const [messagePrompt, setMessagePrompt] = useState('');
  
  const [showAutoFix, setShowAutoFix] = useState(false);
  const [logContent, setLogContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const loadSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await julesAPI.listSessions(50);
      setSessions(data.sessions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar sessions');
    } finally {
      setLoading(false);
    }
  };

  const loadSources = async () => {
    try {
      const data = await julesAPI.listSources(50);
      setSources(data.sources || []);
    } catch (err) {
      console.error('Erro ao carregar sources:', err);
    }
  };

  const loadActivities = async (sessionId: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await julesAPI.listActivities(sessionId, 50);
      setActivities(data.activities || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const createSession = async () => {
    if (!newSessionPrompt || !newSessionTitle || !selectedSource) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await julesAPI.createSession({
        prompt: newSessionPrompt,
        title: newSessionTitle,
        sourceContext: {
          source: selectedSource,
          githubRepoContext: {
            startingBranch,
          },
        },
        automationMode: autoCreatePR ? 'AUTO_CREATE_PR' : 'NONE',
      });
      
      setNewSessionPrompt('');
      setNewSessionTitle('');
      setShowCreateForm(false);
      await loadSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar session');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedSession || !messagePrompt) return;

    const currentMessage = messagePrompt;
    setLoading(true);
    setError('');
    setMessagePrompt('');
    
    try {
      await julesAPI.sendMessage(selectedSession.id, currentMessage);
      setTimeout(() => loadActivities(selectedSession.id), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem');
      setMessagePrompt(currentMessage);
    } finally {
      setLoading(false);
    }
  };

  const approvePlan = async () => {
    if (!selectedSession) return;

    setLoading(true);
    setError('');
    try {
      await julesAPI.approvePlan(selectedSession.id);
      setTimeout(() => loadActivities(selectedSession.id), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao aprovar plano');
    } finally {
      setLoading(false);
    }
  };

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

    setAnalyzing(true);
    setError('');
    setAnalysis('');

    try {
      const result = await deepseekAPI.analyzeLogs(logContent);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar logs');
    } finally {
      setAnalyzing(false);
    }
  };

  const sendAnalysisToJules = async () => {
    if (!selectedSession || !analysis) return;

    setLoading(true);
    setError('');

    try {
      await julesAPI.sendMessage(
        selectedSession.id,
        `Por favor, corrija os seguintes problemas identificados nos logs:\n\n${analysis}`
      );
      setLogContent('');
      setAnalysis('');
      setShowAutoFix(false);
      setTimeout(() => loadActivities(selectedSession.id), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar análise');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
    loadSources();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      loadActivities(selectedSession.id);
      const interval = setInterval(() => {
        loadActivities(selectedSession.id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedSession]);

  if (selectedSession) {
    return (
      <div className="content-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <button className="btn btn-secondary" onClick={() => setSelectedSession(null)}>
              ← Voltar
            </button>
            <h2 style={{ marginTop: '0.75rem' }}>{selectedSession.title}</h2>
            <p style={{ color: '#9aa0a6', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {selectedSession.id}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {deepseekAPI && (
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowAutoFix(!showAutoFix)}
                style={{ background: showAutoFix ? '#1a3a1a' : undefined }}
              >
                <Sparkles size={16} />
                Auto-Fix
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => loadActivities(selectedSession.id)} disabled={loading}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {selectedSession.outputs && selectedSession.outputs.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            {selectedSession.outputs.map((output, idx) => (
              output.pullRequest && (
                <div key={idx} className="list-item" style={{ background: '#1a3a1a' }}>
                  <h3>✅ Pull Request Criado</h3>
                  <p>{output.pullRequest.title}</p>
                  <a
                    href={output.pullRequest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#34a853', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
                  >
                    Ver no GitHub <ExternalLink size={14} />
                  </a>
                </div>
              )
            ))}
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {showAutoFix && (
          <div style={{ background: '#2a2a2a', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} />
              Auto-Fix com DeepSeek
            </h3>

            <div className="file-input-area" style={{ marginBottom: '1rem' }}>
              <input
                type="file"
                id={`log-file-${selectedSession.id}`}
                accept=".log,.txt"
                onChange={handleFileUpload}
              />
              <label htmlFor={`log-file-${selectedSession.id}`} style={{ cursor: 'pointer' }}>
                <Upload size={24} style={{ marginBottom: '0.5rem', opacity: 0.7 }} />
                <p style={{ fontSize: '0.9rem' }}>Clique para selecionar arquivo de log</p>
              </label>
            </div>

            {logContent && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ background: '#1e1e1e', padding: '0.75rem', borderRadius: '6px', maxHeight: '150px', overflow: 'auto' }}>
                    <pre style={{ fontSize: '0.7rem', color: '#9aa0a6', margin: 0 }}>
                      {logContent.substring(0, 300)}
                      {logContent.length > 300 ? '...' : ''}
                    </pre>
                  </div>
                </div>
                <button
                  className="btn"
                  onClick={analyzeWithDeepSeek}
                  disabled={analyzing}
                  style={{ marginBottom: '1rem' }}
                >
                  <Sparkles size={16} />
                  {analyzing ? 'Analisando...' : 'Analisar com DeepSeek'}
                </button>
              </>
            )}

            {analysis && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.75rem', color: '#e8eaed' }}>📊 Análise</h4>
                <div style={{ background: '#1e1e1e', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                  <pre style={{ fontSize: '0.85rem', color: '#e8eaed', whiteSpace: 'pre-wrap', margin: 0 }}>
                    {analysis}
                  </pre>
                </div>
                <button className="btn" onClick={sendAnalysisToJules} disabled={loading}>
                  <Send size={16} />
                  Enviar para Jules Corrigir
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginBottom: '0.75rem' }}>Atividades</h3>
          {activities.length === 0 ? (
            <div className="empty">Nenhuma atividade ainda</div>
          ) : (
            <div>
              {activities.map((activity) => (
                <div key={activity.id} className={`activity-item ${activity.originator}`}>
                  <div className="activity-time">
                    {new Date(activity.createTime).toLocaleString('pt-BR')} • {activity.originator === 'agent' ? '🤖 Agent' : '👤 User'}
                  </div>

                  {activity.messageSent && (
                    <>
                      <div className="activity-title">💬 Mensagem Enviada</div>
                      <div className="activity-description">{activity.messageSent.prompt}</div>
                    </>
                  )}

                  {activity.messageReceived && (
                    <>
                      <div className="activity-title">💬 Mensagem Recebida</div>
                      <div className="activity-description">{activity.messageReceived.message}</div>
                    </>
                  )}

                  {activity.planGenerated && (
                    <>
                      <div className="activity-title">📋 Plano Gerado</div>
                      <div className="plan-steps">
                        {activity.planGenerated.plan.steps.map((step) => (
                          <div key={step.id} className="plan-step">
                            {step.index !== undefined ? `${step.index + 1}. ` : ''}
                            {step.title}
                          </div>
                        ))}
                      </div>
                      <button className="btn" onClick={approvePlan} style={{ marginTop: '0.75rem' }}>
                        <CheckCircle size={16} />
                        Aprovar Plano
                      </button>
                    </>
                  )}

                  {activity.planApproved && (
                    <div className="activity-title">✅ Plano Aprovado</div>
                  )}

                  {activity.progressUpdated && (
                    <>
                      <div className="activity-title">{activity.progressUpdated.title}</div>
                      {activity.progressUpdated.description && (
                        <div className="activity-description">{activity.progressUpdated.description}</div>
                      )}
                    </>
                  )}

                  {activity.sessionCompleted && (
                    <div className="activity-title">🎉 Session Completada!</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '8px', position: 'sticky', bottom: 0 }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={messagePrompt}
              onChange={(e) => setMessagePrompt(e.target.value)}
              placeholder="Digite uma mensagem para o agente..."
              style={{ flex: 1, padding: '0.75rem', background: '#1e1e1e', border: '1px solid #3c4043', borderRadius: '8px', color: '#e8eaed' }}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="btn" onClick={sendMessage} disabled={loading || !messagePrompt}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Sessions</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={loadSessions} disabled={loading}>
            <RefreshCw size={16} />
          </button>
          <button className="btn" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus size={16} />
            Nova Session
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {showCreateForm && (
        <div style={{ background: '#2a2a2a', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Criar Nova Session</h3>
          
          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              value={newSessionTitle}
              onChange={(e) => setNewSessionTitle(e.target.value)}
              placeholder="Ex: Criar feature de login"
            />
          </div>

          <div className="form-group">
            <label>Source *</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: '#1e1e1e', border: '1px solid #3c4043', borderRadius: '8px', color: '#e8eaed' }}
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

          <div className="form-group">
            <label>Prompt *</label>
            <textarea
              value={newSessionPrompt}
              onChange={(e) => setNewSessionPrompt(e.target.value)}
              placeholder="Descreva o que você quer que o Jules faça..."
              style={{ width: '100%', minHeight: '100px', padding: '0.75rem', background: '#1e1e1e', border: '1px solid #3c4043', borderRadius: '8px', color: '#e8eaed', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoCreatePR}
                onChange={(e) => setAutoCreatePR(e.target.checked)}
              />
              Criar PR automaticamente
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn" onClick={createSession} disabled={loading}>
              Criar Session
            </button>
            <button className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : sessions.length === 0 ? (
        <div className="empty">
          <MessageSquare size={48} />
          <p>Nenhuma session encontrada</p>
        </div>
      ) : (
        <div>
          {sessions.map((session) => (
            <div key={session.id} className="list-item" onClick={() => setSelectedSession(session)}>
              <h3>{session.title}</h3>
              <p>{session.prompt}</p>
              <p style={{ marginTop: '0.5rem' }}>
                <code>{session.sourceContext.source.split('/').slice(-2).join('/')}</code>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SessionsTab;
