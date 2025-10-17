const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Inicializar Anthropic SDK
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'CODserver by Cyntreon',
    timestamp: new Date().toISOString()
  });
});

// Endpoint principal de chat com IA
app.post('/api/chat', async (req, res) => {
  try {
    const { message, code, language = 'javascript' } = req.body;

    if (!message || !code) {
      return res.status(400).json({ 
        error: 'Mensagem e código são obrigatórios' 
      });
    }

    console.log('📨 Recebendo solicitação:', {
      message: message.substring(0, 50) + '...',
      codeLength: code.length,
      language
    });

    // Criar mensagem para Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: `${message}\n\nCódigo em ${language}:\n\`\`\`${language}\n${code}\n\`\`\`\n\nPor favor, forneça a resposta de forma clara e, se incluir código corrigido ou melhorado, use blocos de código markdown.`
      }]
    });

    const aiResponse = response.content[0].text;

    console.log('✅ Resposta recebida:', {
      length: aiResponse.length,
      hasCodeBlock: aiResponse.includes('```')
    });

    res.json({ 
      response: aiResponse,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      }
    });

  } catch (error) {
    console.error('❌ Erro na API:', error);
    
    res.status(500).json({ 
      error: error.message || 'Erro ao processar solicitação',
      type: error.type || 'unknown_error'
    });
  }
});

// Endpoint para gerar app completo
app.post('/api/generate-app', async (req, res) => {
  try {
    const { description, framework = 'react' } = req.body;

    if (!description) {
      return res.status(400).json({ 
        error: 'Descrição do app é obrigatória' 
      });
    }

    console.log('🎨 Gerando app:', { description, framework });

    const systemPrompt = `Você é um desenvolvedor expert criando aplicações completas e funcionais. 
Crie um app ${framework} completo baseado na descrição fornecida.
Inclua:
- Código completo e funcional
- Comentários explicativos
- Boas práticas
- Design moderno
- Tratamento de erros`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      temperature: 0.8,
      messages: [{
        role: 'user',
        content: `${systemPrompt}\n\nDescrição do app: ${description}`
      }]
    });

    const appCode = response.content[0].text;

    res.json({ 
      code: appCode,
      framework,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      }
    });

  } catch (error) {
    console.error('❌ Erro ao gerar app:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para análise de código
app.post('/api/analyze', async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Código é obrigatório' });
    }

    const analysisPrompt = `Analise este código ${language} e forneça:
1. Qualidade geral (0-10)
2. Problemas identificados
3. Sugestões de melhoria
4. Vulnerabilidades de segurança
5. Otimizações possíveis

Código:
\`\`\`${language}
${code}
\`\`\``;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: analysisPrompt
      }]
    });

    res.json({ analysis: response.content[0].text });

  } catch (error) {
    console.error('❌ Erro na análise:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para conversão de linguagem
app.post('/api/convert', async (req, res) => {
  try {
    const { code, fromLanguage, toLanguage } = req.body;

    if (!code || !fromLanguage || !toLanguage) {
      return res.status(400).json({ 
        error: 'Código, linguagem origem e destino são obrigatórios' 
      });
    }

    const conversionPrompt = `Converta este código de ${fromLanguage} para ${toLanguage}.
Mantenha a mesma funcionalidade e adicione comentários explicativos quando necessário.

Código ${fromLanguage}:
\`\`\`${fromLanguage}
${code}
\`\`\`

Forneça apenas o código convertido em ${toLanguage} dentro de um bloco de código.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: conversionPrompt
      }]
    });

    res.json({ convertedCode: response.content[0].text });

  } catch (error) {
    console.error('❌ Erro na conversão:', error);
    res.status(500).json({ error: error.message });
  }
});

// Servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log('   CODserver - Backend API');
  console.log('   by Ricardo R. Pereira - Cyntreon');
  console.log('========================================\n');
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
  console.log(`🔑 API Key configurada: ${process.env.ANTHROPIC_API_KEY ? 'Sim ✓' : 'Não ✗'}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`   - POST /api/chat         (Chat com IA)`);
  console.log(`   - POST /api/generate-app (Gerar app completo)`);
  console.log(`   - POST /api/analyze      (Analisar código)`);
  console.log(`   - POST /api/convert      (Converter linguagem)`);
  console.log(`   - GET  /health           (Health check)`);
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