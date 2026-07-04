import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Deal alerts | Shopper",
  description:
    "Shopper keeps watching after you stop looking: a used graphics card at a good price, a certain pair of shoes under $400, cars, anything. It tells you the moment a match appears.",
};

export default function SignalsPage() {
  return (
    <FeaturePage
      eyebrow="Deal alerts"
      title="It keeps watching"
      accent="so you don't have to"
      subtitle="Some things just aren't for sale today at the price you want. Shopper keeps watching in the background, so the moment the right listing shows up at the right price, it's already in your list."
      heroImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=75&w=1600&auto=format&fit=crop"
      blocks={[
        {
          title: "Set it once",
          body: "Describe what you're waiting for: a used graphics card at a good price, a certain pair of shoes under $400, a specific car, a part you need. Shopper keeps checking on its own, with no tab to leave open.",
        },
        {
          title: "Matches, not noise",
          body: "It remembers your limits: your price ceiling, your size, the condition you want, where you are. What lands in your list is a real match from a checked seller, not an inbox full of alerts to sort through.",
        },
        {
          title: "The patient shopper wins",
          body: "The best deals go to whoever spots the listing first. Shopper watches marketplaces and stores around the clock, so you're the first to know, and you hear about it the moment it matters.",
        },
        {
          title: "On paid plans",
          body: "Deal alerts are part of Plus ($10/mo) and Pro ($20/mo). Pro adds watching for manufacturers and suppliers too, for buying that goes past the retail shelf.",
        },
      ]}
      ctaTitle="Catch the deal the moment it appears."
    />
  );
}
