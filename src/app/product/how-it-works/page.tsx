import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";
import { AgentCircuitSection } from "@/components/sections/agent-circuit";

export const metadata: Metadata = {
  title: "How it works | Shopper",
  description:
    "Three steps from a sentence to a wish list that fills itself: tell Shopper what you want, it searches everywhere, and it keeps watching for deals.",
};

export default function HowItWorksPage() {
  return (
    <FeaturePage
      eyebrow="How it works"
      title="Tell it what you want."
      accent="It shops."
      subtitle="Three steps from a sentence to a wish list that fills itself, on lists you own."
      heroImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=75&w=1600&auto=format&fit=crop"
      blocks={[
        {
          title: "No setup, nothing to learn",
          body: "There's nothing to import and no storefront to figure out. Ask for what you want in plain words and the first search starts filling your wish list.",
        },
        {
          title: "Use it here, or with your AI",
          body: "You can just use Shopper here. If you already use AI assistants like ChatGPT, Claude, or Gemini, you can connect them too, and they shop through the same lists.",
        },
      ]}
      steps={[
        {
          title: "Tell Shopper what you want",
          body: "Describe the item, your budget, and anything that matters. Shopper already knows your sizes and taste, so it gets it right from the first result.",
        },
        {
          title: "It searches everywhere",
          body: "Shopper looks across stores, marketplaces, and local sellers all at once, opens a real browser for the tricky sites, checks the sellers, and saves the best options.",
        },
        {
          title: "It watches for deals",
          body: "For the things not for sale at your price today, set a deal alert on a paid plan. New matches and price drops land in your list the moment they appear.",
        },
      ]}
      extra={<AgentCircuitSection />}
      ctaTitle="Start shopping in minutes."
    />
  );
}
