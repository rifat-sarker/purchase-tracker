import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import StoreProvider from "@/lib/StoreProvider";
import AuthBootstrap from "@/lib/AuthBootstrap";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Gadget Tracker",
  description: "A single-owner log of every tech gadget purchase — public catalog, owner-only dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ ["--font-body" as string]: "var(--font-heading)" }}>
      <body
        className={`${archivo.variable} ${plexMono.variable} min-h-screen antialiased`}
        style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
      >
        <StoreProvider>
          <AuthBootstrap>{children}</AuthBootstrap>
        </StoreProvider>
      </body>
    </html>
  );
}
