const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const os = require('os');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../client/build')));

// Inicializar SDKs de IA (apenas se as chaves estiverem configuradas)
let anthropic = null;
let openai = null;

if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'sk-ant-test-key') {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-test-key') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Configuração para Claude AI (você)
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;

// Função para executar comandos Git
const execAsync = promisify(exec);

const gitCommands = {
  init: async (projectPath) => {
    try {
      await execAsync(`cd "${projectPath}" && git init`);
      return { success: true, message: 'Repositório Git inicializado' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  status: async (projectPath) => {
    try {
      const { stdout } = await execAsync(`cd "${projectPath}" && git status --porcelain`);
      return { success: true, files: stdout.split('\n').filter(f => f.trim()) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  add: async (projectPath, files = '.') => {
    try {
      await execAsync(`cd "${projectPath}" && git add ${files}`);
      return { success: true, message: 'Arquivos adicionados ao staging' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  commit: async (projectPath, message) => {
    try {
      await execAsync(`cd "${projectPath}" && git commit -m "${message}"`);
      return { success: true, message: 'Commit realizado com sucesso' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  log: async (projectPath, limit = 10) => {
    try {
      const { stdout } = await execAsync(`cd "${projectPath}" && git log --oneline -${limit}`);
      return { success: true, commits: stdout.split('\n').filter(c => c.trim()) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  branch: async (projectPath) => {
    try {
      const { stdout } = await execAsync(`cd "${projectPath}" && git branch`);
      return { success: true, branches: stdout.split('\n').filter(b => b.trim()) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  diff: async (projectPath) => {
    try {
      const { stdout } = await execAsync(`cd "${projectPath}" && git diff`);
      return { success: true, diff: stdout };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Criar diretórios se não existirem
const ensureDirectories = () => {
  const dirs = ['database', 'database/projects', 'database/snippets', 'database/history'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureDirectories();

// Funções para diferentes IAs
const callClaudeAI = async (message, code, language) => {
  if (!anthropic) {
    throw new Error('Claude AI não configurado. Configure ANTHROPIC_API_KEY no arquivo .env');
  }
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: `${message}\n\nCódigo em ${language}:\n\`\`\`${language}\n${code}\n\`\`\`\n\nPor favor, forneça a resposta de forma clara e, se incluir código corrigido ou melhorado, use blocos de código markdown.`
      }]
    });
    return response.content[0].text;
  } catch (error) {
    throw new Error(`Claude AI Error: ${error.message}`);
  }
};

const callOpenAI = async (message, code, language) => {
  if (!openai) {
    throw new Error('OpenAI não configurado. Configure OPENAI_API_KEY no arquivo .env');
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `${message}\n\nCódigo em ${language}:\n\`\`\`${language}\n${code}\n\`\`\`\n\nPor favor, forneça a resposta de forma clara e, se incluir código corrigido ou melhorado, use blocos de código markdown.`
      }],
      max_tokens: 4000,
      temperature: 0.7
    });
    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenAI Error: ${error.message}`);
  }
};

const callClaudeAPI = async (message, code, language) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        temperature: 0.7,
        messages: [{
          role: "user",
          content: `${message}\n\nCódigo em ${language}:\n\`\`\`${language}\n${code}\n\`\`\`\n\nPor favor, forneça a resposta de forma clara e, se incluir código corrigido ou melhorado, use blocos de código markdown.`
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    throw new Error(`Claude API Error: ${error.message}`);
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'CODserver by Cyntreon',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Endpoint principal de chat com IA
app.post('/api/chat', async (req, res) => {
  try {
    const { message, code, language = 'javascript', projectId, aiProvider = 'claude' } = req.body;

    if (!message || !code) {
      return res.status(400).json({ 
        error: 'Mensagem e código são obrigatórios' 
      });
    }

    console.log('📨 Recebendo solicitação:', {
      message: message.substring(0, 50) + '...',
      codeLength: code.length,
      language,
      projectId,
      aiProvider
    });

    // Salvar histórico
    const historyEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message,
      code: code.substring(0, 1000), // Salvar apenas início do código
      language,
      projectId,
      aiProvider
    };

    const historyFile = path.join('database', 'history', 'chat-history.json');
    let history = [];
    if (fs.existsSync(historyFile)) {
      history = fs.readJsonSync(historyFile);
    }
    history.unshift(historyEntry);
    history = history.slice(0, 100); // Manter apenas últimos 100
    fs.writeJsonSync(historyFile, history, { spaces: 2 });

    // Escolher IA baseada no provider
    let aiResponse;
    let usage = {};

    try {
      switch (aiProvider) {
        case 'claude':
          aiResponse = await callClaudeAI(message, code, language);
          break;
        case 'openai':
          aiResponse = await callOpenAI(message, code, language);
          break;
        case 'claude-api':
          aiResponse = await callClaudeAPI(message, code, language);
          break;
        default:
          aiResponse = await callClaudeAI(message, code, language);
      }

      console.log('✅ Resposta recebida:', {
        provider: aiProvider,
        length: aiResponse.length,
        hasCodeBlock: aiResponse.includes('```')
      });

      res.json({ 
        response: aiResponse,
        provider: aiProvider,
        usage: usage
      });

    } catch (aiError) {
      console.error(`❌ Erro na IA ${aiProvider}:`, aiError);
      
      // Tentar com outra IA como fallback
      try {
        console.log('🔄 Tentando com Claude como fallback...');
        aiResponse = await callClaudeAI(message, code, language);
        
        res.json({ 
          response: aiResponse,
          provider: 'claude-fallback',
          usage: usage,
          warning: `Fallback para Claude devido a erro na ${aiProvider}: ${aiError.message}`
        });
      } catch (fallbackError) {
        throw new Error(`Todas as IAs falharam. Último erro: ${fallbackError.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro geral na API:', error);
    
    res.status(500).json({ 
      error: error.message || 'Erro ao processar solicitação',
      type: error.type || 'unknown_error'
    });
  }
});

// Endpoint para salvar projeto
app.post('/api/projects', async (req, res) => {
  try {
    const { name, code, language = 'javascript' } = req.body;

    if (!name || !code) {
      return res.status(400).json({ error: 'Nome e código são obrigatórios' });
    }

    const project = {
      id: Date.now(),
      name,
      code,
      language,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const projectsFile = path.join('database', 'projects', 'projects.json');
    let projects = [];
    if (fs.existsSync(projectsFile)) {
      projects = fs.readJsonSync(projectsFile);
    }

    projects.push(project);
    fs.writeJsonSync(projectsFile, projects, { spaces: 2 });

    res.json({ project, message: 'Projeto salvo com sucesso!' });

  } catch (error) {
    console.error('❌ Erro ao salvar projeto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para listar projetos
app.get('/api/projects', (req, res) => {
  try {
    const projectsFile = path.join('database', 'projects', 'projects.json');
    let projects = [];
    if (fs.existsSync(projectsFile)) {
      projects = fs.readJsonSync(projectsFile);
    }

    res.json({ projects });

  } catch (error) {
    console.error('❌ Erro ao listar projetos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obter projeto específico
app.get('/api/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    const projectsFile = path.join('database', 'projects', 'projects.json');
    
    if (!fs.existsSync(projectsFile)) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    const projects = fs.readJsonSync(projectsFile);
    const project = projects.find(p => p.id === parseInt(id));

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json({ project });

  } catch (error) {
    console.error('❌ Erro ao obter projeto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para salvar snippet
app.post('/api/snippets', async (req, res) => {
  try {
    const { name, code, language = 'javascript', description } = req.body;

    if (!name || !code) {
      return res.status(400).json({ error: 'Nome e código são obrigatórios' });
    }

    const snippet = {
      id: Date.now(),
      name,
      code,
      language,
      description: description || '',
      createdAt: new Date().toISOString()
    };

    const snippetsFile = path.join('database', 'snippets', 'snippets.json');
    let snippets = [];
    if (fs.existsSync(snippetsFile)) {
      snippets = fs.readJsonSync(snippetsFile);
    }

    snippets.push(snippet);
    fs.writeJsonSync(snippetsFile, snippets, { spaces: 2 });

    res.json({ snippet, message: 'Snippet salvo com sucesso!' });

  } catch (error) {
    console.error('❌ Erro ao salvar snippet:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para listar snippets
app.get('/api/snippets', (req, res) => {
  try {
    const snippetsFile = path.join('database', 'snippets', 'snippets.json');
    let snippets = [];
    if (fs.existsSync(snippetsFile)) {
      snippets = fs.readJsonSync(snippetsFile);
    }

    res.json({ snippets });

  } catch (error) {
    console.error('❌ Erro ao listar snippets:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoints para Git
app.post('/api/git/init', async (req, res) => {
  try {
    const { projectPath } = req.body;
    const result = await gitCommands.init(projectPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/git/status/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const projectPath = path.join('database', 'projects', projectId);
    const result = await gitCommands.status(projectPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/git/add', async (req, res) => {
  try {
    const { projectPath, files } = req.body;
    const result = await gitCommands.add(projectPath, files);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/git/commit', async (req, res) => {
  try {
    const { projectPath, message } = req.body;
    const result = await gitCommands.commit(projectPath, message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/git/log/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 10 } = req.query;
    const projectPath = path.join('database', 'projects', projectId);
    const result = await gitCommands.log(projectPath, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/git/branch/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const projectPath = path.join('database', 'projects', projectId);
    const result = await gitCommands.branch(projectPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/git/diff/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const projectPath = path.join('database', 'projects', projectId);
    const result = await gitCommands.diff(projectPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoints para integração com Cursor
app.post('/api/cursor/open', async (req, res) => {
  try {
    const { projectPath, filePath } = req.body;
    
    // Comando para abrir Cursor com o projeto
    const command = filePath 
      ? `cursor "${projectPath}" "${filePath}"`
      : `cursor "${projectPath}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro ao abrir Cursor:', error);
        res.status(500).json({ success: false, error: error.message });
      } else {
        res.json({ success: true, message: 'Cursor aberto com sucesso' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/cursor/sync', async (req, res) => {
  try {
    const { projectPath } = req.body;
    
    // Sincronizar arquivos com Cursor
    const syncCommand = `cd "${projectPath}" && cursor --sync`;
    
    exec(syncCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro na sincronização:', error);
        res.status(500).json({ success: false, error: error.message });
      } else {
        res.json({ success: true, message: 'Sincronização com Cursor realizada' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para criar workspace do Cursor
app.post('/api/cursor/workspace', async (req, res) => {
  try {
    const { projectPath, projectName } = req.body;
    
    // Criar arquivo de workspace do Cursor
    const workspaceConfig = {
      folders: [
        {
          path: projectPath,
          name: projectName
        }
      ],
      settings: {
        "editor.fontSize": 14,
        "editor.tabSize": 2,
        "editor.insertSpaces": true,
        "editor.wordWrap": "on",
        "editor.minimap.enabled": true,
        "editor.bracketPairColorization.enabled": true,
        "editor.guides.bracketPairs": true,
        "editor.guides.indentation": true,
        "workbench.colorTheme": "Dark+",
        "terminal.integrated.defaultProfile.windows": "PowerShell"
      },
      extensions: {
        recommendations: [
          "ms-vscode.vscode-typescript-next",
          "bradlc.vscode-tailwindcss",
          "esbenp.prettier-vscode",
          "ms-vscode.vscode-json"
        ]
      }
    };

    const workspacePath = path.join(projectPath, `${projectName}.code-workspace`);
    fs.writeJsonSync(workspacePath, workspaceConfig, { spaces: 2 });

    res.json({ 
      success: true, 
      message: 'Workspace do Cursor criado',
      workspacePath: workspacePath
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para terminal
app.post('/api/terminal', async (req, res) => {
  try {
    const { command, code, language } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: 'Comando é obrigatório' });
    }

    console.log('🖥️ Executando comando:', command);

    // Comandos especiais
    if (command === 'clear') {
      return res.json({ output: 'Terminal limpo' });
    }

    if (command === 'code') {
      return res.json({ output: `Código atual (${language}):\n${code}` });
    }

    if (command === 'help') {
      return res.json({ 
        output: `Comandos disponíveis:
- clear: Limpar terminal
- code: Mostrar código atual
- help: Mostrar esta ajuda
- run: Executar código atual
- save: Salvar código atual` 
      });
    }

    if (command === 'run') {
      try {
        if (language === 'javascript') {
          // Executar JavaScript usando eval (cuidado em produção!)
          const result = eval(code);
          return res.json({ output: `Resultado: ${result}` });
        } else {
          return res.json({ output: `Execução de ${language} não suportada no terminal` });
        }
      } catch (error) {
        return res.json({ output: `Erro na execução: ${error.message}` });
      }
    }

    if (command === 'save') {
      return res.json({ output: 'Use o botão Save no editor para salvar o código' });
    }

    // Executar comando do sistema
    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) {
        res.json({ output: `Erro: ${error.message}` });
      } else if (stderr) {
        res.json({ output: `Stderr: ${stderr}` });
      } else {
        res.json({ output: stdout || 'Comando executado com sucesso' });
      }
    });

  } catch (error) {
    console.error('❌ Erro no terminal:', error);
    res.status(500).json({ error: error.message });
  }
});

// Servir arquivos estáticos do React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Função para obter IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Pula interfaces internas e não IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return 'localhost';
}

// Servidor
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // Permite acesso de qualquer IP
const localIP = getLocalIP();

app.listen(PORT, HOST, () => {
  console.log('\n🚀 ========================================');
  console.log('   CODserver - Editor de Código com IA');
  console.log('   by Ricardo R. Pereira - Cyntreon');
  console.log('========================================\n');
  console.log(`✅ Servidor rodando em:`);
  console.log(`   - Local: http://localhost:${PORT}`);
  console.log(`   - Rede: http://${localIP}:${PORT}`);
  console.log(`🔑 API Key configurada: ${process.env.ANTHROPIC_API_KEY ? 'Sim ✓' : 'Não ✗'}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`   - POST /api/chat         (Chat com IA)`);
  console.log(`   - POST /api/projects     (Salvar projeto)`);
  console.log(`   - GET  /api/projects     (Listar projetos)`);
  console.log(`   - GET  /api/projects/:id (Obter projeto)`);
  console.log(`   - POST /api/snippets     (Salvar snippet)`);
  console.log(`   - GET  /api/snippets     (Listar snippets)`);
  console.log(`   - POST /api/terminal     (Terminal)`);
  console.log(`   - GET  /health           (Health check)`);
  console.log('\n🌐 Para acessar de outros dispositivos na rede:');
  console.log(`   📱 Celular/Tablet: http://${localIP}:${PORT}`);
  console.log(`   💻 Outros PCs: http://${localIP}:${PORT}`);
  console.log(`\n💡 Certifique-se de que o firewall permite conexões na porta ${PORT}`);
  console.log('\n========================================\n');
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Erro não tratado:', error);
});

process.on('SIGTERM', () => {
  console.log('🛑 Encerrando servidor...');
  process.exit(0);
});

module.exports = app;
