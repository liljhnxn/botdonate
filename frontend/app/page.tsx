"use client";

import React from "react";
import { WalletButton } from "@/components/WalletButton";
import { DonationCard } from "@/components/DonationCard";
import { RecentDonations } from "@/components/RecentDonations";
import { BotChainEcosystem } from "@/components/BotChainEcosystem";
import { Sparkles, Bot, ShieldCheck, Cpu, ExternalLink } from "lucide-react";
import { BOTCHAIN_CHAIN_ID, BOTCHAIN_WEBSITE_URL, BOTCHAIN_EXPLORER_URL } from "@/lib/network";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080d11]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="h-full w-full bg-[#080d11] rounded-[14px] flex items-center justify-center p-1">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                BotDonate
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Mainnet
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              id="mainnet-website-nav-link"
              href={BOTCHAIN_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-emerald-400 hover:border-slate-600 transition-colors"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="h-3.5 w-3.5 rounded-sm object-contain"
              />
              <span>BOT Chain Website</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>

            <a
              id="mainnet-explorer-nav-link"
              href={BOTCHAIN_EXPLORER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-emerald-400 hover:border-slate-600 transition-colors"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="h-3.5 w-3.5 rounded-sm object-contain"
              />
              <span>BOT Chain Explorer</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>

            <WalletButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              <span>BOT Chain Mainnet (Chain ID: {BOTCHAIN_CHAIN_ID})</span>
            </div>
            <a
              id="hero-website-link"
              href={BOTCHAIN_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/60 hover:bg-slate-800 px-3.5 py-1 text-xs font-medium text-slate-300 hover:text-emerald-300 transition-colors"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="h-3.5 w-3.5 rounded-sm object-contain"
              />
              <span>botchain.ai</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <a
              id="hero-explorer-link"
              href={BOTCHAIN_EXPLORER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/60 hover:bg-slate-800 px-3.5 py-1 text-xs font-medium text-slate-300 hover:text-emerald-300 transition-colors"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="h-3.5 w-3.5 rounded-sm object-contain"
              />
              <span>scan.botchain.ai</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-100">
            Give with <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">BOT</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 font-normal max-w-xl mx-auto">
            Transparent on-chain donations powered by BOT Chain Mainnet.
          </p>
        </section>

        {/* Campaign & Donation Section */}
        <section className="space-y-8">
          <DonationCard />
          <RecentDonations />
          <BotChainEcosystem />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/60 bg-[#080d11]/80 py-8 text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 shrink-0">
              <div className="h-full w-full bg-black rounded-[10px] flex items-center justify-center p-1">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">BOT Chain Ecosystem</p>
              <p className="text-xs text-slate-500">Decentralized, non-custodial donation protocol</p>
            </div>
          </div>

          {/* Links with Logo in front */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              id="footer-botchain-website-link"
              href={BOTCHAIN_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors font-medium bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                className="h-4 w-4 rounded-sm object-contain shrink-0"
              />
              <span>BOT Chain website: {BOTCHAIN_WEBSITE_URL}</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>

            <a
              id="footer-botchain-explorer-link"
              href={BOTCHAIN_EXPLORER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors font-medium bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                className="h-4 w-4 rounded-sm object-contain shrink-0"
              />
              <span>BOT Chain explorer: {BOTCHAIN_EXPLORER_URL}</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>

          <div className="text-slate-500 text-[11px] text-center md:text-right">
            <span>Zero intermediary fees • Pure on-chain transparency</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
