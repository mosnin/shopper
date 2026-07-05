import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Hunts | Shopper",
  description:
    "Your agent hunts the whole web for items for sale: marketplaces, forums, storefronts, and local listings, then saves every find with its price and seller to structured lists.",
};

export default function DiscoverPage() {
  return (
    <FeaturePage
      eyebrow="Hunts"
      title="Your agent hunts the web,"
      accent="from one ask"
      subtitle="Give your agent the ask: a pre-owned RTX 4090 under $1,100, a lamp they stopped making, a reliable parts supplier. It runs a web-wide hunt across marketplaces, storefronts, and forums, and writes every find, with its price and seller, straight to your wish list."
      heroImage="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=75&w=1600&auto=format&fit=crop"
      blocks={[
        {
          title: "The whole web, not one catalog",
          body: "Shopper is not a partner catalog with a search box. Hunts run wide across marketplaces, independent stores, maker sites, and listings all over the web at once, powered by Exa, Firecrawl, and Tavily under the hood, so the best find wins, not the easiest one.",
        },
        {
          title: "Deep shopping with a real browser",
          body: "The best deals hide on forums, marketplaces, and js-heavy storefronts a plain search cannot reach. Your agent gets a real browser session and works through them the way a human would, so nothing good slips past.",
        },
        {
          title: "Structured finds, not link dumps",
          body: "Every find lands as a structured record: the item, the price, the seller, the source. Sellers are vetted against GLEIF, Companies House, and SEC EDGAR before money moves. Your agent saves options you can act on, not ten blue links.",
        },
        {
          title: "Any agent, or the built-in one",
          body: "Connect Claude Code, Cursor, Codex, OpenClaw, Hermes, or any MCP client in one line: https://shopper.sh/api/mcp, OAuth or API key. No agent of your own? The built-in one runs the same hunts.",
        },
      ]}
      ctaTitle="Send your agent hunting."
    />
  );
}
