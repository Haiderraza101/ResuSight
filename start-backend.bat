@echo off
echo Starting ResuSight Backend Services...
echo.

echo Starting Flask API...
start "Flask API" cmd /k "cd backend\flask_api && python app.py"

timeout /t 3 /nobreak >nul

echo Starting Express.js Server...
start "Express Server" cmd /k "cd backend && npm run dev"

echo.
echo Both services are starting...
echo Flask API: http://localhost:5001
echo Express Server: http://localhost:5000
echo.
pause

