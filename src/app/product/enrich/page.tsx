import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Vet sellers | Shopper",
  description:
    "Every find comes with a seller you can judge: checked against GLEIF, Companies House, and SEC EDGAR, and enriched into a record you own.",
};

export default function EnrichPage() {
  return (
    <FeaturePage
      eyebrow="Vet sellers"
      title="Know who you're"
      accent="buying from"
      subtitle="A great price from a ghost store is not a deal. Shopper vets sellers, stores, and manufacturers against real corporate registries and enriches each one into a record you can judge before you pay."
      blocks={[
        {
          title: "Real registries, not vibes",
          body: "Sellers are checked against GLEIF, Companies House, and SEC EDGAR, so 'is this store a real company' gets an answer from the record, not from the store's own About page.",
        },
        {
          title: "Enriched on the way in",
          body: "Every seller, store, and manufacturer attached to a find becomes a structured record in your Wish List: who they are, where they are registered, and what your agents have learned about them.",
        },
        {
          title: "Honest blanks over confident guesses",
          body: "If Shopper cannot verify a seller, it says so. An unvetted seller is flagged, not dressed up, so you always know how much weight a find can carry.",
        },
        {
          title: "Manufacturer & supplier sourcing",
          body: "On the Pro plan, vetting extends upstream: agents source and vet manufacturers and suppliers directly, for business buying that goes past the retail shelf.",
        },
      ]}
      ctaTitle="Buy from sellers you can judge."
    />
  );
}
