import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BotDonate - Give with BOT on Botchain Testnet",
  description:
    "Simple, transparent on-chain native BOT donation campaign powered by Botchain Testnet.",
  keywords: ["Botchain", "BOT", "Web3", "Crypto Donations", "Blockchain", "dApp"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#080d11] text-slate-100 antialiased`}>
        <Providers>
          <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
            {/* Ambient background glows */}
            <div className="pointer-events-none fixed inset-0 -z-10 flex justify-center">
              <div className="h-[420px] w-[600px] bg-emerald-500/10 blur-[130px] rounded-full" />
              <div className="h-[300px] w-[500px] -translate-y-20 bg-teal-500/10 blur-[120px] rounded-full" />
            </div>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
