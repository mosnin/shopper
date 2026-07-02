import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "The agent | Shopper",
  description:
    "A built-in agent that hunts the web, vets sellers, and keeps your Wish List and Shopping Lists current, or bring your own over MCP.",
};

export default function AgentPage() {
  return (
    <FeaturePage
      eyebrow="The agent"
      title="A shopper that"
      accent="actually shops"
      subtitle="Shopper has a built-in agent that hunts the web, vets sellers, saves finds to your Wish List, and works your Shopping Lists, in plain conversation. Or bring your own."
      blocks={[
        {
          title: "It hunts, it doesn't link-dump",
          body: "Ask for 'a pre-owned 4090 under $1,100 from a seller I can trust' and it runs the hunt: search, deep shopping in a real browser, seller vetting, and a structured find in your Wish List, not ten blue links.",
        },
        {
          title: "It knows you",
          body: "About You is durable context: your sizes, tastes, and budgets, kept current by your agents over MCP. The built-in agent reads it too, so it never asks for your shoe size twice.",
        },
        {
          title: "It watches your lists",
          body: "Give it a Shopping List for the groceries, the move, or the workshop, and it monitors the list, hunts down items, and checks off purchases as they happen.",
        },
        {
          title: "Bring your own agent",
          body: "Prefer Hermes, OpenClaw, Codex, Claude Code, or something you built yourself? Connect it over MCP and it gets the same engines, the same lists, and the same vetting the built-in agent uses.",
        },
      ]}
      ctaTitle="Put an agent on it."
    />
  );
}
