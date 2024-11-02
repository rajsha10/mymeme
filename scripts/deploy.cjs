const hre = require("hardhat");

async function main() {
  console.log("Starting deployment script...");

  const ImageStorage = await hre.ethers.getContractFactory("ImageStorage");

  console.log("Deploying ImageStorage contract...");
  console.log("Waiting for the contract to be deployed!");

  // Deploy the contract and wait for deployment to complete
  const imageStorage = await ImageStorage.deploy();
  await imageStorage.waitForDeployment();  // Use waitForDeployment instead

  const address = await imageStorage.getAddress();  // Get contract address

  console.log("ImageStorage contract deployed successfully!");
  console.log("Contract Address:", address);
}

// Execute the main function and handle any errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });