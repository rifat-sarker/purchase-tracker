import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import StoreProvider from "@/lib/StoreProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gadget Purchase Tracker",
  description: "Track your personal tech gadget purchases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans min-h-screen antialiased bg-[#0a0a0a] text-slate-50 selection:bg-indigo-500/30`}
      >
        <StoreProvider>
          {/* Background Gradient Effects */}
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0a0a] to-[#0a0a0a]"></div>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
