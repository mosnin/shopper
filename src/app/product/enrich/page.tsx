import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Vet sellers | Shopper",
  description:
    "Before money moves, every seller your agent finds is vetted against GLEIF, Companies House, and SEC EDGAR, so a find is something you can act on.",
};

export default function EnrichPage() {
  return (
    <FeaturePage
      eyebrow="Vet sellers"
      title="Vetted before"
      accent="money moves"
      subtitle="A great price from a store that does not really exist is not a deal. Every seller, store, and maker your agent finds is checked against public registries, GLEIF, Companies House, and SEC EDGAR, so the find that lands in your list is one you can act on."
      heroImage="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=75&w=1600&auto=format&fit=crop"
      blocks={[
        {
          title: "Real registries, not vibes",
          body: "Sellers are checked against GLEIF, Companies House, and SEC EDGAR, so 'is this store a real company' gets answered by the official record, not by the store's own About page.",
        },
        {
          title: "Structured records your agents share",
          body: "Every seller, store, and maker behind a find is saved as structured state: who they are, where they are registered, and what the engine has learned over time. Every agent you connect reads the same record.",
        },
        {
          title: "Honest blanks over confident guesses",
          body: "If a seller cannot be verified, the find says so. An unchecked seller is flagged plainly, never dressed up, so you and your agent always know how much to trust an option.",
        },
        {
          title: "Straight to the manufacturer",
          body: "On Pro, vetting goes past the retail shelf: your agent can source manufacturers and suppliers directly and check each one against the same registries. Built for resellers and teams buying at volume.",
        },
      ]}
      ctaTitle="Buy from sellers you can trust."
    />
  );
}
