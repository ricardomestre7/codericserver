#!/usr/bin/env node

/**
 * 🚀 CODserver Super App - Script de Deploy
 * Automatiza o processo de deploy para diferentes plataformas
 */

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    log(`❌ Erro ao executar: ${command}`, 'red');
    process.exit(1);
  }
}

async function deploy() {
  log('🚀 CODserver Super App - Deploy Automático', 'cyan');
  log('==========================================', 'cyan');

  // Verificar se estamos na pasta correta
  if (!fs.existsSync('package.json')) {
    log('❌ Execute este script na pasta raiz do projeto', 'red');
    process.exit(1);
  }

  // Verificar arquivo .env
  if (!fs.existsSync('.env')) {
    log('⚠️ Arquivo .env não encontrado', 'yellow');
    log('📝 Copiando template...', 'blue');
    if (fs.existsSync('env-template.txt')) {
      fs.copySync('env-template.txt', '.env');
      log('✅ Arquivo .env criado. Configure suas chaves de API!', 'green');
    }
  }

  const platform = process.argv[2] || 'local';

  switch (platform) {
    case 'vercel':
      await deployVercel();
      break;
    case 'netlify':
      await deployNetlify();
      break;
    case 'docker':
      await deployDocker();
      break;
    case 'server':
      await deployServer();
      break;
    default:
      await deployLocal();
  }
}

async function deployLocal() {
  log('🏠 Deploy Local', 'blue');
  
  log('📦 Instalando dependências...', 'yellow');
  exec('npm install');
  
  log('📦 Instalando dependências do cliente...', 'yellow');
  exec('cd client && npm install');
  
  log('🔨 Fazendo build de produção...', 'yellow');
  exec('npm run build:production');
  
  log('✅ Deploy local concluído!', 'green');
  log('🌐 Acesse: http://localhost:3001', 'cyan');
  log('▶️ Execute: npm start', 'cyan');
}

async function deployVercel() {
  log('⚡ Deploy Vercel', 'blue');
  
  // Verificar se Vercel CLI está instalado
  try {
    execSync('vercel --version', { stdio: 'pipe' });
  } catch {
    log('📦 Instalando Vercel CLI...', 'yellow');
    exec('npm install -g vercel');
  }
  
  log('🔨 Fazendo build...', 'yellow');
  exec('npm run build:production');
  
  log('🚀 Deployando para Vercel...', 'yellow');
  exec('vercel --prod');
  
  log('✅ Deploy Vercel concluído!', 'green');
}

async function deployNetlify() {
  log('🌐 Deploy Netlify', 'blue');
  
  // Verificar se Netlify CLI está instalado
  try {
    execSync('netlify --version', { stdio: 'pipe' });
  } catch {
    log('📦 Instalando Netlify CLI...', 'yellow');
    exec('npm install -g netlify-cli');
  }
  
  log('🔨 Fazendo build...', 'yellow');
  exec('npm run build:production');
  
  log('🚀 Deployando para Netlify...', 'yellow');
  exec('netlify deploy --prod');
  
  log('✅ Deploy Netlify concluído!', 'green');
}

async function deployDocker() {
  log('🐳 Deploy Docker', 'blue');
  
  log('🔨 Fazendo build da imagem Docker...', 'yellow');
  exec('docker build -t codserver-super-app .');
  
  log('🚀 Executando container...', 'yellow');
  exec('docker run -d -p 3001:3001 --name codserver codserver-super-app');
  
  log('✅ Deploy Docker concluído!', 'green');
  log('🌐 Acesse: http://localhost:3001', 'cyan');
}

async function deployServer() {
  log('🏠 Deploy Servidor Próprio', 'blue');
  
  const serverPath = process.argv[3];
  if (!serverPath) {
    log('❌ Especifique o caminho do servidor:', 'red');
    log('📝 Uso: npm run deploy server usuario@servidor.com:/var/www/html/', 'yellow');
    process.exit(1);
  }
  
  log('🔨 Fazendo build...', 'yellow');
  exec('npm run build:production');
  
  log('📤 Enviando arquivos...', 'yellow');
  exec(`rsync -av client/build/* ${serverPath}`);
  
  log('✅ Deploy para servidor concluído!', 'green');
}

// Executar deploy
deploy().catch(error => {
  log(`❌ Erro no deploy: ${error.message}`, 'red');
  process.exit(1);
});
