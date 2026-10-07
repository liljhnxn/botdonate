# BotDonate 🤖💎

**BotDonate** is a simple, polished Web3 dApp for transparent on-chain native BOT donations on **Botchain Testnet**.

The application allows users to donate native BOT to a community campaign and transparently view all donation records directly fetched from the blockchain events, with secure withdrawal mechanisms reserved exclusively for the campaign owner.

---

## Features

- **Single Campaign Architecture**: Dedicated smart contract storing campaign details, total donated amount, and donation count.
- **Direct Native BOT Donations**: No intermediary tokens or extra fees; native BOT is sent directly to the contract.
- **Transparent On-Chain History**: Recent donations are populated strictly by querying on-chain `DonationReceived` events—never fabricated or mock data.
- **Owner Withdrawal Controls**: Reentrancy-guarded withdrawal mechanism for the campaign owner with automated UI detection.
- **Network Verification**: Chain ID 968 detection with warning prompts and one-click network switching.
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

## Botchain Testnet Configuration

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC URL** | [https://rpc.bohr.life](https://rpc.bohr.life) |
| **Explorer** | [https://scan.bohr.life](https://scan.bohr.life) |
| **Native Token** | BOT |

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
BOTCHAIN_RPC_URL=https://rpc.bohr.life
CAMPAIGN_OWNER=0xYourWalletAddress
CAMPAIGN_TITLE="Support Open Source Botchain Builders"
CAMPAIGN_DESCRIPTION="Community funding for developers and tools building on Botchain Testnet."

# In bot-donate/frontend/.env.local (for frontend)
NEXT_PUBLIC_BOT_DONATE_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.bohr.life
```

---

## Testing

Run the full smart contract test suite covering deployment, donations, balance tracking, zero-value protections, and owner withdrawals:

```bash
# In bot-donate directory
npm test
```

---

## Deployment to Botchain Testnet

Deploy `BotDonate.sol` to Botchain Testnet using the automated deployment script:

```bash
# Ensure PRIVATE_KEY and CAMPAIGN_OWNER are set in .env
npm run deploy:botchain
```

The script outputs:
- Deployed Contract Address
- Deployment Transaction Hash
- Chain ID (`968`)
- Botchain Explorer URL

Once deployed, copy the contract address into `frontend/.env.local` as `NEXT_PUBLIC_BOT_DONATE_ADDRESS`.

---

## Running the Frontend Locally

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Security Notes

1. **Reentrancy Protection**: The `withdraw()` function utilizes OpenZeppelin's `ReentrancyGuard` to guard against reentrancy attacks.
2. **Owner Restrictons**: Only the designated `owner` can invoke `withdraw()`.
3. **No Record Tampering**: Campaign owner has zero ability to edit, delete, or fabricate donation statistics or events.
4. **Validation**: Zero-address owner and zero-value donation transactions are explicitly rejected with custom errors.
5. **Checked Arithmetic**: Built on Solidity 0.8+ with native overflow and underflow protection.
