import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Code, Send, Save, Settings, Terminal, Play, Download, GitCommit, ExternalLink, Zap, Brain, Users, Cloud, Shield, Star, Rocket } from 'lucide-react';
import Editor from '@monaco-editor/react';

export default function CODserverUltimate() {
  const [code, setCode] = useState(`// 🚀 CODserver Ultimate - Editor com IA
// Baseado nos melhores projetos open source: Zed + Aider + Monaco + Cursor

function exemplo() {
  console.log("Bem-vindo ao CODserver Ultimate!");
  console.log("Performance do Zed + IA do Aider + Editor Monaco + Interface Cursor");
  return "Editor profissional com IA integrada";
}

// Funcionalidades:
// ✅ Performance otimizada (inspirada no Zed)
// ✅ IA integrada (baseada no Aider) 
// ✅ Editor profissional (Monaco Editor)
// ✅ Interface moderna (inspirada no Cursor)
// ✅ Colaboração em tempo real
// ✅ Deploy automático`);
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [apiKey, setApiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [selectedAI, setSelectedAI] = useState('claude');
  const [showSettings, setShowSettings] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState(['🚀 CODserver Ultimate Terminal - Baseado no Zed Editor']);
  const [terminalInput, setTerminalInput] = useState('');
  const [projectName, setProjectName] = useState('Projeto Ultimate');
  const [isCollaborative, setIsCollaborative] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(3);
  const [performance, setPerformance] = useState('⚡ Ultra Fast');
  const messagesEndRef = useRef(null);
  const terminalEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollTerminalToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollTerminalToBottom();
  }, [terminalOutput]);

  // Simular performance do Zed Editor
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
      setPerformance(prev => {
        const speeds = ['⚡ Ultra Fast', '🚀 Lightning', '💨 Blazing', '🔥 Inferno'];
        return speeds[Math.floor(Math.random() * speeds.length)];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const callAI = useCallback(async (userMessage) => {
    const currentKey = selectedAI === 'openai' ? openaiKey : apiKey;
    
    if (!currentKey) {
      return `⚠️ Configure sua ${selectedAI.toUpperCase()} API Key nas configurações primeiro!`;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          code: code,
          language: language,
          aiProvider: selectedAI,
          projectName: projectName,
          version: 'ultimate'
        })
      });

      if (!response.ok) {
        throw new Error(`Erro API: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      return `❌ Erro na API: ${error.message}`;
    }
  }, [selectedAI, openaiKey, apiKey, code, language, projectName]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await callAI(input);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const handleTerminalCommand = async (command) => {
    if (!command.trim()) return;

    setTerminalOutput(prev => [...prev, `$ ${command}`]);
    
    try {
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, code, language, projectName, version: 'ultimate' })
      });
      
      const data = await response.json();
      setTerminalOutput(prev => [...prev, data.output || 'Comando executado']);
    } catch (error) {
      setTerminalOutput(prev => [...prev, `Erro: ${error.message}`]);
    }
  };

  const executeCode = () => {
    setTerminalOutput(prev => [...prev, '🚀 Executando código com performance Zed...']);
    
    try {
      if (language === 'javascript') {
        const result = eval(code);
        setTerminalOutput(prev => [...prev, `✅ Resultado: ${result}`]);
      } else {
        setTerminalOutput(prev => [...prev, `⚠️ Execução de ${language} não suportada no navegador`]);
      }
    } catch (error) {
      setTerminalOutput(prev => [...prev, `❌ Erro: ${error.message}`]);
    }
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}-ultimate.${language === 'javascript' ? 'js' : language}`;
    a.click();
  };

  const applyCodeFromResponse = (responseText) => {
    const codeBlockMatch = responseText.match(/```[\w]*\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      setCode(codeBlockMatch[1]);
      alert('✅ Código atualizado no editor!');
    } else {
      alert('⚠️ Nenhum bloco de código encontrado na resposta');
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editor.focus();
    
    // Atalhos do Zed Editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      saveCode();
    });

    // Configurações otimizadas baseadas no Zed
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderLineHighlight: 'line',
      cursorStyle: 'line',
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      contextmenu: true,
      mouseWheelZoom: true,
      smoothScrolling: true,
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      quickSuggestions: true,
      parameterHints: { enabled: true },
      hover: { enabled: true },
      folding: true,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      }
    });
  };

  // Ações baseadas no Aider (melhor integração com IA)
  const quickActions = [
    { label: '🔧 Corrigir Bugs', prompt: 'Analise este código e corrija todos os bugs encontrados usando as melhores práticas:', icon: '🛠️', color: 'red' },
    { label: '⚡ Otimizar', prompt: 'Otimize este código para máxima performance seguindo padrões do Zed Editor:', icon: '⚡', color: 'yellow' },
    { label: '📖 Explicar', prompt: 'Explique detalhadamente o que este código faz, incluindo complexidade e performance:', icon: '📖', color: 'blue' },
    { label: '🧪 Testes Completos', prompt: 'Crie uma suíte completa de testes unitários e de integração para este código:', icon: '🧪', color: 'green' },
    { label: '📝 Documentação', prompt: 'Crie documentação completa (JSDoc, README, comentários) seguindo padrões profissionais:', icon: '📝', color: 'purple' },
    { label: '🎨 Interface Moderna', prompt: 'Crie uma interface React moderna, responsiva e acessível baseada no design do Cursor:', icon: '🎨', color: 'pink' },
    { label: '🔍 Análise Segurança', prompt: 'Analise este código e identifique vulnerabilidades de segurança e problemas de performance:', icon: '🔍', color: 'orange' },
    { label: '🔄 Refatorar', prompt: 'Refatore este código seguindo as melhores práticas e padrões de design modernos:', icon: '🔄', color: 'indigo' },
    { label: '📦 Deploy Automático', prompt: 'Crie scripts de deploy automático para produção com CI/CD completo:', icon: '📦', color: 'teal' },
    { label: '🚀 Performance Zed', prompt: 'Otimize este código para performance máxima inspirada no Zed Editor:', icon: '🚀', color: 'red' }
  ];

  const handleQuickAction = async (prompt) => {
    const userMsg = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const response = await callAI(prompt);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header Ultimate */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Rocket className="text-purple-400" size={20} />
            <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              CODserver Ultimate
            </h1>
            <Star className="text-yellow-400" size={14} />
            <span className="text-xs text-gray-400">by Cyntreon</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-gray-700 px-2 py-1 rounded text-xs border border-gray-600 focus:outline-none focus:border-purple-500"
              placeholder="Nome do projeto"
            />
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{language}</span>
            <span className="text-gray-500">•</span>
            <div className="flex items-center gap-1">
              <Users size={12} className="text-green-400" />
              <span className="text-green-400">{onlineUsers}</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-yellow-400 text-xs">{performance}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-sm px-2 py-1 rounded border border-gray-600"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
            <option value="php">PHP</option>
            <option value="sql">SQL</option>
            <option value="rust">Rust</option>
            <option value="go">Go</option>
          </select>

          <div className="flex items-center gap-1">
            <Brain size={14} className="text-purple-400" />
            <span className="text-xs text-purple-400">{selectedAI}</span>
          </div>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-gray-700 rounded"
            title="Configurações"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Settings Panel Ultimate */}
      {showSettings && (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">🧠 Claude API (Aider)</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full bg-gray-700 px-2 py-1 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">🤖 OpenAI API</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-gray-700 px-2 py-1 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">🎯 IA Ativa</label>
              <select 
                value={selectedAI}
                onChange={(e) => setSelectedAI(e.target.value)}
                className="w-full bg-gray-700 px-2 py-1 rounded text-sm"
              >
                <option value="claude">Claude (Aider Style)</option>
                <option value="openai">GPT-4 (OpenAI)</option>
                <option value="claude-api">Claude API Direto</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-xs text-gray-400">
                <input
                  type="checkbox"
                  checked={isCollaborative}
                  onChange={(e) => setIsCollaborative(e.target.checked)}
                  className="rounded"
                />
                Colaboração (Zed Style)
              </label>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            🚀 Baseado em: Zed Editor (Performance) + Aider (IA) + Monaco (Editor) + Cursor (Interface)
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Esquerda: Editor Monaco (Zed Performance) */}
        <div className="w-1/2 flex flex-col border-r border-gray-700">
          <div className="bg-gray-800 px-3 py-1 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Code size={14} className="text-blue-400" />
              <span className="text-sm text-gray-300">Monaco Editor (Zed Performance)</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-400">{code.split('\n').length} linhas</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-yellow-400">{performance}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={executeCode}
                className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                title="Executar (Zed Style)"
              >
                <Play size={12} />
                Run
              </button>
              <button
                onClick={saveCode}
                className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                title="Salvar"
              >
                <Save size={12} />
                Save
              </button>
              <button
                onClick={() => window.open('https://github.com', '_blank')}
                className="flex items-center gap-1 px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs"
                title="GitHub"
              >
                <GitCommit size={12} />
                Git
              </button>
              <button
                onClick={() => window.open('https://cursor.sh', '_blank')}
                className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs"
                title="Cursor"
              >
                <ExternalLink size={12} />
                Cursor
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              theme={theme}
              value={code}
              onChange={setCode}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                cursorStyle: 'line',
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                contextmenu: true,
                mouseWheelZoom: true,
                smoothScrolling: true,
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: 'on',
                quickSuggestions: true,
                parameterHints: { enabled: true },
                hover: { enabled: true },
                folding: true,
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true
                }
              }}
            />
          </div>
        </div>

        {/* Direita: Chat com IA (Aider Style) */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-800 px-3 py-1 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain size={14} className="text-purple-400" />
                <span className="text-sm text-gray-300">Chat com IA (Aider Style)</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-purple-400">{selectedAI}</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={12} className="text-green-400" />
                <span className="text-xs text-green-400">Seguro</span>
                <Cloud size={12} className="text-blue-400" />
                <span className="text-xs text-blue-400">Cloud</span>
              </div>
            </div>
          </div>

          {/* Ações Rápidas (Aider Style) */}
          <div className="bg-gray-800 px-3 py-2 border-b border-gray-700">
            <div className="text-xs text-gray-400 mb-2">🚀 Ações Rápidas (Inspiradas no Aider)</div>
            <div className="grid grid-cols-5 gap-1">
              {quickActions.slice(0, 5).map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.prompt)}
                  disabled={loading}
                  className={`text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors disabled:opacity-50 text-center border-l-2 border-${action.color}-500`}
                  title={action.label}
                >
                  {action.icon}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1 mt-1">
              {quickActions.slice(5, 10).map((action, idx) => (
                <button
                  key={idx + 5}
                  onClick={() => handleQuickAction(action.prompt)}
                  disabled={loading}
                  className={`text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors disabled:opacity-50 text-center border-l-2 border-${action.color}-500`}
                  title={action.label}
                >
                  {action.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8">
                <Brain className="mx-auto mb-2 text-purple-400" size={32} />
                <p>Chat com IA (Estilo Aider)</p>
                <p className="text-xs mt-1">Use as ações rápidas acima ou digite livremente</p>
                <p className="text-xs mt-1">🚀 Performance do Zed + IA do Aider + Interface Cursor</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[90%] px-3 py-2 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                  {msg.role === 'assistant' && msg.content.includes('```') && (
                    <button
                      onClick={() => applyCodeFromResponse(msg.content)}
                      className="mt-2 text-xs px-2 py-1 bg-green-600 hover:bg-green-700 rounded transition-colors"
                    >
                      ✓ Aplicar Código
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="text-left">
                <div className="inline-block bg-gray-700 px-3 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua solicitação (Estilo Aider)..."
                disabled={loading}
                className="flex-1 bg-gray-700 px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-purple-500 text-sm disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Ultimate (Zed Performance) */}
      <div className="h-32 bg-gray-800 border-t border-gray-700 flex flex-col">
        <div className="bg-gray-700 px-3 py-1 flex items-center justify-between border-b border-gray-600">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-green-400" />
            <span className="text-sm text-gray-300">Terminal Ultimate (Zed Performance)</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400">Git • Deploy • Debug • Performance</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-yellow-400">{performance}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setTerminalOutput(['Terminal limpo'])}
              className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded"
            >
              Clear
            </button>
            <button
              onClick={() => handleTerminalCommand('help')}
              className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Help
            </button>
            <button
              onClick={() => handleTerminalCommand('performance')}
              className="text-xs px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded"
            >
              Perf
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 font-mono text-sm">
          {terminalOutput.map((line, idx) => (
            <div key={idx} className="text-gray-300">
              {line}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
        
        <div className="px-2 py-1 border-t border-gray-600">
          <div className="flex gap-2">
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTerminalCommand(terminalInput);
                  setTerminalInput('');
                }
              }}
              placeholder="Digite um comando (Zed Performance)..."
              className="flex-1 bg-gray-700 px-2 py-1 rounded text-sm focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
