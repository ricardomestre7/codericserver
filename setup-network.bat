@echo off
echo.
echo ========================================
echo   CODserver - Configuracao de Rede
echo   by Ricardo R. Pereira - Cyntreon
echo ========================================
echo.

echo 🔍 Descobrindo seu IP local...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set LOCAL_IP=%%b
        goto :found
    )
)
:found

echo.
echo ✅ Seu IP local e: %LOCAL_IP%
echo.
echo 🌐 Para acessar de outros dispositivos na rede:
echo    📱 Celular/Tablet: http://%LOCAL_IP%:3001
echo    💻 Outros PCs: http://%LOCAL_IP%:3001
echo.

echo 🔥 Configurando firewall para permitir conexoes na porta 3001...
netsh advfirewall firewall add rule name="CODserver" dir=in action=allow protocol=TCP localport=3001
if %errorlevel% equ 0 (
    echo ✅ Firewall configurado com sucesso!
) else (
    echo ⚠️ Erro ao configurar firewall. Execute como administrador.
)

echo.
echo 🚀 Para iniciar o CODserver:
echo    npm run dev
echo.
echo 📱 Depois acesse de qualquer dispositivo na rede:
echo    http://%LOCAL_IP%:3001
echo.
echo ========================================
pause
