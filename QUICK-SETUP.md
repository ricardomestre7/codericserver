# 🚀 CODserver Super App - Guia de Configuração Rápida

## ⚡ Setup em 5 Minutos

### 1️⃣ **Clone e Instale**
```bash
git clone https://github.com/cyntreon/codserver-super-app.git
cd codserver-super-app
npm install
cd client && npm install && cd ..
```

### 2️⃣ **Configure APIs**
```bash
# Copie o template
cp env-template.txt .env

# Edite com suas chaves
nano .env
```

### 3️⃣ **Execute**
```bash
npm run dev
```

### 4️⃣ **Acesse**
- **Local**: http://localhost:3001
- **Rede**: http://SEU_IP:3001

---

## 🔑 **Chaves de API Necessárias**

### **Anthropic Claude** (Recomendado)
1. Acesse: https://console.anthropic.com/
2. Crie conta gratuita
3. Gere API key
4. Adicione no `.env`:
```env
ANTHROPIC_API_KEY=sk-ant-SUA-CHAVE-AQUI
```

### **OpenAI GPT-4** (Opcional)
1. Acesse: https://platform.openai.com/
2. Crie conta
3. Adicione créditos ($5 mínimo)
4. Gere API key
5. Adicione no `.env`:
```env
OPENAI_API_KEY=sk-SUA-CHAVE-AQUI
```

---

## 🎯 **Funcionalidades Principais**

### ✅ **Já Funcionando**
- ✅ Editor Monaco (VS Code)
- ✅ Chat com IA (Claude + GPT-4)
- ✅ Terminal integrado
- ✅ Git integration
- ✅ Upload de arquivos
- ✅ Sistema de projetos
- ✅ Interface responsiva

### 🚧 **Em Desenvolvimento**
- 🔄 Sistema de autenticação
- 🔄 Dashboard analytics
- 🔄 Deploy automático
- 🔄 Plugins/extensões

---

## 🛠️ **Comandos Úteis**

```bash
# Desenvolvimento
npm run dev              # Servidor + Cliente
npm run server           # Apenas servidor
npm run client           # Apenas cliente

# Produção
npm run build            # Build do cliente
npm run build:production # Build otimizado
npm start                # Servidor produção

# Testes
npm test                 # Todos os testes
npm run test:server      # Testes servidor
npm run test:client      # Testes cliente

# Deploy
npm run deploy           # Deploy completo
npm run docker:build     # Build Docker
npm run docker:run       # Executar Docker
```

---

## 🌐 **Deploy Rápido**

### **Vercel** (Mais Fácil)
```bash
npm i -g vercel
vercel --prod
```

### **Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### **Seu Servidor**
```bash
npm run build:production
# Upload client/build/* para public_html/
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

---

## 📱 **Acesso Mobile**

O CODserver funciona perfeitamente em:
- 📱 **Smartphones** - Interface responsiva
- 📱 **Tablets** - Layout adaptativo
- 💻 **Desktop** - Experiência completa
- 🌐 **Qualquer navegador** - Chrome, Firefox, Safari, Edge

---

## 🆘 **Problemas Comuns**

### **Erro de API Key**
```bash
# Verifique se o .env existe
ls -la .env

# Verifique se as chaves estão corretas
cat .env | grep API_KEY
```

### **Porta ocupada**
```bash
# Mude a porta no .env
PORT=3002
```

### **Dependências**
```bash
# Reinstale tudo
rm -rf node_modules package-lock.json
npm install
cd client && rm -rf node_modules package-lock.json && npm install
```

---

## 🎉 **Pronto!**

Seu CODserver Super App está funcionando com:
- 🤖 **IA integrada** (Claude + GPT-4)
- 💻 **Editor profissional** (Monaco)
- 🌐 **Backend robusto** (Express + Socket.IO)
- 🔐 **Segurança** (JWT + Helmet)
- 📁 **25+ ferramentas** open source

**Acesse**: http://localhost:3001

---

**🚀 Desenvolvido por Ricardo R. Pereira - Cyntreon**
