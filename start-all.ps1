Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 Starting ALL Services..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

 = "C:\Users\Kishan Suthar\OneDrive\Desktop\advisor-project"

Write-Host "📱 Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ''; .\start-frontend.ps1"
Start-Sleep -Seconds 2

Write-Host "🔧 Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ''; .\start-backend.ps1"
Start-Sleep -Seconds 2

Write-Host "📊 Starting Analytics..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ''; .\start-analytics.ps1"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📊 Analytics: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Make sure Ollama is running:" -ForegroundColor Yellow
Write-Host "   'ollama serve' in a separate terminal" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 To stop all services, close each terminal window." -ForegroundColor Red
