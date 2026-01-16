@echo off
title AURA Deployer
echo ====================================================
echo Deploying Smart Contracts to Sepolia Testnet...
echo ====================================================
echo.
echo IMPORTANT: This will use real Sepolia ETH from your wallet!
echo Make sure you have enough Sepolia ETH for gas fees.
echo Get free Sepolia ETH from: https://sepoliafaucet.com
echo.
pause

cd blockchain && npx hardhat run scripts/deploy.js --network sepolia

echo.
echo ====================================================
echo Deployment Complete!
echo Contract deployed to Sepolia testnet.
echo Transaction visible on Sepolia Etherscan.
echo ====================================================
echo.
echo To deploy to LOCAL network instead:
echo   1. Edit backend\.env - Change BLOCKCHAIN_NETWORK=local
echo   2. Run .\1_start_chain.bat
echo   3. Run: cd blockchain ^&^& npx hardhat run scripts/deploy.js --network localhost
echo.
pause
