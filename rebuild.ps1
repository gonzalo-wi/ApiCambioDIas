# Script para reconstruir y reiniciar los contenedores
Write-Host "🛑 Deteniendo contenedores..." -ForegroundColor Yellow
docker-compose down

Write-Host "🔨 Reconstruyendo contenedores..." -ForegroundColor Cyan
docker-compose build --no-cache proxy-backend

Write-Host "🚀 Iniciando contenedores..." -ForegroundColor Green
docker-compose up -d

Write-Host "⏳ Esperando 5 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "📋 Logs del proxy:" -ForegroundColor Magenta
docker logs apicambiodias-proxy-backend-1 --tail 20

Write-Host "`n✅ Proceso completado!" -ForegroundColor Green
Write-Host "Puedes ver los logs en tiempo real con:" -ForegroundColor White
Write-Host "docker logs -f apicambiodias-proxy-backend-1" -ForegroundColor Gray
