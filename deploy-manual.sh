#!/bin/bash

# 🚀 CODserver Super App - Deploy Manual Simples
# Funciona em qualquer servidor com Node.js

echo "🚀 Iniciando deploy do CODserver Super App..."

# 1. Instalar dependências
echo "📦 Instalando dependências..."
npm install
cd client && npm install && cd ..

# 2. Build de produção
echo "🔨 Fazendo build de produção..."
npm run build:production

# 3. Criar arquivo de inicialização
echo "📝 Criando arquivo de inicialização..."
cat > start.sh << 'EOF'
#!/bin/bash
export NODE_ENV=production
export PORT=${PORT:-3001}
node server/index.js
EOF

chmod +x start.sh

# 4. Criar arquivo PM2 (opcional)
echo "📝 Criando configuração PM2..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'codserver-super-app',
    script: 'server/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# 5. Criar diretório de logs
mkdir -p logs

echo "✅ Deploy preparado!"
echo "🌐 Para executar:"
echo "   npm start"
echo "   ou ./start.sh"
echo "   ou pm2 start ecosystem.config.js"
