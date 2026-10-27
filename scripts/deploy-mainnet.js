const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  const rpcUrl = process.env.BOTCHAIN_RPC_URL || "https://rpc.botchain.ai";
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("PRIVATE_KEY is missing in .env");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const network = await provider.getNetwork();
  console.log("----------------------------------------------------");
  console.log("Deploying BotDonate Contract to Botchain Mainnet");
  console.log(`RPC URL       : ${rpcUrl}`);
  console.log(`Chain ID      : ${network.chainId.toString()}`);

  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`Deployer Addr : ${wallet.address}`);

  const balance = await provider.getBalance(wallet.address);
  console.log(`Deployer Bal  : ${ethers.formatEther(balance)} BOT`);

  const campaignOwner = process.env.CAMPAIGN_OWNER || wallet.address;
  const campaignTitle = process.env.CAMPAIGN_TITLE || "Support Open Source Botchain Builders";
  const campaignDescription =
    process.env.CAMPAIGN_DESCRIPTION ||
    "Community funding for developers and tools building on Botchain.";

  console.log(`Campaign Owner: ${campaignOwner}`);
  console.log(`Campaign Title: ${campaignTitle}`);
  console.log("----------------------------------------------------");

  // Read compiled artifact
  const artifactPath = path.join(__dirname, "../artifacts/contracts/BotDonate.sol/BotDonate.json");
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Compiled artifact not found at ${artifactPath}. Please compile first.`);
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  // Gas optimization: get current base gas price (usually 20 gwei)
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");

  console.log(`Estimating deployment gas...`);
  const deployTx = await factory.getDeployTransaction(campaignOwner, campaignTitle, campaignDescription);
  const estimatedGas = await provider.estimateGas(deployTx);
  const estimatedCost = estimatedGas * gasPrice;

  console.log(`Estimated Gas : ${estimatedGas.toString()}`);
  console.log(`Gas Price     : ${ethers.formatUnits(gasPrice, "gwei")} gwei`);
  console.log(`Estimated Cost: ${ethers.formatEther(estimatedCost)} BOT`);

  console.log("Broadcasting deployment transaction with minimal gas fee...");
  const contract = await factory.deploy(campaignOwner, campaignTitle, campaignDescription, {
    gasPrice,
    gasLimit: (estimatedGas * 110n) / 100n, // safe 10% buffer only, unused gas is refunded
  });

  console.log(`Tx submitted! Hash: ${contract.deploymentTransaction().hash}`);
  console.log("Waiting for block confirmation...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const txHash = contract.deploymentTransaction().hash;
  const explorerUrl = `https://scan.botchain.ai/address/${contractAddress}`;

  console.log("----------------------------------------------------");
  console.log("DEPLOYMENT SUCCESSFUL!");
  console.log(`Contract Address : ${contractAddress}`);
  console.log(`Transaction Hash : ${txHash}`);
  console.log(`Chain ID         : ${network.chainId.toString()}`);
  console.log(`Explorer URL     : ${explorerUrl}`);
  console.log("----------------------------------------------------");

  // Update frontend/.env.local
  const frontendEnvPath = path.join(__dirname, "../frontend/.env.local");
  const frontendEnvContent = `NEXT_PUBLIC_BOT_DONATE_ADDRESS=${contractAddress}\nNEXT_PUBLIC_BOTCHAIN_RPC_URL=${rpcUrl}\n`;
  fs.writeFileSync(frontendEnvPath, frontendEnvContent, "utf-8");
  console.log(`Updated frontend/.env.local with deployed contract address.`);
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
