"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from "wagmi";
import { BOTCHAIN_CHAIN_ID } from "@/lib/network";
import { Wallet, LogOut, AlertTriangle, ChevronDown, CheckCircle2 } from "lucide-react";

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: address,
    chainId: BOTCHAIN_CHAIN_ID,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-36 rounded-lg bg-slate-800/60 animate-pulse border border-slate-700/40" />
    );
  }

  // Not connected
  if (!isConnected || !address) {
    const defaultConnector = connectors[0];
    return (
      <button
        id="connect-wallet-button"
        onClick={() => {
          if (defaultConnector) {
            connect({ connector: defaultConnector });
          }
        }}
        disabled={isConnecting}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
      >
        <Wallet className="h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  const isWrongNetwork = chainId !== BOTCHAIN_CHAIN_ID;
  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const formattedBalance = balanceData
    ? `${Number(balanceData.formatted).toFixed(3)} ${balanceData.symbol}`
    : "0.000 BOT";

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 relative">
      {/* Wrong Network Warning */}
      {isWrongNetwork && (
        <button
          id="switch-network-button"
          onClick={() => switchChain({ chainId: BOTCHAIN_CHAIN_ID })}
          disabled={isSwitching}
          className="flex items-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/25"
        >
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          {isSwitching ? "Switching..." : "Switch to Botchain"}
        </button>
      )}

      {/* Connected Account & Balance */}
      <div className="relative">
        <button
          id="account-dropdown-button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center gap-2.5 rounded-xl border border-slate-700/60 bg-slate-900/80 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-200 backdrop-blur-md transition-colors hover:border-slate-600 hover:bg-slate-800/80"
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                isWrongNetwork ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
              }`}
            />
            <span className="font-mono text-slate-300">{shortenedAddress}</span>
          </div>

          <span className="hidden sm:inline-block text-slate-600">|</span>

          <span className="font-semibold text-emerald-400">
            {isBalanceLoading ? "..." : formattedBalance}
          </span>

          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700/70 bg-slate-900/95 p-2 shadow-xl backdrop-blur-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 border-b border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Network
              </p>
              <p className="text-xs text-slate-200 mt-0.5 flex items-center gap-1">
                {isWrongNetwork ? (
                  <span className="text-amber-400 font-medium">Wrong Network</span>
                ) : (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-emerald-400 inline" />
                    <span>Botchain Mainnet (677)</span>
                  </>
                )}
              </p>
            </div>

            <div className="px-3 py-2 border-b border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                BOT Balance
              </p>
              <p className="text-sm font-bold text-slate-100 mt-0.5">{formattedBalance}</p>
            </div>

            <button
              id="disconnect-wallet-button"
              onClick={() => {
                disconnect();
                setMenuOpen(false);
              }}
              className="w-full mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
            >
              <LogOut className="h-3.5 w-3.5" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
