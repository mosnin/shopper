import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Know the seller | Shopper",
  description:
    "Every option comes with a seller you can judge: checked against public business registries so you know who you're buying from before you pay.",
};

export default function EnrichPage() {
  return (
    <FeaturePage
      eyebrow="Know the seller"
      title="Know who you're"
      accent="buying from"
      subtitle="A great price from a store that doesn't really exist is not a deal. Shopper checks sellers, stores, and makers against public business registries, so you can tell who is real before you hand over any money."
      heroImage="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=75&w=1600&auto=format&fit=crop"
      blocks={[
        {
          title: "Real records, not vibes",
          body: "Sellers are checked against public business registries, so 'is this store a real company' gets answered by the official record, not by the store's own About page.",
        },
        {
          title: "The full picture, saved for you",
          body: "Every seller, store, and maker behind an option is saved to your list: who they are, where they are registered, and what Shopper has learned about them over time.",
        },
        {
          title: "Honest blanks over confident guesses",
          body: "If Shopper cannot verify a seller, it says so. An unchecked seller is flagged plainly, never dressed up, so you always know how much to trust an option.",
        },
        {
          title: "Straight from the maker",
          body: "On the Pro plan, this goes further: Shopper can find and check manufacturers and suppliers directly, for buying at work that goes past the retail shelf.",
        },
      ]}
      ctaTitle="Buy from sellers you can trust."
    />
  );
}
