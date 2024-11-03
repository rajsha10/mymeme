# MY MEME

**MY MEME** is an innovative Web3 platform powered by the AIA blockchain, enabling users to create, share, and monetize memes as digital art. Built with React and Vite, the platform provides a seamless experience for meme creators, allowing for true ownership, community interaction, and monetization through tipping.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Smart Contract Deployment with Hardhat](#smart-contract-deployment-with-hardhat)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features
- Wallet integration via MetaMask
- Meme uploading and secure storage on the AIA blockchain
- Showcase feed displaying user-generated memes
- Tip creators with tokens to support their work
- Ownership verification and secure meme management through smart contracts

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mymeme.git
   cd mymeme
Install dependencies:

bash
Copy code
npm install
Set up environment variables:

Create a .env file in the root directory and add the following variables:

plaintext
Copy code
VITE_APP_API_URL=<your-api-url>
VITE_APP_CONTRACT_ADDRESS=<deployed-contract-address>
VITE_APP_INFURA_PROJECT_ID=<your-infura-project-id>
VITE_APP_PINATA_API_KEY=<your-pinata-api-key>
VITE_APP_PINATA_SECRET_KEY=<your-pinata-secret-key>
Replace placeholders with your actual details.

Configure the Vite development server:
This setup uses React Fast Refresh with Vite for a smooth development experience.

Usage
Run the development server:

bash
Copy code
npm run dev
Open your browser and navigate to http://localhost:3000 to view the app.
Interact with MY MEME:

Connect your MetaMask wallet, upload memes, view the feed, and tip other creators.
Smart Contract Deployment with Hardhat
The MY MEME platform uses a smart contract to handle meme uploads, ownership, and tipping functionalities. Follow these steps to deploy your contract on the AIA blockchain using Hardhat.

1. Install Hardhat
Install Hardhat if it’s not already installed:

bash
Copy code
npm install --save-dev hardhat
2. Initialize Hardhat Project
Run this command and follow the prompts to initialize Hardhat:

bash
Copy code
npx hardhat
3. Write the Contract
In the contracts folder, create your MyMeme.sol contract file. Ensure the contract includes functionalities for:

Meme uploads
Ownership tracking
Tipping system
4. Compile the Contract
Compile the smart contract with:

bash
Copy code
npx hardhat compile
5. Configure Deployment Script
In the scripts folder, create a deployment script (deploy.js) to deploy your contract:

javascript
Copy code
const hre = require("hardhat");

async function main() {
  const MyMeme = await hre.ethers.getContractFactory("MyMeme");
  const myMeme = await MyMeme.deploy();

  await myMeme.deployed();

  console.log("MY MEME contract deployed to:", myMeme.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
6. Deploy the Contract
Deploy the contract on a test network, such as AIA’s testnet. Ensure you have testnet ETH in your wallet.

Configure your hardhat.config.js file:

javascript
Copy code
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    aiaTestnet: {
      url: "<YOUR_INFURA_PROJECT_URL>",
      accounts: [`0x${YOUR_PRIVATE_KEY}`],
    },
  },
};
Deploy the contract:

bash
Copy code
npx hardhat run scripts/deploy.js --network aiaTestnet
7. Copy Contract Address
After deploying, copy the contract address and update VITE_APP_CONTRACT_ADDRESS in your .env file.

Available Scripts
npm run dev: Starts the development server.
npm run build: Builds the app for production.
npm run preview: Serves the built app locally.
npx hardhat compile: Compiles the smart contracts.
npx hardhat test: Runs the contract tests.
npx hardhat run scripts/deploy.js --network aiaTestnet: Deploys the contract.
Deployment
To deploy the React app:

Build the app:

bash
Copy code
npm run build
Deploy to a hosting service (e.g., Vercel, Netlify, or GitHub Pages) by uploading the contents of the dist folder.

Contributing
We welcome contributions! Please fork the repository, make changes, and submit a pull request.

License
This project is licensed under the MIT License.

yaml
Copy code

--- 

This README provides a comprehensive guide for users and contributors, from setup to deployment. Replace placeholders with your actual project details.
