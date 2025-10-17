# 🚀 CODserver Super App

<div align="center">

![CODserver Logo](https://img.shields.io/badge/CODserver-Super%20App-purple?style=for-the-badge&logo=code&logoColor=white)

**Plataforma Completa de Desenvolvimento com IA**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/cyntreon/codserver-super-app)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18+-blue.svg)](https://reactjs.org/)

[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-green.svg)](https://openai.com/)
[![Claude](https://img.shields.io/badge/Anthropic-Claude-orange.svg)](https://anthropic.com/)
[![Monaco](https://img.shields.io/badge/Monaco-Editor-blue.svg)](https://microsoft.github.io/monaco-editor/)

</div>

---

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias)
- [🚀 Instalação](#-instalação)
- [⚙️ Configuração](#️-configuração)
- [🎮 Como Usar](#-como-usar)
- [📱 Módulos](#-módulos)
- [🌐 Deploy](#-deploy)
- [🔧 API](#-api)
- [📊 Screenshots](#-screenshots)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

---

## 🎯 Visão Geral

O **CODserver Super App** é uma plataforma completa de desenvolvimento que integra **25+ ferramentas open source** para criar uma experiência de desenvolvimento moderna e eficiente. Combina editor de código profissional, inteligência artificial, terminal integrado, controle de versão e muito mais.

### 🎨 Layout Principal

```
┌─────────────────────────────────────────────────────────────────┐
│                    🚀 CODserver Super App                        │
├─────────────────────┬───────────────────────────────────────────┤
│                     │                                           │
│    📝 Editor        │         🤖 Chat com IA                    │
│    Monaco           │         Claude + GPT-4                     │
│    (Esquerda)       │         (Direita)                          │
│                     │                                           │
├─────────────────────┴───────────────────────────────────────────┤
│                    💻 Terminal Integrado                         │
│                    Git + Comandos + Execução                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Funcionalidades

### 🤖 **Inteligência Artificial**
- **Claude AI** - Análise de código avançada
- **OpenAI GPT-4** - Geração e correção de código
- **Chat inteligente** - Conversas contextuais
- **Sugestões automáticas** - Melhorias em tempo real

### 💻 **Editor de Código**
- **Monaco Editor** - Mesmo editor do VS Code
- **Syntax highlighting** - 50+ linguagens
- **Auto-complete** - IntelliSense integrado
- **Debugging** - Breakpoints e inspeção
- **Temas** - Dark, Light, High Contrast

### 🌐 **Backend Robusto**
- **Express.js** - API REST completa
- **Socket.IO** - Comunicação em tempo real
- **MongoDB** - Banco de dados NoSQL
- **Redis** - Cache e sessões
- **JWT** - Autenticação segura

### 🔐 **Segurança Avançada**
- **bcryptjs** - Hash de senhas
- **Helmet** - Headers de segurança
- **Rate Limiting** - Proteção contra spam
- **CORS** - Configuração de origem

### 📁 **Manipulação de Arquivos**
- **Upload** - Arquivos e projetos
- **Processamento** - Imagens com Sharp
- **PDFs** - Geração e manipulação
- **QR Codes** - Compartilhamento

### 🔧 **Ferramentas de Desenvolvimento**
- **Git Integration** - Controle de versão
- **Terminal** - Comandos do sistema
- **Deploy** - Deploy automático
- **Monitoring** - Métricas e logs

---

## 🛠️ Tecnologias

### **Frontend**
- **React 18** - Interface moderna
- **Monaco Editor** - Editor profissional
- **Socket.IO Client** - Tempo real
- **Chart.js** - Gráficos e dashboards

### **Backend**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados
- **Redis** - Cache
- **Socket.IO** - WebSockets

### **IA & APIs**
- **Anthropic Claude** - IA avançada
- **OpenAI GPT-4** - Geração de código
- **Axios** - Cliente HTTP

### **Segurança**
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Helmet** - Segurança HTTP
- **Rate Limiting** - Proteção

### **Utilitários**
- **Lodash** - JavaScript utilities
- **Moment.js** - Manipulação de datas
- **UUID** - IDs únicos
- **Sharp** - Processamento de imagens

---

## 🚀 Instalação

### 📋 **Pré-requisitos**

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- **MongoDB** (opcional - usa arquivos locais por padrão)
- **Redis** (opcional - para cache)

### 🔧 **Instalação Rápida**

```bash
# 1. Clone o repositório
git clone https://github.com/cyntreon/codserver-super-app.git
cd codserver-super-app

# 2. Instale as dependências
npm install
cd client && npm install && cd ..

# 3. Configure as variáveis de ambiente
cp env-template.txt .env
# Edite o arquivo .env com suas chaves de API

# 4. Execute o projeto
npm run dev
```

### 🐳 **Docker (Opcional)**

```bash
# Build da imagem
npm run docker:build

# Executar container
npm run docker:run
```

---

## ⚙️ Configuração

### 🔑 **Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3001
NODE_ENV=production

# APIs de IA
ANTHROPIC_API_KEY=sk-ant-SUA-CHAVE-AQUI
OPENAI_API_KEY=sk-SUA-CHAVE-AQUI
CLAUDE_API_KEY=sk-ant-SUA-CHAVE-AQUI

# Banco de dados (opcional)
MONGODB_URI=mongodb://localhost:27017/codserver
REDIS_URL=redis://localhost:6379

# Segurança
JWT_SECRET=seu-jwt-secret-super-seguro
CORS_ORIGIN=*

# Upload
MAX_FILE_SIZE=50mb
UPLOAD_PATH=./uploads
```

### 🔐 **Chaves de API**

#### **Anthropic Claude**
1. Acesse [console.anthropic.com](https://console.anthropic.com/)
2. Crie uma conta
3. Gere uma API key
4. Adicione no `.env`

#### **OpenAI**
1. Acesse [platform.openai.com](https://platform.openai.com/)
2. Crie uma conta
3. Gere uma API key
4. Adicione no `.env`

---

## 🎮 Como Usar

### 🚀 **Iniciando o Servidor**

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

### 🌐 **Acessando a Aplicação**

- **Local**: `http://localhost:3001`
- **Rede**: `http://SEU_IP:3001`

### 💻 **Primeiros Passos**

1. **Configure as APIs** - Adicione suas chaves nas configurações
2. **Escolha a IA** - Claude ou OpenAI
3. **Digite código** - Use o editor Monaco
4. **Chat com IA** - Faça perguntas sobre o código
5. **Execute** - Use o terminal integrado

---

## 📱 Módulos

### 🎯 **Dashboard Principal**
- Visão geral dos projetos
- Estatísticas de uso
- Acesso rápido aos módulos

### 💻 **Code Editor**
- Editor Monaco profissional
- Syntax highlighting
- Auto-complete
- Debugging integrado

### 🤖 **AI Chat**
- Claude AI
- OpenAI GPT-4
- Chat contextual
- Aplicação de código

### 💻 **Terminal**
- Comandos do sistema
- Git integration
- Execução de código
- Histórico de comandos

### 🔧 **Git Integration**
- Status dos arquivos
- Commits
- Branches
- Histórico

### 📁 **File Manager**
- Upload de arquivos
- Organização de projetos
- Snippets de código
- Templates

### 📊 **Analytics**
- Métricas de uso
- Gráficos de performance
- Relatórios
- Estatísticas

### 🔐 **Authentication**
- Login/Registro
- JWT tokens
- Perfis de usuário
- Permissões

---

## 🌐 Deploy

### ⚡ **Vercel (Recomendado)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 🌐 **Netlify**

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### 🏠 **Seu Servidor**

```bash
# Build de produção
npm run build:production

# Upload para servidor
rsync -av client/build/* usuario@seu-servidor.com:/var/www/html/
```

### 🐳 **Docker**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

---

## 🔧 API

### 📡 **Endpoints Principais**

#### **Chat com IA**
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Explique este código",
  "code": "function hello() { return 'world'; }",
  "language": "javascript",
  "aiProvider": "claude"
}
```

#### **Projetos**
```http
GET /api/projects          # Listar projetos
POST /api/projects         # Criar projeto
GET /api/projects/:id      # Obter projeto
PUT /api/projects/:id      # Atualizar projeto
DELETE /api/projects/:id   # Deletar projeto
```

#### **Terminal**
```http
POST /api/terminal
Content-Type: application/json

{
  "command": "ls -la",
  "code": "console.log('hello')",
  "language": "javascript"
}
```

#### **Git**
```http
POST /api/git/init         # Inicializar repo
GET /api/git/status/:id    # Status do repo
POST /api/git/commit       # Fazer commit
GET /api/git/log/:id       # Histórico
```

### 📚 **Documentação Completa**

Acesse `/api-docs` para documentação interativa com Swagger.

---

## 📊 Screenshots

### 🎨 **Interface Principal**
![Interface Principal](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=CODserver+Super+App)

### 💻 **Editor de Código**
![Editor](https://via.placeholder.com/400x300/2d2d2d/ffffff?text=Monaco+Editor)

### 🤖 **Chat com IA**
![Chat IA](https://via.placeholder.com/400x300/3d3d3d/ffffff?text=AI+Chat)

### 💻 **Terminal**
![Terminal](https://via.placeholder.com/800x200/1a1a1a/00ff00?text=Terminal+Integrado)

---

## 🤝 Contribuição

### 🚀 **Como Contribuir**

1. **Fork** o projeto
2. **Clone** seu fork
3. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
4. **Commit** suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
5. **Push** para a branch: `git push origin feature/nova-funcionalidade`
6. **Abra** um Pull Request

### 📋 **Padrões**

- **ESLint** - Linting de código
- **Prettier** - Formatação
- **Jest** - Testes
- **Conventional Commits** - Mensagens de commit

### 🐛 **Reportar Bugs**

Use o [GitHub Issues](https://github.com/cyntreon/codserver-super-app/issues) para reportar bugs.

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 **Autor**

**Ricardo R. Pereira - Cyntreon**

- 🌐 **Website**: [cyntreon.com](https://cyntreon.com)
- 📧 **Email**: contato@cyntreon.com
- 🐙 **GitHub**: [@cyntreon](https://github.com/cyntreon)
- 💼 **LinkedIn**: [Ricardo Pereira](https://linkedin.com/in/ricardo-pereira)

---

## 🙏 **Agradecimentos**

- **Microsoft** - Monaco Editor
- **Anthropic** - Claude AI
- **OpenAI** - GPT-4
- **Express.js** - Framework web
- **React** - Biblioteca UI
- **Comunidade Open Source** - Todas as bibliotecas utilizadas

---

<div align="center">

### ⭐ **Se este projeto te ajudou, considere dar uma estrela!** ⭐

[![GitHub stars](https://img.shields.io/github/stars/cyntreon/codserver-super-app?style=social)](https://github.com/cyntreon/codserver-super-app/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/cyntreon/codserver-super-app?style=social)](https://github.com/cyntreon/codserver-super-app/network)

**🚀 Desenvolvido com ❤️ por Ricardo R. Pereira - Cyntreon**

</div>