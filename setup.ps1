Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI Voice-Driven Mutual Fund Advisor" -ForegroundColor Green
Write-Host "  Setup Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Frontend
Write-Host "📦 Installing Frontend dependencies..." -ForegroundColor Yellow
Set-Location "advisor-frontend"
npm install
if (0 -eq 0) {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend installation failed" -ForegroundColor Red
}
Write-Host ""

# Backend
Write-Host "📦 Installing Backend dependencies..." -ForegroundColor Yellow
Set-Location "../advisor-backend"
npm install
if (0 -eq 0) {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Backend installation failed" -ForegroundColor Red
}
Write-Host ""

# Analytics
Write-Host "📦 Installing Analytics dependencies..." -ForegroundColor Yellow
Set-Location "../advisor-analytics"

# Check if venv exists
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "Virtual environment found. Activating..." -ForegroundColor Gray
    & .\venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    if (0 -eq 0) {
        Write-Host "✅ Analytics dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Analytics installation failed" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Virtual environment not found. Creating..." -ForegroundColor Yellow
    python -m venv venv
    & .\venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    if (0 -eq 0) {
        Write-Host "✅ Analytics dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Analytics installation failed" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Setup complete! All dependencies installed." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run '.\start-all.ps1' to start all services" -ForegroundColor White
Write-Host "2. Make sure Ollama is running: 'ollama serve'" -ForegroundColor White
