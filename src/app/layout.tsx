import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { WalletProvider } from "@/components/wallet-provider";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = localFont({
  src: "../../public/fonts/01d1396bd69a228a-s.p.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deriverse Trading Analytics",
  description: "Professional trading journal and portfolio analysis for Deriverse DEX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        suppressHydrationWarning
        className={`${fontSans.variable} antialiased min-h-screen font-sans text-[13px] bg-canvas text-fg`}
      >
        <ThemeProvider>
          <WalletProvider>{children}</WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
