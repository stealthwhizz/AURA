@echo off
title AURA Startup Script
echo ====================================================
echo          Starting AURA System Components
echo ====================================================

:: 1. Start Blockchain Node
echo [1/5] Starting Blockchain Node...
start "AURA Blockchain Node" cmd /k "cd blockchain && npx hardhat node"

echo Waiting for blockchain to initialize...
timeout /t 5 >nul

:: 2. Deploy Contracts
echo [2/5] Deploying Smart Contracts...
call cd blockchain && npx hardhat run scripts/deploy.js --network localhost && cd ..
echo Contracts Deployed!

:: 3. Start Backend
echo [3/5] Starting Backend Server...
start "AURA Backend" cmd /k "cd backend && npm run dev"

:: 4. Start ML Model
echo [4/5] Starting ML Prediction Engine...
start "AURA ML Service" cmd /k "cd ml-model && call venv\Scripts\activate && python app.py"

:: 5. Start Frontend
echo [5/5] Starting Frontend...
start "AURA Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ====================================================
echo             ALL SYSTEMS GO! 🚀
echo ====================================================
echo.
echo Opening Dashboard in Browser...
timeout /t 5 >nul
start http://localhost:5173

echo.
echo Access Points:
echo ----------------------------------------------------
echo Frontend:   http://localhost:5173
echo Backend:    http://localhost:3000
echo ML API:     http://localhost:5000
echo Blockchain: http://localhost:8545
echo ====================================================
echo.
echo Press any key to close this launcher (services will keep running)...
pause
exit
