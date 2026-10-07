import { http, createConfig, injected } from "wagmi";
import { botchainTestnet } from "./network";

export const wagmiConfig = createConfig({
  chains: [botchainTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainTestnet.id]: http(botchainTestnet.rpcUrls.default.http[0]),
  },
  ssr: true,
});
