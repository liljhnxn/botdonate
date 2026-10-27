import { BOTCHAIN_CHAIN_ID, BOTCHAIN_EXPLORER_URL } from "./network";

export const BOT_DONATE_ADDRESS = (process.env.NEXT_PUBLIC_BOT_DONATE_ADDRESS || "0x29D5a96794889793B4f4b00c010c16e76DF39C50").trim() as `0x${string}`;

export const IS_CONTRACT_CONFIGURED = Boolean(
  BOT_DONATE_ADDRESS && BOT_DONATE_ADDRESS.startsWith("0x") && BOT_DONATE_ADDRESS.length === 42
);

export const BOT_DONATE_CHAIN_ID = BOTCHAIN_CHAIN_ID;
export const BOT_DONATE_EXPLORER_URL = BOTCHAIN_EXPLORER_URL;

export const BOT_DONATE_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_owner", type: "address" },
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "NoBalanceToWithdraw",
    type: "error",
  },
  {
    inputs: [],
    name: "NotCampaignOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroDonationAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroOwnerAddress",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "donor", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "DonationReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "DonationWithdrawn",
    type: "event",
  },
  {
    inputs: [],
    name: "donate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCampaignInfo",
    outputs: [
      { internalType: "address", name: "campaignOwner", type: "address" },
      { internalType: "string", name: "campaignTitle", type: "string" },
      { internalType: "string", name: "campaignDescription", type: "string" },
      { internalType: "uint256", name: "totalAmountDonated", type: "uint256" },
      { internalType: "uint256", name: "totalDonationCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "title",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalDonated",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "donationCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
