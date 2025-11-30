@echo off
REM Start ResuSight Frontend Application
REM This script starts the Next.js development server on port 3000

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║      ResuSight - Frontend Application Startup Script        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Navigate to frontend directory
cd /d "%~dp0resusight-frontend"
if errorlevel 1 (
    echo ❌ Error: Could not navigate to frontend directory
    pause
    exit /b 1
)

echo ✅ Navigated to: %cd%
echo.

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    echo This may take a few minutes on first run...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo ❌ Error: npm install failed
        pause
        exit /b 1
    )
)

echo.
echo Starting Next.js development server...
echo.
echo 🌐 Application will be available at: http://localhost:3000
echo 📍 API will connect to: http://localhost:5001
echo.
echo ⚠️  Make sure the backend server is running!
echo    Run start-backend.bat in another terminal
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev

pause
