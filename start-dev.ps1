# Script para iniciar o servidor de desenvolvimento
Write-Host "Iniciando servidor de desenvolvimento..." -ForegroundColor Green

# Matar processos node existentes
try {
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "Processos Node.js anteriores terminados" -ForegroundColor Yellow
} catch {
    Write-Host "Nenhum processo Node.js ativo encontrado" -ForegroundColor Gray
}

# Limpar cache
Write-Host "Limpando cache..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

# Instalar dependências se necessário
if (!(Test-Path "node_modules")) {
    Write-Host "Instalando dependências..." -ForegroundColor Blue
    npm install
}

# Iniciar servidor
Write-Host "Iniciando Next.js..." -ForegroundColor Green
npm run dev
