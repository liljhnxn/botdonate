"use client";

import React from "react";
import { WalletButton } from "@/components/WalletButton";
import { DonationCard } from "@/components/DonationCard";
import { RecentDonations } from "@/components/RecentDonations";
import { Sparkles, Bot, ShieldCheck, Cpu } from "lucide-react";
import { BOTCHAIN_CHAIN_ID, BOTCHAIN_EXPLORER_URL } from "@/lib/network";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080d11]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="h-full w-full bg-[#080d11] rounded-[14px] flex items-center justify-center">
                <Bot className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                BotDonate
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Testnet
                </span>
              </span>
            </div>
          </div>

          <WalletButton />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            <span>Botchain Network (Chain ID: {BOTCHAIN_CHAIN_ID})</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-100">
            Give with <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">BOT</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 font-normal max-w-xl mx-auto">
            Transparent on-chain donations powered by Botchain.
          </p>
        </section>

        {/* Campaign & Donation Section */}
        <section className="space-y-8">
          <DonationCard />
          <RecentDonations />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/60 bg-[#080d11]/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>BotDonate on Botchain Testnet</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={BOTCHAIN_EXPLORER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Botchain Explorer
            </a>
            <span className="text-slate-700">•</span>
            <span>Zero intermediary fees</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
