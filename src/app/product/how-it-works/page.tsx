import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";
import { AgentCircuitSection } from "@/components/sections/agent-circuit";

export const metadata: Metadata = {
  title: "How it works | Shopper",
  description:
    "Connect your agent in one line over MCP, give it the ask, and it hunts the web, saves structured finds, sets Radar scans, and can even pay its own way with USDC.",
};

export default function HowItWorksPage() {
  return (
    <FeaturePage
      eyebrow="How it works"
      title="Connect your agent."
      accent="It shops."
      subtitle="One line over MCP, then your agent hunts, saves, watches, and pays its own way, on state you own."
      heroImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=75&w=1600&auto=format&fit=crop"
      blocks={[
        {
          title: "One line, 52 tools",
          body: "Point any MCP client at https://shopper.sh/api/mcp with OAuth or an API key and the tools appear: hunts, deep browser shopping, Radar, lists, memory, and billing. No SDK, no bespoke integration.",
        },
        {
          title: "It can pay its own way",
          body: "Over x402, a funded agent buys its own credits and plans with USDC, capped by what you put in the wallet. No agent yet? The built-in one runs the same tools from plain conversation.",
        },
      ]}
      steps={[
        {
          title: "Connect and ask",
          body: "Drop the endpoint into Claude Code, Cursor, Codex, OpenClaw, Hermes, or any MCP client, then give your agent the ask: the item, the budget, what matters. About You fills in your sizes and taste.",
        },
        {
          title: "It hunts and saves",
          body: "The agent runs web-wide hunts, opens a real browser for marketplaces and forums, vets sellers against public registries, and writes structured finds to your wish list and shopping lists.",
        },
        {
          title: "Radar watches",
          body: "For things not at your price today, the agent sets a Radar standing scan on a paid plan. The engine watches 24/7 and new matches land in your list the moment they appear.",
        },
      ]}
      extra={<AgentCircuitSection />}
      ctaTitle="Connect your agent in minutes."
    />
  );
}
