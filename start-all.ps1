$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Split-Path -Parent $MyInvocation.MyCommand.Path)).Path

function Start-ServiceInCurrentTerminal {
    param(
        [Parameter(Mandatory = $true)]
        [string]$WorkingDirectory,

        [Parameter(Mandatory = $true)]
        [string]$Command,

        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    Write-Host "▶ Starting $Label..." -ForegroundColor Yellow
    Start-Process powershell -NoNewWindow -WorkingDirectory $WorkingDirectory -ArgumentList @('-NoLogo', '-NoExit', '-Command', $Command) | Out-Null
    Write-Host "✅ $Label startup command sent to the current terminal" -ForegroundColor Green
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  🚀 Starting AI Mutual Fund Advisor" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Checking MongoDB..." -ForegroundColor Yellow
try {
    $null = Invoke-WebRequest -Uri "http://localhost:27017" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ MongoDB is running locally" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  MongoDB not running locally. Using MongoDB Atlas (cloud)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "🤖 Starting Ollama..." -ForegroundColor Yellow
Start-ServiceInCurrentTerminal -WorkingDirectory $repoRoot -Command 'ollama serve' -Label 'Ollama'
Start-Sleep -Seconds 2
Write-Host ""

Write-Host "📊 Starting Analytics Service..." -ForegroundColor Yellow
$analyticsPath = Join-Path $repoRoot 'advisor-analytics'
$venvActivate = Join-Path $analyticsPath 'venv/Scripts/Activate.ps1'
if (-not (Test-Path $venvActivate)) {
    $venvActivate = Join-Path $analyticsPath '.venv/Scripts/Activate.ps1'
}
if (-not (Test-Path $venvActivate)) {
    Write-Host "⚠️  Python virtual environment activation script was not found. Please run the setup steps first." -ForegroundColor Yellow
}
else {
    $analyticsCommand = "& '$venvActivate'; uvicorn main:app --reload --port 8000"
    Start-ServiceInCurrentTerminal -WorkingDirectory $analyticsPath -Command $analyticsCommand -Label 'Analytics'
}
Start-Sleep -Seconds 2
Write-Host ""

Write-Host "🔧 Starting Backend Service..." -ForegroundColor Yellow
Start-ServiceInCurrentTerminal -WorkingDirectory (Join-Path $repoRoot 'advisor-backend') -Command 'node server.js' -Label 'Backend'
Start-Sleep -Seconds 2
Write-Host ""

Write-Host "🎨 Starting Frontend..." -ForegroundColor Yellow
Start-ServiceInCurrentTerminal -WorkingDirectory (Join-Path $repoRoot 'advisor-frontend') -Command 'npm run dev' -Label 'Frontend'
Start-Sleep -Seconds 2
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Startup commands were sent to the current terminal" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📊 Analytics: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "🔍 Health Check: http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  If you want each service in its own VS Code terminal pane, run the commands manually from the integrated terminal." -ForegroundColor Yellow
