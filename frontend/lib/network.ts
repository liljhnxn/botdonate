import { defineChain } from "viem";

export const BOTCHAIN_CHAIN_ID = 968;
export const BOTCHAIN_RPC_URL = process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.bohr.life";
export const BOTCHAIN_EXPLORER_URL = "https://scan.bohr.life";
export const BOTCHAIN_NATIVE_CURRENCY = {
  name: "BOT",
  symbol: "BOT",
  decimals: 18,
};

export const botchainTestnet = defineChain({
  id: BOTCHAIN_CHAIN_ID,
  name: "Botchain Testnet",
  nativeCurrency: BOTCHAIN_NATIVE_CURRENCY,
  rpcUrls: {
    default: {
      http: [BOTCHAIN_RPC_URL],
    },
    public: {
      http: [BOTCHAIN_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "Botchain Explorer",
      url: BOTCHAIN_EXPLORER_URL,
    },
  },
  testnet: true,
});

export const getExplorerTxUrl = (txHash: string): string => {
  return `${BOTCHAIN_EXPLORER_URL}/tx/${txHash}`;
};

export const getExplorerAddressUrl = (address: string): string => {
  return `${BOTCHAIN_EXPLORER_URL}/address/${address}`;
};
