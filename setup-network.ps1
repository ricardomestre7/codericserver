# CODserver - Configuração de Rede
# by Ricardo R. Pereira - Cyntreon

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CODserver - Configuração de Rede" -ForegroundColor Yellow
Write-Host "   by Ricardo R. Pereira - Cyntreon" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Descobrir IP local
Write-Host "🔍 Descobrindo seu IP local..." -ForegroundColor Green
$networkAdapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*" }
$localIP = $networkAdapters[0].IPAddress

Write-Host ""
Write-Host "✅ Seu IP local é: $localIP" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Para acessar de outros dispositivos na rede:" -ForegroundColor Cyan
Write-Host "   📱 Celular/Tablet: http://$localIP`:3001" -ForegroundColor White
Write-Host "   💻 Outros PCs: http://$localIP`:3001" -ForegroundColor White
Write-Host ""

# Configurar firewall
Write-Host "🔥 Configurando firewall para permitir conexões na porta 3001..." -ForegroundColor Yellow
try {
    New-NetFirewallRule -DisplayName "CODserver" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow -ErrorAction Stop
    Write-Host "✅ Firewall configurado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Erro ao configurar firewall. Execute como administrador." -ForegroundColor Red
}

Write-Host ""
Write-Host "🚀 Para iniciar o CODserver:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📱 Depois acesse de qualquer dispositivo na rede:" -ForegroundColor Cyan
Write-Host "   http://$localIP`:3001" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Pressione Enter para continuar"
