@echo off
title AURA Cleanup
echo ====================================================
echo KILLING ALL NODE.JS AND PYTHON PROCESSES
echo ====================================================
echo This will close any stuck backend/frontend/blockchain instances.

taskkill /F /IM node.exe
taskkill /F /IM python.exe

echo.
echo All processes killed. You can now run the startup scripts again.
pause
