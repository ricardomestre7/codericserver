# 🚀 CODserver Super App - Deploy Manual Completo

## 🎯 **Opções de Deploy (Sem Vercel)**

### 1️⃣ **Netlify (Recomendado)**
```bash
# 1. Acesse: https://app.netlify.com/
# 2. Conecte com GitHub
# 3. Selecione: ricardomestre7/codericserver
# 4. Deploy automático!
```

### 2️⃣ **Railway**
```bash
# 1. Acesse: https://railway.app/
# 2. Conecte GitHub
# 3. Deploy automático
# 4. Adicione variáveis de ambiente
```

### 3️⃣ **Render**
```bash
# 1. Acesse: https://render.com/
# 2. Conecte GitHub
# 3. Deploy automático
# 4. Configuração simples
```

### 4️⃣ **Seu Próprio Servidor**
```bash
# 1. Clone o projeto
git clone https://github.com/ricardomestre7/codericserver.git
cd codericserver

# 2. Execute o script de deploy
chmod +x deploy-manual.sh
./deploy-manual.sh

# 3. Configure variáveis de ambiente
cp env-template.txt .env
# Edite o .env com suas chaves

# 4. Execute
npm start
```

### 5️⃣ **Docker (Qualquer Servidor)**
```bash
# 1. Build da imagem
docker build -t codserver-super-app .

# 2. Executar container
docker run -d -p 3001:3001 --name codserver codserver-super-app

# 3. Ou usar docker-compose
docker-compose up -d
```

## 🔧 **Configuração Rápida**

### **Variáveis de Ambiente Necessárias:**
```env
NODE_ENV=production
PORT=3001
ANTHROPIC_API_KEY=sk-ant-SUA-CHAVE-AQUI
OPENAI_API_KEY=sk-SUA-CHAVE-AQUI
```

### **Comandos Essenciais:**
```bash
npm install                    # Instalar dependências
npm run build:production       # Build de produção
npm start                      # Executar servidor
```

## 🌐 **URLs de Acesso**

Após o deploy, acesse:
- **Local**: http://localhost:3001
- **Servidor**: http://SEU_IP:3001
- **Domínio**: http://codserver.seu-dominio.com

## 🆘 **Solução de Problemas**

### **Erro de Porta:**
```bash
# Mudar porta
export PORT=3002
npm start
```

### **Erro de Dependências:**
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### **Erro de Build:**
```bash
# Build manual
cd client
npm run build
cd ..
```

## 🎉 **Pronto!**

Seu CODserver Super App funcionará em qualquer uma dessas opções!
