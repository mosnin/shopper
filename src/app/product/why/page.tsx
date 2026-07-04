import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Why Shopper | Shopper",
  description:
    "Why a tool built for shopping beats a basic AI chat: it searches everywhere, checks sellers, keeps your lists, watches for deals, and the data is yours.",
};

export default function WhyShopperPage() {
  return (
    <FeaturePage
      eyebrow="Why Shopper"
      title="Built for shopping,"
      accent="not a chat that forgets"
      subtitle="A basic AI chat dumps a few links and forgets. Deal sites only show their own stock. Shopper searches everywhere, checks the sellers, keeps your lists, and watches for deals, all in one place you own."
      heroImage="https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=75&w=1600&auto=format&fit=crop"
      blocks={[
        {
          title: "Everywhere, not one store",
          body: "A basic chat searches whoever it has a deal with. Shopper looks across stores, marketplaces, and local sellers all at once, and opens a real browser for the tricky sites a plain search can't reach.",
        },
        {
          title: "Checked sellers, not just links",
          body: "Shopper checks sellers, stores, and makers against public business registries, so 'found it cheaper' comes with 'and here's who is actually selling it'.",
        },
        {
          title: "Lists that don't disappear",
          body: "Your wish list and shopping lists stay put, organized, and yours. Nothing scrolls away, nothing gets forgotten, and your search history makes the next search sharper.",
        },
        {
          title: "It keeps watching",
          body: "A chat stops when you close it. Shopper keeps watching in the background, on paid plans, so the used graphics card, the shoes in your size, or the right supplier finds you.",
        },
      ]}
      ctaTitle="Start shopping smarter, free."
    />
  );
}
