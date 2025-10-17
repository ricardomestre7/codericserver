# 🚀 CODserver Ultimate - Deploy Automático (Windows)
# by Ricardo R. Pereira - Cyntreon

Write-Host ""
Write-Host "🚀 ========================================" -ForegroundColor Cyan
Write-Host "   CODserver Ultimate - Deploy Automático" -ForegroundColor Yellow
Write-Host "   by Ricardo R. Pereira - Cyntreon" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Execute este script na raiz do projeto CODserver" -ForegroundColor Red
    exit 1
}

Write-Host "🎯 Escolha sua opção de deploy:" -ForegroundColor Magenta
Write-Host "1) 🐙 GitHub + Vercel (Recomendado)" -ForegroundColor White
Write-Host "2) 🐙 GitHub + Netlify" -ForegroundColor White
Write-Host "3) 🏠 Apenas seu domínio" -ForegroundColor White
Write-Host "4) 📦 Preparar para todos" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Digite sua escolha (1-4)"

switch ($choice) {
    "1" {
        Write-Host "🐙 Configurando GitHub + Vercel..." -ForegroundColor Blue
        
        $github_user = Read-Host "Seu usuário do GitHub"
        $repo_name = Read-Host "Nome do repositório (ex: codserver-ultimate)"
        
        Write-Host "📝 Criando repositório GitHub..." -ForegroundColor Yellow
        git init
        git add .
        git commit -m "🚀 CODserver Ultimate - Editor com IA"
        git branch -M main
        git remote add origin "https://github.com/$github_user/$repo_name.git"
        
        Write-Host "📤 Fazendo push para GitHub..." -ForegroundColor Yellow
        git push -u origin main
        
        Write-Host "✅ Repositório GitHub criado!" -ForegroundColor Green
        
        Write-Host "⚡ Configurando Vercel..." -ForegroundColor Yellow
        npm install -g vercel
        vercel --prod
        
        Write-Host "✅ Deploy no Vercel concluído!" -ForegroundColor Green
        Write-Host "🌐 Seu CODserver estará disponível em: https://$repo_name.vercel.app" -ForegroundColor Green
    }
    
    "2" {
        Write-Host "🐙 Configurando GitHub + Netlify..." -ForegroundColor Blue
        
        $github_user = Read-Host "Seu usuário do GitHub"
        $repo_name = Read-Host "Nome do repositório (ex: codserver-ultimate)"
        
        Write-Host "📝 Criando repositório GitHub..." -ForegroundColor Yellow
        git init
        git add .
        git commit -m "🚀 CODserver Ultimate - Editor com IA"
        git branch -M main
        git remote add origin "https://github.com/$github_user/$repo_name.git"
        
        Write-Host "📤 Fazendo push para GitHub..." -ForegroundColor Yellow
        git push -u origin main
        
        Write-Host "✅ Repositório GitHub criado!" -ForegroundColor Green
        
        Write-Host "🌐 Configurando Netlify..." -ForegroundColor Yellow
        npm install -g netlify-cli
        netlify deploy --prod
        
        Write-Host "✅ Deploy no Netlify concluído!" -ForegroundColor Green
        Write-Host "🌐 Seu CODserver estará disponível em: https://$repo_name.netlify.app" -ForegroundColor Green
    }
    
    "3" {
        Write-Host "🏠 Preparando para seu domínio..." -ForegroundColor Blue
        
        $domain = Read-Host "Seu domínio (ex: codserver.seudominio.com)"
        
        Write-Host "📦 Fazendo build de produção..." -ForegroundColor Yellow
        npm run build:production
        
        Write-Host "📁 Criando arquivo de upload..." -ForegroundColor Yellow
        Compress-Archive -Path "client/build/*" -DestinationPath "codserver-ultimate.zip"
        
        Write-Host "✅ Build concluído!" -ForegroundColor Green
        Write-Host "📁 Arquivo criado: codserver-ultimate.zip" -ForegroundColor Green
        Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
        Write-Host "1. Faça upload do arquivo para seu servidor" -ForegroundColor White
        Write-Host "2. Extraia na pasta public_html" -ForegroundColor White
        Write-Host "3. Configure as variáveis de ambiente" -ForegroundColor White
        Write-Host "4. Acesse: https://$domain" -ForegroundColor White
    }
    
    "4" {
        Write-Host "📦 Preparando para todos os deploys..." -ForegroundColor Blue
        
        $github_user = Read-Host "Seu usuário do GitHub"
        $repo_name = Read-Host "Nome do repositório (ex: codserver-ultimate)"
        $domain = Read-Host "Seu domínio (opcional)"
        
        Write-Host "📝 Preparando arquivos..." -ForegroundColor Yellow
        Copy-Item "package-github.json" "package.json"
        Copy-Item "README-GitHub.md" "README.md"
        
        Write-Host "🐙 Configurando GitHub..." -ForegroundColor Yellow
        git init
        git add .
        git commit -m "🚀 CODserver Ultimate - Editor com IA"
        git branch -M main
        git remote add origin "https://github.com/$github_user/$repo_name.git"
        
        Write-Host "📦 Fazendo build..." -ForegroundColor Yellow
        npm run build:production
        
        Write-Host "📁 Criando arquivos de deploy..." -ForegroundColor Yellow
        Compress-Archive -Path "client/build/*" -DestinationPath "codserver-ultimate.zip"
        
        Write-Host "✅ Preparação concluída!" -ForegroundColor Green
        Write-Host "🎉 Tudo pronto para deploy!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 URLs disponíveis:" -ForegroundColor Cyan
        Write-Host "🐙 GitHub: https://github.com/$github_user/$repo_name" -ForegroundColor White
        Write-Host "⚡ Vercel: https://$repo_name.vercel.app" -ForegroundColor White
        Write-Host "🌐 Netlify: https://$repo_name.netlify.app" -ForegroundColor White
        if ($domain) {
            Write-Host "🏠 Seu domínio: https://$domain" -ForegroundColor White
        }
        Write-Host ""
        Write-Host "📁 Arquivo para seu domínio: codserver-ultimate.zip" -ForegroundColor Yellow
    }
    
    default {
        Write-Host "❌ Opção inválida!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎯 Próximos passos:" -ForegroundColor Magenta
Write-Host "1. Configure suas API Keys nas configurações" -ForegroundColor White
Write-Host "2. Teste todas as funcionalidades" -ForegroundColor White
Write-Host "3. Compartilhe com outros desenvolvedores!" -ForegroundColor White
Write-Host ""
Write-Host "🚀 CODserver Ultimate está pronto!" -ForegroundColor Green
Write-Host "Desenvolvido com ❤️ by Ricardo R. Pereira - Cyntreon" -ForegroundColor Cyan
Write-Host ""
