import React, { useState, useRef, useEffect } from 'react';
import { Code, Send, Save, Settings, Terminal, Play, Download, GitCommit, ExternalLink, Zap, Brain, Users, Cloud, Shield, Star, Rocket } from 'lucide-react';
import Editor from '@monaco-editor/react';

export default function CODserver() {
  const [code, setCode] = useState('// Seu código aqui...\n\nfunction exemplo() {\n  console.log("Bem-vindo ao CODserver!");\n  return "Editor de código com IA";\n}');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [apiKey, setApiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [selectedAI, setSelectedAI] = useState('claude');
  const [showSettings, setShowSettings] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState(['CODserver Terminal - Digite comandos aqui...']);
  const [terminalInput, setTerminalInput] = useState('');
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

  const callAI = async (userMessage) => {
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
          aiProvider: selectedAI
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
  };

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
        body: JSON.stringify({ command, code, language })
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
        // Executar JavaScript no navegador
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
    a.download = `codigo.${language === 'javascript' ? 'js' : language}`;
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
  };

  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header Simples */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code className="text-purple-400" size={20} />
          <h1 className="text-lg font-bold text-purple-400">CODserver</h1>
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
          </select>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-gray-700 rounded"
            title="Configurações"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Anthropic API</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full bg-gray-700 px-2 py-1 rounded text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">OpenAI API</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-gray-700 px-2 py-1 rounded text-sm"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs text-gray-400 mb-1">IA</label>
              <select 
                value={selectedAI}
                onChange={(e) => setSelectedAI(e.target.value)}
                className="w-full bg-gray-700 px-2 py-1 rounded text-sm"
              >
                <option value="claude">Claude</option>
                <option value="openai">OpenAI</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Esquerda: Editor de Código */}
        <div className="w-1/2 flex flex-col border-r border-gray-700">
          <div className="bg-gray-800 px-3 py-1 flex items-center justify-between border-b border-gray-700">
            <span className="text-sm text-gray-300">Editor</span>
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
            <span className="text-sm text-gray-300">Chat com IA</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8">
                <Code className="mx-auto mb-2 text-purple-400" size={24} />
                <p>Digite sua solicitação para a IA</p>
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

      {/* Terminal (em outro nível - embaixo) */}
      <div className="h-32 bg-gray-800 border-t border-gray-700 flex flex-col">
        <div className="bg-gray-700 px-3 py-1 flex items-center justify-between border-b border-gray-600">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-green-400" />
            <span className="text-sm text-gray-300">Terminal</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setTerminalOutput(['Terminal limpo'])}
              className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded"
            >
              Clear
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