"use client";

import React, { useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatEther } from "viem";
import {
  BOT_DONATE_ADDRESS,
  BOT_DONATE_ABI,
  IS_CONTRACT_CONFIGURED,
} from "@/lib/contracts";
import { BOTCHAIN_CHAIN_ID, getExplorerTxUrl, getExplorerAddressUrl } from "@/lib/network";
import { DonationForm } from "./DonationForm";
import {
  ShieldAlert,
  Coins,
  Users,
  Wallet,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export function DonationCard() {
  const { address, isConnected } = useAccount();

  // Read Campaign Information
  const {
    data: campaignInfoData,
    isLoading: isInfoLoading,
    refetch: refetchCampaignInfo,
  } = useReadContract({
    address: BOT_DONATE_ADDRESS,
    abi: BOT_DONATE_ABI,
    functionName: "getCampaignInfo",
    chainId: BOTCHAIN_CHAIN_ID,
    query: {
      enabled: IS_CONTRACT_CONFIGURED,
    },
  });

  // Read Contract Balance
  const {
    data: contractBalanceData,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useReadContract({
    address: BOT_DONATE_ADDRESS,
    abi: BOT_DONATE_ABI,
    functionName: "getBalance",
    chainId: BOTCHAIN_CHAIN_ID,
    query: {
      enabled: IS_CONTRACT_CONFIGURED,
    },
  });

  // Withdrawal transaction hooks
  const {
    data: withdrawTxHash,
    isPending: isWithdrawWritePending,
    writeContract: writeWithdraw,
    error: withdrawWriteError,
    reset: resetWithdraw,
  } = useWriteContract();

  const {
    isLoading: isWithdrawConfirming,
    isSuccess: isWithdrawConfirmed,
    error: withdrawReceiptError,
  } = useWaitForTransactionReceipt({
    hash: withdrawTxHash,
    query: {
      enabled: Boolean(withdrawTxHash),
    },
  });

  const refetchAll = React.useCallback(() => {
    refetchCampaignInfo();
    refetchBalance();
  }, [refetchCampaignInfo, refetchBalance]);

  useEffect(() => {
    if (isWithdrawConfirmed) {
      refetchAll();
    }
  }, [isWithdrawConfirmed, refetchAll]);

  if (!IS_CONTRACT_CONFIGURED) {
    return (
      <div className="w-full max-w-xl mx-auto rounded-3xl border border-amber-500/30 bg-slate-900/60 p-8 backdrop-blur-xl text-center shadow-2xl">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 border border-amber-500/20">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">
          Donation contract is not configured.
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Please set the <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono text-xs">NEXT_PUBLIC_BOT_DONATE_ADDRESS</code> environment variable in your frontend configuration.
        </p>
      </div>
    );
  }

  const campaignOwner = campaignInfoData ? campaignInfoData[0] : undefined;
  const campaignTitle = campaignInfoData ? campaignInfoData[1] : "Campaign";
  const campaignDescription = campaignInfoData ? campaignInfoData[2] : "";
  const totalDonatedRaw = campaignInfoData ? campaignInfoData[3] : 0n;
  const donationCountRaw = campaignInfoData ? campaignInfoData[4] : 0n;

  const totalDonatedFormatted = Number(formatEther(totalDonatedRaw)).toFixed(3);
  const donationCountFormatted = donationCountRaw.toString();

  const contractBalanceFormatted = contractBalanceData
    ? Number(formatEther(contractBalanceData)).toFixed(3)
    : "0.000";

  const isOwner =
    isConnected &&
    address &&
    campaignOwner &&
    address.toLowerCase() === campaignOwner.toLowerCase();

  const handleWithdraw = () => {
    resetWithdraw();
    writeWithdraw({
      address: BOT_DONATE_ADDRESS,
      abi: BOT_DONATE_ABI,
      functionName: "withdraw",
      chainId: BOTCHAIN_CHAIN_ID,
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Main Campaign Card */}
      <div className="relative rounded-3xl border border-slate-700/60 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-emerald-950/20">
        {/* Glow Accent */}
        <div className="absolute -top-px left-12 right-12 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        {/* Card Header & Title */}
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-3 w-3" />
            <span>Active Campaign</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {isInfoLoading ? (
              <span className="inline-block h-8 w-64 bg-slate-800 animate-pulse rounded-lg" />
            ) : (
              campaignTitle
            )}
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            {isInfoLoading ? (
              <span className="inline-block h-4 w-full bg-slate-800 animate-pulse rounded" />
            ) : (
              campaignDescription
            )}
          </p>

          {/* Mainnet Explorer Contract Link */}
          {BOT_DONATE_ADDRESS && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <a
                href={getExplorerAddressUrl(BOT_DONATE_ADDRESS)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition-all"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="h-4 w-4 rounded-sm object-contain shrink-0"
                />
                <span className="font-bold">Mainnet Contract:</span>
                <span className="hidden sm:inline font-mono">{BOT_DONATE_ADDRESS}</span>
                <span className="inline sm:hidden font-mono">{`${BOT_DONATE_ADDRESS.slice(0, 6)}...${BOT_DONATE_ADDRESS.slice(-4)}`}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>•</span>
                <span>Verified on Botchain Explorer</span>
              </span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
              <Coins className="h-3.5 w-3.5 text-emerald-400" />
              <span>Total Donated</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-100">
              {isInfoLoading ? "..." : `${totalDonatedFormatted} BOT`}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
              <Users className="h-3.5 w-3.5 text-teal-400" />
              <span>Donations</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-100">
              {isInfoLoading ? "..." : donationCountFormatted}
            </div>
          </div>
        </div>

        {/* Donation Input & Action */}
        <DonationForm onDonationSuccess={refetchAll} />
      </div>

      {/* Owner Withdrawal Section (Only rendered when connected === campaign owner) */}
      {isOwner && (
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900/80 to-slate-950/80 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-300">Campaign Owner Controls</h3>
                <p className="text-xs text-slate-400">Withdraw collected native BOT</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Available Balance
              </p>
              <p className="text-base font-extrabold text-amber-300">
                {isBalanceLoading ? "..." : `${contractBalanceFormatted} BOT`}
              </p>
            </div>
          </div>

          <button
            id="withdraw-button"
            type="button"
            onClick={handleWithdraw}
            disabled={
              isWithdrawWritePending ||
              isWithdrawConfirming ||
              !contractBalanceData ||
              contractBalanceData === 0n
            }
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isWithdrawWritePending && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Confirm in wallet...</span>
              </>
            )}
            {isWithdrawConfirming && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Withdrawing balance...</span>
              </>
            )}
            {isWithdrawConfirmed && (
              <>
                <CheckCircle2 className="h-4 w-4 text-slate-950" />
                <span>Withdrawal complete!</span>
              </>
            )}
            {!isWithdrawWritePending && !isWithdrawConfirming && !isWithdrawConfirmed && (
              <>
                <span>Withdraw All BOT</span>
                <ArrowUpRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* Withdrawal Error */}
          {(withdrawWriteError || withdrawReceiptError) && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <p>
                {withdrawWriteError?.message?.includes("User rejected")
                  ? "Withdrawal was rejected in wallet."
                  : withdrawWriteError?.message || withdrawReceiptError?.message || "Withdrawal failed"}
              </p>
            </div>
          )}

          {/* Withdrawal Success details */}
          {isWithdrawConfirmed && withdrawTxHash && (
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
              <span className="text-amber-300 font-medium">Funds transferred to owner</span>
              <a
                href={getExplorerTxUrl(withdrawTxHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-400 hover:underline"
              >
                <span>Explorer Tx</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
