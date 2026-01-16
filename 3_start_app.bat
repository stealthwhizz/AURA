@echo off
title AURA Application Services
echo ====================================================
echo Starting Application Services (Backend, Frontend, ML)
echo ====================================================

:: 1. Start Backend
echo Starting Backend...
start "AURA Backend" cmd /k "cd backend && npm start"

:: 2. Start ML Model
echo Starting ML Service...
start "AURA ML Service" cmd /k "cd ml-model && call venv\Scripts\activate && python app.py"

:: 3. Start Frontend
echo Starting Frontend...
start "AURA Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ====================================================
echo Services Started!
echo ----------------------------------------------------
echo Frontend:   http://localhost:5173
echo Backend:    http://localhost:3000
echo ML API:     http://localhost:5000
echo ====================================================
echo.
echo Opening Dashboard...
timeout /t 5 >nul
start http://localhost:5173

pause
