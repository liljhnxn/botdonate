"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { BOTCHAIN_CHAIN_ID, BOTCHAIN_WEBSITE_URL, BOTCHAIN_EXPLORER_URL, getExplorerAddressUrl } from "@/lib/network";
import { BOT_DONATE_ADDRESS } from "@/lib/contracts";

export function BotChainEcosystem() {
  return (
    <section id="ecosystem-section" className="w-full max-w-xl mx-auto space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 p-6 sm:p-7 backdrop-blur-xl shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/25 shrink-0">
              <div className="h-full w-full bg-black rounded-[14px] flex items-center justify-center p-1.5">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100 tracking-tight">BOT Chain</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Mainnet
                </span>
              </div>
              <p className="text-xs text-slate-400">Next-generation autonomous AI & Web3 blockchain</p>
            </div>
          </div>

          {/* Action Links with Logo at the front */}
          <div className="flex items-center gap-2">
            <a
              id="ecosystem-botchain-website-link"
              href={BOTCHAIN_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 text-xs font-semibold text-emerald-300 transition-all hover:scale-[1.02] shadow-sm"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                className="h-4 w-4 rounded-sm object-contain shrink-0"
              />
              <span>BOT Chain Website</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>

            <a
              id="ecosystem-botchain-explorer-link"
              href={BOTCHAIN_EXPLORER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/60 hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-emerald-400 transition-all hover:scale-[1.02] shadow-sm"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                className="h-4 w-4 rounded-sm object-contain shrink-0"
              />
              <span>BOT Chain Explorer</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* Network Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Chain ID</p>
            <p className="text-sm font-mono font-bold text-slate-200">{BOTCHAIN_CHAIN_ID}</p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Native Token</p>
            <p className="text-sm font-mono font-bold text-emerald-400">BOT</p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Total Supply</p>
            <p className="text-sm font-mono font-bold text-slate-200">150 Million</p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Network Status</p>
            <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </p>
          </div>
        </div>

        {/* Verified Mainnet Contract Address Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <img
              src="/botchain-logo.png"
              alt="BOT Chain Logo"
              className="h-4 w-4 rounded-sm object-contain shrink-0"
            />
            <span className="text-slate-400">Verified Mainnet Contract:</span>
            <span className="font-mono text-slate-200 font-semibold hidden sm:inline">{BOT_DONATE_ADDRESS}</span>
            <span className="font-mono text-slate-200 font-semibold inline sm:hidden">{`${BOT_DONATE_ADDRESS.slice(0, 6)}...${BOT_DONATE_ADDRESS.slice(-4)}`}</span>
          </div>

          <a
            href={getExplorerAddressUrl(BOT_DONATE_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            <span>View on Explorer</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
