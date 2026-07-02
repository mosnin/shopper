import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";
import { AgentCircuitSection } from "@/components/sections/agent-circuit";

export const metadata: Metadata = {
  title: "How it works | Shopper",
  description:
    "Three steps from an idle agent to a Wish List that fills itself: connect over MCP, ask for what you want, and let Radar keep watch.",
};

export default function HowItWorksPage() {
  return (
    <FeaturePage
      eyebrow="How it works"
      title="Connect your agent."
      accent="It hunts."
      subtitle="Three steps from an idle agent to a Wish List that fills itself, on lists and context you own."
      blocks={[
        {
          title: "No setup, no catalog to browse",
          body: "There is nothing to import and no storefront to learn. Ask for what you want in plain language and the first hunt starts building your Wish List.",
        },
        {
          title: "Works with what you run",
          body: "Use the built-in agent, or connect Hermes, OpenClaw, Codex, Claude Code, or your own over MCP. Anything that speaks MCP gets the same engines and lists.",
        },
      ]}
      steps={[
        {
          title: "Connect",
          body: "Point your MCP client at Shopper, or use the built-in agent. Read and write access to your Wish List, Shopping Lists, and About You takes minutes.",
        },
        {
          title: "Ask, and it hunts",
          body: "Describe the item, the budget, the constraints. Your agent hunts the whole web, drops into a real browser when it needs to, vets the sellers, and saves structured finds.",
        },
        {
          title: "Radar keeps watch",
          body: "For the things not for sale at your price today, set a standing scan on a paid plan. New matches land in your Wish List the moment they appear.",
        },
      ]}
      extra={<AgentCircuitSection />}
      ctaTitle="Start hunting in minutes."
    />
  );
}
