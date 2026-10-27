# BotDonate 🤖💎

**BotDonate** is a polished Web3 dApp for transparent on-chain native BOT donations on **Botchain Mainnet**.

The application allows users to donate native BOT to a community campaign and transparently view all donation records directly fetched from the blockchain events, with secure withdrawal mechanisms reserved exclusively for the campaign owner.

---

## Features

- **Single Campaign Architecture**: Dedicated smart contract storing campaign details, total donated amount, and donation count.
- **Direct Native BOT Donations**: No intermediary tokens or extra fees; native BOT is sent directly to the contract.
- **Transparent On-Chain History**: Recent donations are populated strictly by querying on-chain `DonationReceived` events—never fabricated or mock data.
- **Owner Withdrawal Controls**: Reentrancy-guarded withdrawal mechanism for the campaign owner with automated UI detection.
- **Network Verification**: Chain ID 677 detection with warning prompts and one-click network switching to Botchain Mainnet.
- **Real-Time UX States**: Clear lifecycle feedback (Idle, Confirm in wallet, Processing donation, Success with Botchain Explorer link, Error).

---

## Tech Stack

- **Smart Contract**:
  - Solidity `^0.8.24`
  - Hardhat
  - OpenZeppelin Contracts (`ReentrancyGuard`)
- **Frontend**:
  - Next.js (App Router)
  - TypeScript
  - Tailwind CSS
  - Wagmi v2 & Viem
  - Lucide React

---

## Botchain Mainnet Configuration

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Mainnet |
| **Chain ID** | `677` |
| **RPC URL** | [https://rpc.botchain.ai](https://rpc.botchain.ai) |
| **Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **Native Token** | BOT (Total Supply: 150 Million) |
| **Deployed Contract** | [`0x29D5a96794889793B4f4b00c010c16e76DF39C50`](https://scan.botchain.ai/address/0x29D5a96794889793B4f4b00c010c16e76DF39C50) |

Network configurations are centralized in `frontend/lib/network.ts` and `hardhat.config.ts`.

---

## Installation

### 1. Smart Contract Repository Setup
```bash
cd bot-donate
npm install
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

---

## Environment Variables

Copy `.env.example` to `.env` in the root and in `frontend/.env.local`:

```bash
# In bot-donate/.env (for deployment)
PRIVATE_KEY=your_private_key_without_0x_prefix
BOTCHAIN_RPC_URL=https://rpc.botchain.ai
CAMPAIGN_OWNER=0xB5E70402516D62C17346E1B8c4AD3621400d0527
CAMPAIGN_TITLE="Support Open Source Botchain Builders"
CAMPAIGN_DESCRIPTION="Community funding for developers and tools building on Botchain."

# In bot-donate/frontend/.env.local (for frontend)
NEXT_PUBLIC_BOT_DONATE_ADDRESS=0x29D5a96794889793B4f4b00c010c16e76DF39C50
NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.botchain.ai
```

---

## Testing

Run the full smart contract test suite covering deployment, donations, balance tracking, zero-value protections, and owner withdrawals:

```bash
# In bot-donate directory
npm test
```

---

## Deployment to Botchain Mainnet

Deploy `BotDonate.sol` to Botchain Mainnet:

```bash
# Deploys with low gas fee and updates frontend/.env.local automatically:
npm run deploy

# Or using Hardhat directly:
npm run deploy:hardhat
```

The scripts output:
- Deployed Contract Address
- Deployment Transaction Hash
- Chain ID (`677`)
- Botchain Explorer URL

The frontend address is automatically populated into `frontend/.env.local` as `NEXT_PUBLIC_BOT_DONATE_ADDRESS`.

---

## Running the Frontend Locally

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
