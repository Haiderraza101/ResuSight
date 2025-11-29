@echo off
echo Starting ResuSight Backend Services...
echo.

REM Activate conda environment
call C:\Users\haide\miniconda3\Scripts\activate.bat resusight

echo Starting Flask API...
start "Flask API" cmd /k "cd backend\flask_api && python app.py"

timeout /t 3 /nobreak >nul

echo.
echo Flask API is starting...
echo Flask API: http://localhost:5000
echo.
echo Make sure to run the Next.js frontend in another terminal:
echo   cd resusight-frontend
echo   npm run dev
echo.
pause
