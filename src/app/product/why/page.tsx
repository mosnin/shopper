import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Why Shopper | Shopper",
  description:
    "Why a real shopping engine beats the shopping MCPs bolted onto LLM providers: web-wide hunts, structured shared state, Radar watching 24/7, seller vetting, and x402 so agents pay their own way.",
};

export default function WhyShopperPage() {
  return (
    <FeaturePage
      eyebrow="Why Shopper"
      title="A real engine,"
      accent="not a bolted-on MCP"
      subtitle="The shopping MCPs bolted onto LLM providers are stateless link dumps: one partner catalog, no lists, no watching, no wallet. Shopper is the engine underneath your agents: web-wide hunts, vetted sellers, structured shared state, Radar watching 24/7, and x402 so agents pay their own way."
      heroImage="https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=75&w=1600&auto=format&fit=crop"
      blocks={[
        {
          title: "The whole web, not one catalog",
          body: "A bolted-on shopping MCP searches whoever its provider has a deal with. Shopper hunts across marketplaces, storefronts, and local sellers at once, and gives your agent a real browser session for the forums and js-heavy sites a plain search cannot reach.",
        },
        {
          title: "Vetted sellers, not just links",
          body: "Every seller behind a find is checked against GLEIF, Companies House, and SEC EDGAR, so 'found it cheaper' comes with 'and here is who is actually selling it'.",
        },
        {
          title: "Shared state, not a fresh chat",
          body: "Bolted-on MCPs forget everything between calls. Shopper gives every connected agent the same structured state: wish list, shopping lists, About You, and long-term memory. Connect five agents; they work one truth, and you own it, exportable, never resold.",
        },
        {
          title: "It watches, and it can pay",
          body: "A stateless MCP stops when the call ends. Radar keeps standing scans running 24/7 on paid plans, and over x402 your agent can buy its own credits and plans with USDC, capped by what you fund. No bolted-on MCP has a wallet.",
        },
      ]}
      ctaTitle="Give your agents a real engine."
    />
  );
}
