#!/bin/bash

# 🚀 CODserver Ultimate - Deploy Automático
# by Ricardo R. Pereira - Cyntreon

echo ""
echo "🚀 ========================================"
echo "   CODserver Ultimate - Deploy Automático"
echo "   by Ricardo R. Pereira - Cyntreon"
echo "========================================"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para perguntar
ask() {
    echo -e "${CYAN}$1${NC}"
    read -p "Digite sua resposta: " response
    echo $response
}

# Função para mostrar status
status() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script na raiz do projeto CODserver"
    exit 1
fi

echo -e "${PURPLE}🎯 Escolha sua opção de deploy:${NC}"
echo "1) 🐙 GitHub + Vercel (Recomendado)"
echo "2) 🐙 GitHub + Netlify"
echo "3) 🏠 Apenas seu domínio"
echo "4) 📦 Preparar para todos"
echo ""

choice=$(ask "Digite sua escolha (1-4):")

case $choice in
    1)
        echo -e "${BLUE}🐙 Configurando GitHub + Vercel...${NC}"
        
        # GitHub
        github_user=$(ask "Seu usuário do GitHub:")
        repo_name=$(ask "Nome do repositório (ex: codserver-ultimate):")
        
        echo -e "${YELLOW}📝 Criando repositório GitHub...${NC}"
        git init
        git add .
        git commit -m "🚀 CODserver Ultimate - Editor com IA"
        git branch -M main
        git remote add origin https://github.com/$github_user/$repo_name.git
        
        echo -e "${YELLOW}📤 Fazendo push para GitHub...${NC}"
        git push -u origin main
        
        status "Repositório GitHub criado!"
        
        # Vercel
        echo -e "${YELLOW}⚡ Configurando Vercel...${NC}"
        npm install -g vercel
        vercel --prod
        
        status "Deploy no Vercel concluído!"
        echo -e "${GREEN}🌐 Seu CODserver estará disponível em: https://$repo_name.vercel.app${NC}"
        ;;
        
    2)
        echo -e "${BLUE}🐙 Configurando GitHub + Netlify...${NC}"
        
        # GitHub
        github_user=$(ask "Seu usuário do GitHub:")
        repo_name=$(ask "Nome do repositório (ex: codserver-ultimate):")
        
        echo -e "${YELLOW}📝 Criando repositório GitHub...${NC}"
        git init
        git add .
        git commit -m "🚀 CODserver Ultimate - Editor com IA"
        git branch -M main
        git remote add origin https://github.com/$github_user/$repo_name.git
        
        echo -e "${YELLOW}📤 Fazendo push para GitHub...${NC}"
        git push -u origin main
        
        status "Repositório GitHub criado!"
        
        # Netlify
        echo -e "${YELLOW}🌐 Configurando Netlify...${NC}"
        npm install -g netlify-cli
        netlify deploy --prod
        
        status "Deploy no Netlify concluído!"
        echo -e "${GREEN}🌐 Seu CODserver estará disponível em: https://$repo_name.netlify.app${NC}"
        ;;
        
    3)
        echo -e "${BLUE}🏠 Preparando para seu domínio...${NC}"
        
        domain=$(ask "Seu domínio (ex: codserver.seudominio.com):")
        
        echo -e "${YELLOW}📦 Fazendo build de produção...${NC}"
        npm run build:production
        
        echo -e "${YELLOW}📁 Criando arquivo de upload...${NC}"
        tar -czf codserver-ultimate.tar.gz client/build/
        
        status "Build concluído!"
        echo -e "${GREEN}📁 Arquivo criado: codserver-ultimate.tar.gz${NC}"
        echo -e "${CYAN}📋 Próximos passos:${NC}"
        echo "1. Faça upload do arquivo para seu servidor"
        echo "2. Extraia na pasta public_html"
        echo "3. Configure as variáveis de ambiente"
        echo "4. Acesse: https://$domain"
        ;;
        
    4)
        echo -e "${BLUE}📦 Preparando para todos os deploys...${NC}"
        
        github_user=$(ask "Seu usuário do GitHub:")
        repo_name=$(ask "Nome do repositório (ex: codserver-ultimate):")
        domain=$(ask "Seu domínio (opcional):")
        
        # Preparar arquivos
        echo -e "${YELLOW}📝 Preparando arquivos...${NC}"
        cp package-github.json package.json
        cp README-GitHub.md README.md
        
        # GitHub
        echo -e "${YELLOW}🐙 Configurando GitHub...${NC}"
        git init
        git add .
        git commit -m "🚀 CODserver Ultimate - Editor com IA"
        git branch -M main
        git remote add origin https://github.com/$github_user/$repo_name.git
        
        # Build
        echo -e "${YELLOW}📦 Fazendo build...${NC}"
        npm run build:production
        
        # Arquivos de deploy
        echo -e "${YELLOW}📁 Criando arquivos de deploy...${NC}"
        tar -czf codserver-ultimate.tar.gz client/build/
        
        status "Preparação concluída!"
        echo -e "${GREEN}🎉 Tudo pronto para deploy!${NC}"
        echo ""
        echo -e "${CYAN}📋 URLs disponíveis:${NC}"
        echo "🐙 GitHub: https://github.com/$github_user/$repo_name"
        echo "⚡ Vercel: https://$repo_name.vercel.app"
        echo "🌐 Netlify: https://$repo_name.netlify.app"
        if [ ! -z "$domain" ]; then
            echo "🏠 Seu domínio: https://$domain"
        fi
        echo ""
        echo -e "${YELLOW}📁 Arquivo para seu domínio: codserver-ultimate.tar.gz${NC}"
        ;;
        
    *)
        error "Opção inválida!"
        exit 1
        ;;
esac

echo ""
echo -e "${PURPLE}🎯 Próximos passos:${NC}"
echo "1. Configure suas API Keys nas configurações"
echo "2. Teste todas as funcionalidades"
echo "3. Compartilhe com outros desenvolvedores!"
echo ""
echo -e "${GREEN}🚀 CODserver Ultimate está pronto!${NC}"
echo -e "${CYAN}Desenvolvido com ❤️ by Ricardo R. Pereira - Cyntreon${NC}"
echo ""
