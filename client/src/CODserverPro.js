import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Code, Send, Save, Settings, Terminal, Play, Download, GitCommit, ExternalLink, Zap, Brain, Users, Cloud, Shield } from 'lucide-react';
import Editor from '@monaco-editor/react';

export default function CODserverPro() {
  const [code, setCode] = useState('// CODserver Pro - Editor com IA Integrada\n\nfunction exemplo() {\n  console.log("Bem-vindo ao CODserver Pro!");\n  return "Editor profissional com IA";\n}');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [apiKey, setApiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [selectedAI, setSelectedAI] = useState('claude');
  const [showSettings, setShowSettings] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState(['CODserver Pro Terminal - Digite comandos aqui...']);
  const [terminalInput, setTerminalInput] = useState('');
  const [projectName, setProjectName] = useState('Projeto Sem Nome');
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(1);
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

  // Simular usuários online (em produção seria WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);
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
          projectName: projectName
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
        body: JSON.stringify({ command, code, language, projectName })
      });
      
      const data = await response.json();
      setTerminalOutput(prev => [...prev, data.output || 'Comando executado']);
    } catch (error) {
      setTerminalOutput(prev => [...prev, `Erro: ${error.message}`]);
    }
  };

  const executeCode = () => {
    setTerminalOutput(prev => [...prev, 'Executando código...']);
    
    try {
      if (language === 'javascript') {
        const result = eval(code);
        setTerminalOutput(prev => [...prev, `Resultado: ${result}`]);
      } else {
        setTerminalOutput(prev => [...prev, `Execução de ${language} não suportada no navegador`]);
      }
    } catch (error) {
      setTerminalOutput(prev => [...prev, `Erro: ${error.message}`]);
    }
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.${language === 'javascript' ? 'js' : language}`;
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
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      saveCode();
    });

    // Configurações avançadas do editor
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

  const quickActions = [
    { label: '🔧 Corrigir Bugs', prompt: 'Analise este código e corrija todos os bugs encontrados:', icon: '🛠️' },
    { label: '⚡ Otimizar', prompt: 'Otimize este código para melhor performance e legibilidade:', icon: '⚡' },
    { label: '📖 Explicar', prompt: 'Explique detalhadamente o que este código faz:', icon: '📖' },
    { label: '🧪 Adicionar Testes', prompt: 'Crie testes unitários completos para este código:', icon: '🧪' },
    { label: '📝 Documentar', prompt: 'Adicione documentação completa (JSDoc/comentários) a este código:', icon: '📝' },
    { label: '🎨 Criar Interface', prompt: 'Crie uma interface React moderna e responsiva para este código:', icon: '🎨' },
    { label: '🔍 Analisar Segurança', prompt: 'Analise este código e identifique problemas de segurança:', icon: '🔍' },
    { label: '🔄 Refatorar', prompt: 'Refatore este código seguindo as melhores práticas:', icon: '🔄' },
    { label: '📦 Deploy', prompt: 'Crie um script de deploy para este código:', icon: '📦' },
    { label: '🚀 Performance', prompt: 'Otimize este código para máxima performance:', icon: '🚀' }
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
      {/* Header Avançado */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="text-purple-400" size={20} />
            <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              CODserver Pro
            </h1>
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

      {/* Settings Panel Avançado */}
      {showSettings && (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">🧠 Claude API</label>
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
                <option value="claude">Claude (Anthropic)</option>
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
                Colaboração
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Esquerda: Editor de Código */}
        <div className="w-1/2 flex flex-col border-r border-gray-700">
          <div className="bg-gray-800 px-3 py-1 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Code size={14} className="text-blue-400" />
              <span className="text-sm text-gray-300">Editor Monaco</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-400">{code.split('\n').length} linhas</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={executeCode}
                className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                title="Executar"
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
                <ExternalLink size={12} />
                Git
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

        {/* Direita: Chat com IA */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-800 px-3 py-1 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain size={14} className="text-purple-400" />
                <span className="text-sm text-gray-300">Chat com IA</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-purple-400">{selectedAI}</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={12} className="text-green-400" />
                <span className="text-xs text-green-400">Seguro</span>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-gray-800 px-3 py-2 border-b border-gray-700">
            <div className="grid grid-cols-5 gap-1">
              {quickActions.slice(0, 5).map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.prompt)}
                  disabled={loading}
                  className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors disabled:opacity-50 text-center"
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
                  className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors disabled:opacity-50 text-center"
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
                <p>Digite sua solicitação para a IA</p>
                <p className="text-xs mt-1">Use as ações rápidas acima ou digite livremente</p>
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
                placeholder="Digite sua solicitação..."
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

      {/* Terminal Avançado */}
      <div className="h-32 bg-gray-800 border-t border-gray-700 flex flex-col">
        <div className="bg-gray-700 px-3 py-1 flex items-center justify-between border-b border-gray-600">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-green-400" />
            <span className="text-sm text-gray-300">Terminal Pro</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400">Git • Deploy • Debug</span>
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
              placeholder="Digite um comando..."
              className="flex-1 bg-gray-700 px-2 py-1 rounded text-sm focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
