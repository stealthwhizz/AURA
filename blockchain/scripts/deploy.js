const hre = require("hardhat");

async function main() {
  console.log("Deploying AURA Certification Contract...");

  // Get the contract factory
  const AuraCertification = await hre.ethers.getContractFactory("AuraCertification");

  // Deploy the contract
  const auraCert = await AuraCertification.deploy();

  await auraCert.waitForDeployment();

  const address = await auraCert.getAddress();

  console.log(`AuraCertification deployed to: ${address}`);

  // Save address and ABI to frontend config
  const fs = require("fs");
  const path = require("path");
  const configDir = path.join(__dirname, "../../frontend/src/config");

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Read the contract artifact to get the ABI
  const artifactPath = path.join(__dirname, "../artifacts/contracts/AuraCertification.sol/AuraCertification.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const config = {
    AuraCertification: address
  };

  fs.writeFileSync(
    path.join(configDir, "contracts.json"),
    JSON.stringify(config, null, 2)
  );

  console.log("Contract address saved to frontend/src/config/contracts.json");

  // Create a sample certification for testing
  console.log("\nCreating sample certification...");

  const [deployer] = await hre.ethers.getSigners();
  const batchId = `AURA-TEST-${Date.now()}`;

  const tx = await auraCert.createCertification(
    batchId,
    deployer.address,
    "maize",
    1000, // 1000 kg
    Math.floor(Date.now() / 1000),
    3, // Low risk score
    "QmSampleIPFSHash123"
  );

  await tx.wait();

  console.log(`Sample certification created with batch ID: ${batchId}`);

  // Verify the certification
  const cert = await auraCert.verifyCertification(batchId);
  console.log("\nCertification verified:");
  console.log(`  Farmer: ${cert.farmer}`);
  console.log(`  Crop: ${cert.cropType}`);
  console.log(`  Quantity: ${cert.quantity}`);
  console.log(`  Risk Score: ${cert.riskScore}`);
  console.log(`  Valid: ${cert.isValid}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
