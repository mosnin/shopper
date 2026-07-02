import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { PwaRegister } from "@/components/providers/pwa-register";
import { SquircleFilters } from "@/components/ui/squircle-filter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shopper | The Shopping Engine Your Agents Run",
  description:
    "Comprehensive shopping for AI agents - they search the whole web for the items you want, watch listings, manage your wish list and shopping lists, and buy smarter. You direct; the agents shop.",
  metadataBase: new URL("https://shopper.sh"),
  applicationName: "Shopper",
  appleWebApp: {
    capable: true,
    title: "Shopper",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "Shopper | The Shopping Engine Your Agents Run",
    description:
      "Connect your AI agents over MCP and let them do comprehensive shopping - web-wide item search, deep browsing, price radar, wish lists, and shopping lists.",
    url: "https://shopper.sh",
    siteName: "Shopper",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E1DCC9" },
    { media: "(prefers-color-scheme: dark)", color: "#1F150C" },
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
