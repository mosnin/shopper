import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Why Shopper | Shopper",
  description:
    "Why a dedicated shopping engine beats the shopping MCPs bolted onto LLM providers: web-wide hunting, real browsers, seller vetting, and lists you own.",
};

export default function WhyShopperPage() {
  return (
    <FeaturePage
      eyebrow="Why Shopper"
      title="An order of magnitude past"
      accent="bolted-on shopping"
      subtitle="LLM providers bolt shopping MCPs onto their assistants: one catalog, no memory, no vetting. Shopper is a shopping engine built for agents: web-wide hunting, real browsers, vetted sellers, and lists that persist."
      blocks={[
        {
          title: "The whole web, not a partner catalog",
          body: "Provider shopping tools search whoever signed the deal. Shopper hunts the open web with Exa, Firecrawl, and Tavily, and drops into a real Browserbase browser for forums, marketplaces, and js-heavy storefronts.",
        },
        {
          title: "Vetted sellers, not just links",
          body: "Shopper checks sellers, stores, and manufacturers against GLEIF, Companies House, and SEC EDGAR, so 'found it cheaper' comes with 'and here is who is actually selling it'.",
        },
        {
          title: "Memory that outlives the chat",
          body: "Wish List, Shopping Lists, and About You are durable, structured, and yours. Every agent you connect reads and writes the same lists over MCP, so the hunt compounds instead of restarting.",
        },
        {
          title: "Radar keeps hunting",
          body: "A chat tool stops when the chat ends. Radar runs standing scans, on paid plans, so the pre-owned GPU, the size 10M Gucci, or the right supplier finds you.",
        },
      ]}
      ctaTitle="Give your agents a real shopping engine."
    />
  );
}
