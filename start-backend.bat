@echo off
REM Start ResuSight Backend Flask API
REM This script starts the Flask server on port 5001

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║      ResuSight - Backend API Server Startup Script          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python is not installed or not in PATH
    echo Please install Python and add it to your system PATH
    pause
    exit /b 1
)

REM Navigate to backend directory
cd /d "%~dp0resusight-backend"
if errorlevel 1 (
    echo ❌ Error: Could not navigate to backend directory
    pause
    exit /b 1
)

echo ✅ Navigated to: %cd%
echo.
echo Starting Flask API server...
echo.
echo 📍 API will be available at: http://localhost:5001
echo 🏥 Health check: http://localhost:5001/health
echo.
echo Press Ctrl+C to stop the server
echo.

REM Install requirements if needed
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install requirements
if exist "requirements.txt" (
    echo Installing dependencies...
    pip install -r requirements.txt >nul 2>&1
)

REM Run the Flask app
python run.py
if errorlevel 1 (
    echo.
    echo ❌ Error: Flask app failed to start
    echo Please check the error messages above
    pause
    exit /b 1
)

pause
