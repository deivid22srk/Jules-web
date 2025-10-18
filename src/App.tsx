import { useState, useEffect } from 'react';
import { Bot, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { JulesAPI } from './services/jules';
import { DeepSeekAPI } from './services/deepseek';
import SourcesTab from './components/SourcesTab';
import SessionsTab from './components/SessionsTab';
import AutoFixTab from './components/AutoFixTab';
import './App.css';

type Tab = 'sources' | 'sessions' | 'autofix';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('sources');
  const [julesApiKey, setJulesApiKey] = useState('');
  const [openrouterApiKey, setOpenrouterApiKey] = useState('');
  const [julesAPI, setJulesAPI] = useState<JulesAPI | null>(null);
  const [deepseekAPI, setDeepseekAPI] = useState<DeepSeekAPI | null>(null);
  const [settingsCollapsed, setSettingsCollapsed] = useState(false);

  useEffect(() => {
    const savedJulesKey = localStorage.getItem('julesApiKey');
    const savedOpenrouterKey = localStorage.getItem('openrouterApiKey');
    
    if (savedJulesKey) {
      setJulesApiKey(savedJulesKey);
      setJulesAPI(new JulesAPI(savedJulesKey));
      setSettingsCollapsed(true);
    }
    
    if (savedOpenrouterKey) {
      setOpenrouterApiKey(savedOpenrouterKey);
      setDeepseekAPI(new DeepSeekAPI(savedOpenrouterKey));
    }
  }, []);

  const handleSaveKeys = () => {
    if (julesApiKey) {
      localStorage.setItem('julesApiKey', julesApiKey);
      setJulesAPI(new JulesAPI(julesApiKey));
    }
    
    if (openrouterApiKey) {
      localStorage.setItem('openrouterApiKey', openrouterApiKey);
      setDeepseekAPI(new DeepSeekAPI(openrouterApiKey));
    }
    
    setSettingsCollapsed(true);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Bot size={32} />
          <h1>Jules Web</h1>
        </div>
      </header>

      <main className="main">
        <div className={`settings-panel ${settingsCollapsed ? 'collapsed' : ''}`}>
          <div className="settings-header" onClick={() => setSettingsCollapsed(!settingsCollapsed)}>
            <h2>
              <Settings size={20} />
              Configurações
            </h2>
            {settingsCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </div>
          
          {!settingsCollapsed && (
            <div className="settings-content">
              <div className="form-group">
                <label>Jules API Key</label>
                <input
                  type="password"
                  value={julesApiKey}
                  onChange={(e) => setJulesApiKey(e.target.value)}
                  placeholder="AQ.Ab8RN6LY7q3eWYwVUdQUWOCUJdzJO..."
                />
              </div>
              
              <div className="form-group">
                <label>OpenRouter API Key (para DeepSeek)</label>
                <input
                  type="password"
                  value={openrouterApiKey}
                  onChange={(e) => setOpenrouterApiKey(e.target.value)}
                  placeholder="sk-or-v1-e403358233f10403135895109d81..."
                />
              </div>
              
              <button className="btn" onClick={handleSaveKeys}>
                Salvar Configurações
              </button>
            </div>
          )}
        </div>

        {!julesAPI ? (
          <div className="empty">
            <Settings size={48} />
            <p>Configure suas API keys para começar</p>
          </div>
        ) : (
          <>
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'sources' ? 'active' : ''}`}
                onClick={() => setActiveTab('sources')}
              >
                📁 Sources
              </button>
              <button
                className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
                onClick={() => setActiveTab('sessions')}
              >
                💬 Sessions
              </button>
              <button
                className={`tab ${activeTab === 'autofix' ? 'active' : ''}`}
                onClick={() => setActiveTab('autofix')}
              >
                🤖 Auto-Fix
              </button>
            </div>

            {activeTab === 'sources' && <SourcesTab julesAPI={julesAPI} />}
            {activeTab === 'sessions' && <SessionsTab julesAPI={julesAPI} deepseekAPI={deepseekAPI} />}
            {activeTab === 'autofix' && <AutoFixTab julesAPI={julesAPI} deepseekAPI={deepseekAPI} />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
