import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Shop the web | Shopper",
  description:
    "Your agents hunt the whole web for items for sale, from a plain-English ask, and save every find to a Wish List you own.",
};

export default function DiscoverPage() {
  return (
    <FeaturePage
      eyebrow="Shop the web"
      title="Hunt the whole web,"
      accent="from one ask"
      subtitle="Tell your agent what you want: a pre-owned GPU at a good price, a discontinued lamp, a reliable parts supplier. Shopper hunts across the open web with Exa, Firecrawl, and Tavily and saves every find, with its seller, to your Wish List."
      blocks={[
        {
          title: "The whole web, not one catalog",
          body: "Shopper is not a storefront with a search box. Your agent hunts marketplaces, independent stores, manufacturer sites, and listings anywhere on the open web, so the best find wins, not the best-indexed one.",
        },
        {
          title: "Deep shopping with a real browser",
          body: "Some of the best deals hide behind javascript, logins, and forum threads. Deep shopping gives your agent a real Browserbase browser, so it can work forums, marketplaces, and js-heavy storefronts like a person would.",
        },
        {
          title: "Finds you can trust",
          body: "Every item lands in your Wish List as a structured record: the item, the price, the seller, the store, the manufacturer. Sellers are vetted against GLEIF, Companies House, and SEC EDGAR before you spend a cent.",
        },
        {
          title: "Any agent can drive",
          body: "Use the built-in agent, or connect Hermes, OpenClaw, Codex, Claude Code, or any MCP client. They all get the same hunting engines and write to the same Wish List.",
        },
      ]}
      ctaTitle="Let your agent do the hunting."
    />
  );
}
