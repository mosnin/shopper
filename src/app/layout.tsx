import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { PwaRegister } from "@/components/providers/pwa-register";
import { SquircleFilters } from "@/components/ui/squircle-filter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shopper | The Shopping Engine for AI Agents",
  description:
    "Connect your agent in one line over MCP and it gets 52 shopping tools: web-wide hunts, Radar standing scans that watch 24/7, shared lists and memory, and x402 so agents pay their own way.",
  metadataBase: new URL("https://shopper.sh"),
  applicationName: "Shopper",
  appleWebApp: {
    capable: true,
    title: "Shopper",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "Shopper | The Shopping Engine for AI Agents",
    description:
      "One line connects any MCP client: 52 tools for web-wide hunts, deep browser shopping, Radar standing scans, seller vetting, and shared lists your agents keep current.",
    url: "https://shopper.sh",
    siteName: "Shopper",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <SquircleFilters />
        <AppProviders>{children}</AppProviders>
        <PwaRegister />
      </body>
    </html>
  );
}
