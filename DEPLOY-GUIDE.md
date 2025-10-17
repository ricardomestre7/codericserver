# 🚀 CODserver Ultimate - Deploy Guide

## 📋 Passos para Deploy

### 1. 🐙 GitHub
```bash
# Criar repositório no GitHub
git init
git add .
git commit -m "🚀 CODserver Ultimate - Editor com IA"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/codserver-ultimate.git
git push -u origin main
```

### 2. ⚡ Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Ou usar botão no GitHub:
# [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SEU-USUARIO/codserver-ultimate)
```

### 3. 🌐 Netlify (Alternativo)
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Ou usar botão no GitHub:
# [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/SEU-USUARIO/codserver-ultimate)
```

### 4. 🏠 Seu Domínio Próprio

#### Opção A: Download Direto
```bash
# Download do build
wget https://github.com/SEU-USUARIO/codserver-ultimate/archive/main.zip
unzip main.zip
cd codserver-ultimate-main
npm install
npm run build:production

# Upload para public_html
rsync -av client/build/* usuario@seu-dominio.com:/public_html/
```

#### Opção B: Git Clone
```bash
# No seu servidor
cd /public_html
git clone https://github.com/SEU-USUARIO/codserver-ultimate.git
cd codserver-ultimate
npm install
npm run build:production
cp -r client/build/* ../
```

#### Opção C: Subdomain
```bash
# Criar subdomain codserver.seu-dominio.com
# Apontar para pasta codserver/
# Upload do projeto lá
```

## 🔧 Configuração

### Variáveis de Ambiente
```env
# .env
ANTHROPIC_API_KEY=sk-ant-SUA-CHAVE-AQUI
OPENAI_API_KEY=sk-SUA-CHAVE-AQUI
NODE_ENV=production
PORT=3001
```

### .htaccess (Apache)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Headers de segurança
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
```

### nginx.conf (Nginx)
```nginx
location / {
    try_files $uri $uri/ /index.html;
}

# Headers de segurança
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
```

## 🎯 URLs Finais

- **Vercel**: `https://codserver-ultimate.vercel.app`
- **Netlify**: `https://codserver-ultimate.netlify.app`
- **Seu Domínio**: `https://codserver.seu-dominio.com`
- **GitHub Pages**: `https://SEU-USUARIO.github.io/codserver-ultimate`

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build:production

# Deploy Vercel
npm run deploy:vercel

# Deploy Netlify
npm run deploy:netlify

# Deploy GitHub Pages
npm run deploy:github
```

## 🔄 Atualizações

```bash
# Atualizar código
git add .
git commit -m "✨ Nova funcionalidade"
git push

# Vercel atualiza automaticamente
# Netlify atualiza automaticamente
# Seu domínio: fazer novo upload
```

---

**🎉 Pronto! Seu CODserver Ultimate estará online!**
