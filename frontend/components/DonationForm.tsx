"use client";

import React, { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
  useSwitchChain,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  BOT_DONATE_ADDRESS,
  BOT_DONATE_ABI,
  IS_CONTRACT_CONFIGURED,
} from "@/lib/contracts";
import { BOTCHAIN_CHAIN_ID, getExplorerTxUrl } from "@/lib/network";
import {
  Loader2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Coins,
  ArrowRight,
} from "lucide-react";

interface DonationFormProps {
  onDonationSuccess?: () => void;
}

export function DonationForm({ onDonationSuccess }: DonationFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [lastDonatedAmount, setLastDonatedAmount] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { address, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { data: balanceData } = useBalance({
    address,
    chainId: BOTCHAIN_CHAIN_ID,
  });

  const {
    data: txHash,
    isPending: isWritePending,
    writeContract,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    query: {
      enabled: Boolean(txHash),
    },
  });

  // Call parent refetch when transaction succeeds
  React.useEffect(() => {
    if (isConfirmed && onDonationSuccess) {
      onDonationSuccess();
    }
  }, [isConfirmed, onDonationSuccess]);

  const isWrongNetwork = isConnected && chainId !== BOTCHAIN_CHAIN_ID;

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!IS_CONTRACT_CONFIGURED) {
      setErrorMessage("Donation contract is not configured.");
      return;
    }

    if (!isConnected) {
      setErrorMessage("Please connect your wallet first.");
      return;
    }

    if (isWrongNetwork) {
      setErrorMessage("Please switch to Botchain Testnet.");
      return;
    }

    const parsedNum = parseFloat(amount);
    if (!amount || isNaN(parsedNum) || parsedNum <= 0) {
      setErrorMessage("Please enter a donation amount greater than 0 BOT.");
      return;
    }

    try {
      const parsedWei = parseEther(amount);
      if (balanceData && balanceData.value < parsedWei) {
        setErrorMessage(
          `Insufficient BOT balance. You have ${Number(balanceData.formatted).toFixed(4)} BOT.`
        );
        return;
      }

      setLastDonatedAmount(amount);
      resetWrite();

      writeContract({
        address: BOT_DONATE_ADDRESS,
        abi: BOT_DONATE_ABI,
        functionName: "donate",
        value: parsedWei,
        chainId: BOTCHAIN_CHAIN_ID,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid donation amount.";
      setErrorMessage(message);
    }
  };

  // Determine button state and label
  const getButtonState = () => {
    if (isWritePending) {
      return {
        label: "Confirm in wallet...",
        disabled: true,
        loading: true,
      };
    }
    if (isConfirming) {
      return {
        label: "Processing donation...",
        disabled: true,
        loading: true,
      };
    }
    if (isConfirmed) {
      return {
        label: "Donation successful!",
        disabled: false,
        loading: false,
      };
    }
    if (writeError || receiptError || errorMessage) {
      return {
        label: "Donate",
        disabled: false,
        loading: false,
      };
    }
    return {
      label: "Donate",
      disabled: !isConnected || isWrongNetwork || !amount || parseFloat(amount) <= 0,
      loading: false,
    };
  };

  const buttonState = getButtonState();

  const handleResetForm = () => {
    setAmount("");
    resetWrite();
    setErrorMessage(null);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleDonate} className="space-y-4">
        {/* Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="donation-amount-input"
              className="text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Donation Amount
            </label>
            {isConnected && balanceData && (
              <span className="text-xs text-slate-400">
                Balance:{" "}
                <button
                  type="button"
                  onClick={() => {
                    const bal = parseFloat(balanceData.formatted);
                    // Reserve small amount for gas
                    const safeAmount = bal > 0.01 ? (bal - 0.01).toFixed(4) : bal.toString();
                    setAmount(safeAmount);
                  }}
                  className="font-medium text-emerald-400 hover:underline"
                >
                  {Number(balanceData.formatted).toFixed(3)} BOT
                </button>
              </span>
            )}
          </div>

          <div className="relative rounded-2xl border border-slate-700/80 bg-slate-950/70 p-1.5 focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <div className="flex items-center">
              <input
                id="donation-amount-input"
                type="number"
                step="any"
                min="0"
                placeholder="0.0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                disabled={isWritePending || isConfirming}
                className="w-full bg-transparent px-3 py-2 text-xl font-bold text-slate-100 placeholder-slate-600 focus:outline-none disabled:opacity-50"
              />
              <div className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 px-3 py-1.5 mr-1 border border-slate-700/60 shrink-0">
                <Coins className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">BOT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex items-center gap-2">
          {["0.1", "0.5", "1.0", "5.0"].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => {
                setAmount(val);
                if (errorMessage) setErrorMessage(null);
              }}
              disabled={isWritePending || isConfirming}
              className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-all ${
                amount === val
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-semibold"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              +{val} BOT
            </button>
          ))}
        </div>

        {/* Wrong Network Banner */}
        {isWrongNetwork && (
          <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
              Connected to wrong network. Switch to Botchain Testnet.
            </span>
            <button
              type="button"
              onClick={() => switchChain({ chainId: BOTCHAIN_CHAIN_ID })}
              className="font-bold underline hover:text-amber-200 ml-2"
            >
              Switch
            </button>
          </div>
        )}

        {/* Action Button */}
        <button
          id="donate-button"
          type="submit"
          disabled={buttonState.disabled}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-sm font-bold shadow-lg transition-all duration-200 active:scale-[0.99] cursor-pointer ${
            isConfirmed
              ? "bg-emerald-600 text-white shadow-emerald-500/25"
              : "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {buttonState.loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isConfirmed && <CheckCircle2 className="h-4 w-4" />}
          <span>{buttonState.label}</span>
          {!buttonState.loading && !isConfirmed && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      {/* Error Message */}
      {(errorMessage || writeError || receiptError) && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Donation failed</p>
            <p className="text-slate-300">
              {errorMessage ||
                (writeError?.message?.includes("User rejected")
                  ? "Transaction was rejected in wallet."
                  : writeError?.message || receiptError?.message || "Unknown transaction error.")}
            </p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {isConfirmed && txHash && (
        <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>Donation Confirmed!</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Amount Donated:</span>
              <span className="font-bold text-slate-100">{lastDonatedAmount} BOT</span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-slate-800">
              <span className="text-slate-400">Transaction Hash:</span>
              <span className="font-mono text-emerald-400 text-[11px]">
                {`${txHash.slice(0, 10)}...${txHash.slice(-8)}`}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 pt-2">
            <a
              id="explorer-tx-link"
              href={getExplorerTxUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              <span>View on Botchain Explorer</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Donate again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
