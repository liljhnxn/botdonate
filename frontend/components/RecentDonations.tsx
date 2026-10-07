"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePublicClient, useWatchContractEvent } from "wagmi";
import { formatEther } from "viem";
import {
  BOT_DONATE_ADDRESS,
  BOT_DONATE_ABI,
  IS_CONTRACT_CONFIGURED,
} from "@/lib/contracts";
import { BOTCHAIN_CHAIN_ID, getExplorerTxUrl } from "@/lib/network";
import { History, ExternalLink, HeartHandshake, Loader2 } from "lucide-react";

interface DonationRecord {
  donor: string;
  amount: bigint;
  transactionHash: string;
  blockNumber?: bigint;
}

export function RecentDonations() {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const publicClient = usePublicClient({ chainId: BOTCHAIN_CHAIN_ID });

  // Fetch past donation events from chain
  const fetchDonations = useCallback(async () => {
    if (!IS_CONTRACT_CONFIGURED || !publicClient) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setFetchError(null);

      // Fetch logs for DonationReceived event
      const logs = await publicClient.getContractEvents({
        address: BOT_DONATE_ADDRESS,
        abi: BOT_DONATE_ABI,
        eventName: "DonationReceived",
        fromBlock: "earliest",
      });

      const formatted: DonationRecord[] = logs
        .map((log) => ({
          donor: log.args.donor as string,
          amount: log.args.amount as bigint,
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
        }))
        .reverse(); // Most recent first

      setDonations(formatted);
    } catch (err: unknown) {
      console.error("Error fetching donation events:", err);
      setFetchError("Unable to fetch recent donation events.");
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  // Watch for new donation events live
  useWatchContractEvent({
    address: BOT_DONATE_ADDRESS,
    abi: BOT_DONATE_ABI,
    eventName: "DonationReceived",
    chainId: BOTCHAIN_CHAIN_ID,
    enabled: IS_CONTRACT_CONFIGURED,
    onLogs(newLogs) {
      const newItems: DonationRecord[] = newLogs.map((log) => ({
        donor: log.args.donor as string,
        amount: log.args.amount as bigint,
        transactionHash: log.transactionHash,
        blockNumber: log.blockNumber,
      }));

      setDonations((prev) => {
        // Prevent duplicate tx hashes
        const existingTxHashes = new Set(prev.map((d) => d.transactionHash));
        const filteredNew = newItems.filter((item) => !existingTxHashes.has(item.transactionHash));
        return [...filteredNew, ...prev];
      });
    },
  });

  if (!IS_CONTRACT_CONFIGURED) {
    return null;
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Recent Donations</h3>
          </div>
          <button
            type="button"
            onClick={fetchDonations}
            disabled={loading}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading && donations.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-slate-500 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
            <span className="text-xs">Loading on-chain donations...</span>
          </div>
        ) : fetchError && donations.length === 0 ? (
          <div className="py-8 text-center text-xs text-rose-400">
            {fetchError}
          </div>
        ) : donations.length === 0 ? (
          <div className="py-10 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/30">
            <HeartHandshake className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-400">No donations yet.</p>
            <p className="text-xs text-slate-500 mt-1">Be the first to donate native BOT!</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {donations.map((item, index) => {
              const shortenedDonor = item.donor
                ? `${item.donor.slice(0, 6)}...${item.donor.slice(-4)}`
                : "Unknown";
              const formattedAmount = item.amount ? formatEther(item.amount) : "0";

              return (
                <div
                  key={`${item.transactionHash}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5 transition-colors hover:border-slate-700/80 hover:bg-slate-900/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-mono text-xs">
                      {shortenedDonor.slice(2, 4).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-mono text-xs font-semibold text-slate-200">
                        {shortenedDonor}
                      </p>
                      {item.transactionHash && (
                        <a
                          href={getExplorerTxUrl(item.transactionHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-400 transition-colors mt-0.5"
                        >
                          <span className="font-mono">{`${item.transactionHash.slice(0, 6)}...${item.transactionHash.slice(-4)}`}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">
                      +{formattedAmount} BOT
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
