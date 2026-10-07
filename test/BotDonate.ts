import { expect } from "chai";
import { ethers } from "hardhat";
import { BotDonate } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("BotDonate", function () {
  let botDonate: BotDonate;
  let owner: SignerWithAddress;
  let donor1: SignerWithAddress;
  let donor2: SignerWithAddress;
  let nonOwner: SignerWithAddress;

  const CAMPAIGN_TITLE = "Support Open Source Botchain Builders";
  const CAMPAIGN_DESCRIPTION = "Community funding for tools, libraries, and dApps on Botchain.";

  beforeEach(async function () {
    [owner, donor1, donor2, nonOwner] = await ethers.getSigners();

    const BotDonateFactory = await ethers.getContractFactory("BotDonate");
    botDonate = (await BotDonateFactory.deploy(
      owner.address,
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION
    )) as unknown as BotDonate;
    await botDonate.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy with correct campaign owner and info", async function () {
      expect(await botDonate.owner()).to.equal(owner.address);
      expect(await botDonate.title()).to.equal(CAMPAIGN_TITLE);
      expect(await botDonate.description()).to.equal(CAMPAIGN_DESCRIPTION);
      expect(await botDonate.totalDonated()).to.equal(0n);
      expect(await botDonate.donationCount()).to.equal(0n);
      expect(await botDonate.getBalance()).to.equal(0n);

      const [infoOwner, infoTitle, infoDesc, infoTotal, infoCount] =
        await botDonate.getCampaignInfo();
      expect(infoOwner).to.equal(owner.address);
      expect(infoTitle).to.equal(CAMPAIGN_TITLE);
      expect(infoDesc).to.equal(CAMPAIGN_DESCRIPTION);
      expect(infoTotal).to.equal(0n);
      expect(infoCount).to.equal(0n);
    });

    it("Should revert if deployed with zero address owner", async function () {
      const BotDonateFactory = await ethers.getContractFactory("BotDonate");
      await expect(
        BotDonateFactory.deploy(ethers.ZeroAddress, "Title", "Desc")
      ).to.be.revertedWithCustomError(botDonate, "ZeroOwnerAddress");
    });
  });

  describe("Donations", function () {
    it("Should allow successful donation, update total donated, count, balance, and emit DonationReceived", async function () {
      const donationAmount = ethers.parseEther("1.5");

      await expect(
        botDonate.connect(donor1).donate({ value: donationAmount })
      )
        .to.emit(botDonate, "DonationReceived")
        .withArgs(donor1.address, donationAmount);

      expect(await botDonate.totalDonated()).to.equal(donationAmount);
      expect(await botDonate.donationCount()).to.equal(1n);
      expect(await botDonate.getBalance()).to.equal(donationAmount);
    });

    it("Should reject zero donation", async function () {
      await expect(
        botDonate.connect(donor1).donate({ value: 0 })
      ).to.be.revertedWithCustomError(botDonate, "ZeroDonationAmount");
    });

    it("Should track multiple donations accurately", async function () {
      const amount1 = ethers.parseEther("0.75");
      const amount2 = ethers.parseEther("2.25");
      const amount3 = ethers.parseEther("1.0");

      await botDonate.connect(donor1).donate({ value: amount1 });
      await botDonate.connect(donor2).donate({ value: amount2 });
      await botDonate.connect(donor1).donate({ value: amount3 });

      const expectedTotal = amount1 + amount2 + amount3;
      expect(await botDonate.totalDonated()).to.equal(expectedTotal);
      expect(await botDonate.donationCount()).to.equal(3n);
      expect(await botDonate.getBalance()).to.equal(expectedTotal);
    });
  });

  describe("Withdrawal", function () {
    it("Should allow owner to withdraw funds, emit DonationWithdrawn, and update contract balance", async function () {
      const donationAmount = ethers.parseEther("3.0");
      await botDonate.connect(donor1).donate({ value: donationAmount });

      expect(await botDonate.getBalance()).to.equal(donationAmount);

      await expect(botDonate.connect(owner).withdraw())
        .to.emit(botDonate, "DonationWithdrawn")
        .withArgs(owner.address, donationAmount);

      expect(await botDonate.getBalance()).to.equal(0n);
      // Total donated and count remain transparent records
      expect(await botDonate.totalDonated()).to.equal(donationAmount);
      expect(await botDonate.donationCount()).to.equal(1n);
    });

    it("Should reject unauthorized withdrawal by non-owner", async function () {
      const donationAmount = ethers.parseEther("1.0");
      await botDonate.connect(donor1).donate({ value: donationAmount });

      await expect(
        botDonate.connect(nonOwner).withdraw()
      ).to.be.revertedWithCustomError(botDonate, "NotCampaignOwner");
    });

    it("Should reject withdrawal when contract balance is zero", async function () {
      await expect(
        botDonate.connect(owner).withdraw()
      ).to.be.revertedWithCustomError(botDonate, "NoBalanceToWithdraw");
    });
  });
});
