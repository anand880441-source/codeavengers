Write-Host "🚀 Starting Analytics (Python + FastAPI)..." -ForegroundColor Magenta
Write-Host "📍 http://localhost:8000" -ForegroundColor Gray
Write-Host "📍 Docs: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host ""
Set-Location "advisor-analytics"
if (Test-Path "venv\Scripts\Activate.ps1") {
    & .\venv\Scripts\Activate.ps1
    uvicorn main:app --reload --port 8000
} else {
    Write-Host "⚠️  Virtual environment not found. Run '.\setup.ps1' first." -ForegroundColor Red
}
