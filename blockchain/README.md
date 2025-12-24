# AURA Blockchain Module

Smart contracts for AURA certification on Ethereum blockchain.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example` and add your credentials

3. Compile contracts:
```bash
npm run compile
```

4. Deploy to local network:
```bash
# Start local Hardhat node in one terminal
npx hardhat node

# Deploy in another terminal
npm run deploy
```

5. Deploy to Sepolia testnet:
```bash
npm run deploy:sepolia
```

## Contract: AuraCertification

### Functions

- `createCertification()` - Create new AURA certification
- `verifyCertification()` - Verify certification by batch ID
- `revokeCertification()` - Revoke a certification
- `getFarmerCertifications()` - Get all certifications for a farmer

## Testing

Run tests:
```bash
npm test
```

## Integration

After deployment, use the contract address in backend `.env`:
```
CERTIFICATION_CONTRACT_ADDRESS=0x...
```
