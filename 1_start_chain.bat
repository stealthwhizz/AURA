@echo off
title AURA Blockchain Node (Keep Open)
echo ====================================================
echo starting Local Blockchain...
echo IMPORTANT: Do NOT close this window, or the network resets!
echo ====================================================

cd blockchain && npx hardhat node
pause
