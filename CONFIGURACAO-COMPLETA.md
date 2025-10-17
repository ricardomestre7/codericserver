# 🚀 CODserver Super App - Configuração Completa

## 📋 Checklist de Instalação

### ✅ **Pré-requisitos**
- [ ] Node.js 18+ instalado
- [ ] npm ou yarn instalado
- [ ] Git instalado
- [ ] Editor de código (VS Code recomendado)

### ✅ **Configuração**
- [ ] Projeto clonado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] Chaves de API adicionadas

### ✅ **APIs Configuradas**
- [ ] Anthropic Claude API Key
- [ ] OpenAI API Key (opcional)
- [ ] MongoDB URI (opcional)
- [ ] Redis URL (opcional)

---

## 🔧 **Comandos de Instalação**

### **Instalação Completa**
```bash
# Clone o projeto
git clone https://github.com/cyntreon/codserver-super-app.git
cd codserver-super-app

# Instale dependências
npm install
cd client && npm install && cd ..

# Configure ambiente
cp env-template.txt .env
# Edite o .env com suas chaves

# Execute
npm run dev
```

### **Instalação Rápida**
```bash
# Script automatizado
npm run install-all
npm run dev
```

---

## 🌐 **URLs de Acesso**

### **Desenvolvimento**
- **Local**: http://localhost:3001
- **Rede**: http://SEU_IP:3001

### **Produção**
- **Vercel**: https://codserver-super-app.vercel.app
- **Netlify**: https://codserver-super-app.netlify.app
- **Seu domínio**: https://codserver.seu-dominio.com

---

## 🔑 **Configuração de APIs**

### **Anthropic Claude** (Recomendado)
1. Acesse: https://console.anthropic.com/
2. Crie conta gratuita
3. Vá em "API Keys"
4. Clique "Create Key"
5. Copie a chave (sk-ant-...)
6. Adicione no `.env`:
```env
ANTHROPIC_API_KEY=sk-ant-SUA-CHAVE-AQUI
```

### **OpenAI GPT-4** (Opcional)
1. Acesse: https://platform.openai.com/
2. Crie conta
3. Adicione créditos ($5 mínimo)
4. Vá em "API Keys"
5. Clique "Create new secret key"
6. Copie a chave (sk-...)
7. Adicione no `.env`:
```env
OPENAI_API_KEY=sk-SUA-CHAVE-AQUI
```

---

## 🎯 **Funcionalidades Disponíveis**

### ✅ **Core Features**
- ✅ Editor Monaco (VS Code)
- ✅ Chat com IA (Claude + GPT-4)
- ✅ Terminal integrado
- ✅ Git integration
- ✅ Upload de arquivos
- ✅ Sistema de projetos
- ✅ Interface responsiva
- ✅ Temas (Dark/Light)

### 🚧 **Features Avançadas**
- 🔄 Sistema de autenticação
- 🔄 Dashboard analytics
- 🔄 Deploy automático
- 🔄 Plugins/extensões
- 🔄 Colaboração em tempo real
- 🔄 Integração GitHub

---

## 🛠️ **Comandos Úteis**

### **Desenvolvimento**
```bash
npm run dev              # Servidor + Cliente
npm run server           # Apenas servidor
npm run client           # Apenas cliente
```

### **Produção**
```bash
npm run build            # Build do cliente
npm run build:production # Build otimizado
npm start                # Servidor produção
```

### **Deploy**
```bash
npm run deploy           # Deploy completo
npm run deploy:vercel    # Deploy Vercel
npm run deploy:netlify   # Deploy Netlify
npm run deploy:docker    # Deploy Docker
```

### **Testes**
```bash
npm test                 # Todos os testes
npm run test:server      # Testes servidor
npm run test:client      # Testes cliente
```

---

## 🐳 **Docker**

### **Build e Execução**
```bash
# Build da imagem
docker build -t codserver-super-app .

# Executar container
docker run -p 3001:3001 codserver-super-app
```

### **Docker Compose**
```bash
# Executar com MongoDB e Redis
docker-compose --profile database --profile cache up -d

# Apenas aplicação
docker-compose up -d
```

---

## 🔧 **Configurações Avançadas**

### **MongoDB** (Opcional)
```env
MONGODB_URI=mongodb://localhost:27017/codserver
```

### **Redis** (Opcional)
```env
REDIS_URL=redis://localhost:6379
```

### **Email** (Opcional)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
```

### **Segurança**
```env
JWT_SECRET=seu-jwt-secret-super-seguro
CORS_ORIGIN=*
ALLOWED_HOSTS=*
```

---

## 🆘 **Solução de Problemas**

### **Erro de API Key**
```bash
# Verificar arquivo .env
cat .env | grep API_KEY

# Verificar formato das chaves
# Anthropic: sk-ant-...
# OpenAI: sk-...
```

### **Porta ocupada**
```bash
# Mudar porta no .env
PORT=3002

# Ou matar processo na porta 3001
npx kill-port 3001
```

### **Dependências corrompidas**
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
cd client && rm -rf node_modules package-lock.json && npm install
```

### **Build falha**
```bash
# Verificar Node.js version
node --version  # Deve ser 18+

# Limpar cache
npm cache clean --force
```

---

## 📊 **Monitoramento**

### **Logs do Servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Docker
docker logs codserver
```

### **Métricas**
- Acesse: http://localhost:3001/health
- API Docs: http://localhost:3001/api-docs

---

## 🎉 **Pronto para Usar!**

Seu CODserver Super App está configurado com:
- 🤖 **IA integrada** (Claude + GPT-4)
- 💻 **Editor profissional** (Monaco)
- 🌐 **Backend robusto** (Express + Socket.IO)
- 🔐 **Segurança** (JWT + Helmet)
- 📁 **25+ ferramentas** open source

**Acesse**: http://localhost:3001

---

**🚀 Desenvolvido por Ricardo R. Pereira - Cyntreon**
