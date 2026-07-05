import { AgentHero } from "@/components/sections/agent-hero";

// The landing hero: agent-first. Shopper is the shopping engine for AI agents,
// so the hero leads with the one-line MCP connect, a live tool-call transcript,
// and the proof row (52 tools, Radar, x402 self-pay). The consumer-style fluid
// canvas hero lives on in src/components/ui/fluid-spatial-hero.tsx if needed.
export function HeroSection() {
  return <AgentHero />;
}
