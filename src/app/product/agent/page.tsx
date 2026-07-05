import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "The agent | Shopper",
  description:
    "No agent of your own yet? Shopper includes a built-in agent that runs the same 52 tools: web-wide hunts, seller vetting, Radar, and your lists, from plain conversation.",
};

export default function AgentPage() {
  return (
    <FeaturePage
      eyebrow="The agent"
      title="No agent yet?"
      accent="One is included"
      subtitle="Shopper ships with a built-in agent that runs the same engine your external agents would: web-wide hunts, seller vetting, wish list and shopping list writes, and Radar, all from plain conversation. It shares the same state, so when you connect your own agents later, nothing forks."
      heroImage="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=75&w=1600&auto=format&fit=crop"
      blocks={[
        {
          title: "It shops, it does not dump links",
          body: "Ask for 'a pre-owned RTX 4090 under $1,100 from a seller I can trust' and it does the work: hunts the whole web, vets the seller against public registries, and saves a structured find to your list, not ten blue links to sort through.",
        },
        {
          title: "It runs on shared memory",
          body: "Your sizes, tastes, and budgets live in About You and long-term memory, the same state every connected agent reads. The built-in agent never asks for your shoe size twice, and what it finds actually fits.",
        },
        {
          title: "It works your lists",
          body: "Give it a shopping list for the groceries, the move, or the workshop, and it tracks down the items, checks things off as you buy, and sets Radar scans on the ones worth waiting for.",
        },
        {
          title: "Same engine as your own agents",
          body: "The built-in agent uses the same operations layer your Claude Code, Cursor, Codex, OpenClaw, or Hermes agents get over MCP. Start here, connect your own agents whenever, and they all work the same lists.",
        },
      ]}
      ctaTitle="Put an agent on it."
    />
  );
}
