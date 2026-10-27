import { ethers, network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  const campaignOwner = process.env.CAMPAIGN_OWNER || (deployer ? deployer.address : undefined);

  if (!campaignOwner) {
    throw new Error("CAMPAIGN_OWNER or PRIVATE_KEY deployer is required to set campaign owner.");
  }

  const campaignTitle = process.env.CAMPAIGN_TITLE || "Support Open Source Botchain Builders";
  const campaignDescription =
    process.env.CAMPAIGN_DESCRIPTION ||
    "Community funding for developers and tools building on Botchain.";

  console.log("----------------------------------------------------");
  console.log("Deploying BotDonate Contract");
  console.log(`Network: ${network.name}`);
  console.log(`Deployer: ${deployer?.address || "N/A"}`);
  console.log(`Campaign Owner: ${campaignOwner}`);
  console.log(`Campaign Title: ${campaignTitle}`);
  console.log("----------------------------------------------------");

  const BotDonateFactory = await ethers.getContractFactory("BotDonate");
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
  console.log(`Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} gwei (minimal gas fee)`);

  const botDonate = await BotDonateFactory.deploy(campaignOwner, campaignTitle, campaignDescription, {
    gasPrice,
  });
  await botDonate.waitForDeployment();

  const contractAddress = await botDonate.getAddress();
  const deploymentTx = botDonate.deploymentTransaction();
  const txHash = deploymentTx?.hash || "N/A";
  const chainId = (await ethers.provider.getNetwork()).chainId.toString();
  const explorerUrl = `https://scan.botchain.ai/address/${contractAddress}`;

  console.log("----------------------------------------------------");
  console.log("DEPLOYMENT SUCCESSFUL");
  console.log(`Contract Address : ${contractAddress}`);
  console.log(`Transaction Hash : ${txHash}`);
  console.log(`Chain ID         : ${chainId}`);
  console.log(`Explorer URL     : ${explorerUrl}`);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
