const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

// Load deployed address
const contractsPath = path.join(__dirname, '../../frontend/src/config/contracts.json');
let contractAddress;
try {
    const contracts = JSON.parse(fs.readFileSync(contractsPath, 'utf8'));
    contractAddress = contracts.AuraCertification;
} catch (error) {
    console.error('Failed to load contract address:', error.message);
}

// Load ABI
const artifactPath = path.join(__dirname, '../../blockchain/artifacts/contracts/AuraCertification.sol/AuraCertification.json');
let contractABI;
try {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    contractABI = artifact.abi;
} catch (error) {
    console.error('Failed to load contract ABI:', error.message);
}

// Network configuration
const NETWORK = process.env.BLOCKCHAIN_NETWORK || 'local'; // 'local' or 'sepolia'
const SEPOLIA_RPC = process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';
const LOCAL_RPC = 'http://127.0.0.1:8545';

// Initialize provider based on network
let provider;
let wallet;

if (NETWORK === 'sepolia') {
    provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) {
        console.error('ERROR: WALLET_PRIVATE_KEY not set in .env for Sepolia network');
    } else {
        wallet = new ethers.Wallet(privateKey, provider);
        console.log(`✓ Blockchain: Connected to Sepolia with wallet ${wallet.address}`);
    }
} else {
    // Local Hardhat network
    provider = new ethers.JsonRpcProvider(LOCAL_RPC);
    // Use Hardhat Account #0 for local development
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    wallet = new ethers.Wallet(privateKey, provider);
    console.log(`✓ Blockchain: Connected to local Hardhat network`);
}

const getContract = () => {
    if (!contractAddress || !contractABI) {
        throw new Error('Contract not initialized - missing address or ABI');
    }
    if (!wallet) {
        throw new Error('Wallet not initialized');
    }
    return new ethers.Contract(contractAddress, contractABI, wallet);
};

const writeToBlockchain = async (certification) => {
    try {
        // Check if contract is deployed
        if (!contractAddress) {
            console.warn('Contract address not found. Run deployment first: cd blockchain && npx hardhat run scripts/deploy.js --network localhost');
            return null;
        }

        const contract = getContract();

        // Issue certification on-chain
        // Note: Using wallet address as farmer since we don't store Ethereum addresses in DB
        // In production, each farmer should have their own wallet address
        console.log(`Issuing certification ${certification.batchId} to blockchain...`);
        const tx = await contract.createCertification(
            certification.batchId,
            wallet.address, // Use wallet address instead of MongoDB ID
            certification.cropType,
            certification.quantity,
            Math.floor(Date.now() / 1000), // timestamp
            Math.floor(certification.averageRiskScore),
            certification.verificationUrl || ''
        );

        console.log(`Transaction sent: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`✓ Transaction confirmed in block ${receipt.blockNumber}: ${receipt.hash}`);

        return receipt.hash;
    } catch (error) {
        console.error('Blockchain write failed:', error.message);

        // Return null instead of mock hash - let the caller handle it
        return null;
    }
};

// Get the appropriate block explorer URL
const getExplorerUrl = (txHash) => {
    if (!txHash) return null;

    if (NETWORK === 'sepolia') {
        return `https://sepolia.etherscan.io/tx/${txHash}`;
    } else {
        // For local network, return null (no explorer)
        return null;
    }
};

module.exports = {
    writeToBlockchain,
    getExplorerUrl,
    NETWORK
};
