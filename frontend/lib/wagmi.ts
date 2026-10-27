import { http, createConfig, injected } from "wagmi";
import { botchain } from "./network";

export const wagmiConfig = createConfig({
  chains: [botchain],
  connectors: [
    injected(),
  ],
  transports: {
    [botchain.id]: http(botchain.rpcUrls.default.http[0]),
  },
  ssr: true,
});
