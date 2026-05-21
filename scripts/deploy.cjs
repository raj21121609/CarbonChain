const hre = require("hardhat");

async function main() {
  console.log("Starting ESGCredential deployment process...");

  const ESGCredential = await hre.ethers.getContractFactory("ESGCredential");
  const esgCredential = await ESGCredential.deploy();

  console.log("Transaction broadcasted, waiting for confirmation...");
  await esgCredential.waitForDeployment();

  const deployedAddress = await esgCredential.getAddress();
  console.log("ESGCredential contract deployed successfully!");
  console.log("Contract Address:", deployedAddress);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
