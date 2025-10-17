import React, { useState, useRef, useEffect } from 'react';
import { Code, Send, Save, FolderOpen, Sparkles, FileCode, Terminal, Settings } from 'lucide-react';

export default function CODserver() {
  const [code, setCode] = useState('// Seu código aqui...\n\nfunction exemplo() {\n  console.log("Bem-vindo ao CODserver!");\n}');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([
    { id: 1, name: 'Projeto Principal', language: 'javascript' }
  ]);
  const [currentProject, setCurrentProject] = useState(projects[0]);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: '🔧 Corrigir Bugs', prompt: 'Analise este código e corrija todos os bugs encontrados:' },
    { label: '⚡ Otimizar', prompt: 'Otimize este código para melhor performance e legibilidade:' },
    { label: '📖 Explicar', prompt: 'Explique detalhadamente o que este código faz:' },
    { label: '🧪 Adicionar Testes', prompt: 'Crie testes unitários para este código:' },
    { label: '📝 Documentar', prompt: 'Adicione documentação completa (JSDoc/comentários) a este código:' },
    { label: '🎨 Criar Interface', prompt: 'Crie uma interface React moderna para este código:' }
  ];

  const callClaudeAPI = async (userMessage) => {
    if (!apiKey) {
      return "⚠️ Configure sua API Key nas configurações primeiro!";
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: `${userMessage}\n\n\`\`\`${currentProject.language}\n${code}\n\`\`\``
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Erro API: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      return `❌ Erro na API: ${error.message}`;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await callClaudeAPI(input);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const handleQuickAction = async (prompt) => {
    const userMsg = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const response = await callClaudeAPI(prompt);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const saveProject = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name}.${currentProject.language === 'javascript' ? 'js' : currentProject.language}`;
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

  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="text-purple-400" size={24} />
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            CODserver
          </h1>
          <span className="text-xs text-gray-400">by Cyntreon</span>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={currentProject.id}
            onChange={(e) => {
              const proj = projects.find(p => p.id === parseInt(e.target.value));
              setCurrentProject(proj);
            }}
            className="bg-gray-700 text-sm px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-purple-500"
          >
            {projects.map(proj => (
              <option key={proj.id} value={proj.id}>{proj.name}</option>
            ))}
          </select>
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <Settings size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="max-w-2xl">
            <label className="block text-sm text-gray-400 mb-2">
              🔑 Anthropic API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-gray-700 px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Obtenha em: <a href="https://console.anthropic.com" target="_blank" className="text-purple-400 hover:underline">console.anthropic.com</a>
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-700">
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-2">
              <FileCode size={16} className="text-blue-400" />
              <span className="text-sm font-medium">{currentProject.name}</span>
            </div>
            <button
              onClick={saveProject}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
            >
              <Save size={14} />
              Salvar
            </button>
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-gray-900 p-4 font-mono text-sm focus:outline-none resize-none"
            spellCheck="false"
            style={{ tabSize: 2 }}
          />
          
          <div className="bg-gray-800 px-4 py-2 border-t border-gray-700 text-xs text-gray-500">
            Linhas: {code.split('\n').length} | Caracteres: {code.length}
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div className="w-96 flex flex-col bg-gray-800">
          <div className="px-4 py-3 border-b border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Terminal size={16} className="text-purple-400" />
              <span className="font-medium">Assistente IA</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.prompt)}
                  disabled={loading}
                  className="text-xs px-2 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors disabled:opacity-50 text-left"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8">
                <Sparkles className="mx-auto mb-2 text-purple-400" size={32} />
                <p>Use as ações rápidas ou digite sua solicitação</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[85%] px-3 py-2 rounded-lg text-sm ${
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
          <div className="p-4 border-t border-gray-700">
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
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}