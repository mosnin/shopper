import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Find anything | Shopper",
  description:
    "Tell Shopper what you want and it searches across stores, marketplaces, and local sellers, then saves every option with its price and seller to a list you own.",
};

export default function DiscoverPage() {
  return (
    <FeaturePage
      eyebrow="Find anything"
      title="Search every store,"
      accent="from one sentence"
      subtitle="Just say what you want: a used graphics card at a good price, a lamp they stopped making, a reliable parts supplier. Shopper searches across stores, marketplaces, and local sellers, and saves every option, with its price and seller, to your wish list."
      heroImage="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=75&w=1600&auto=format&fit=crop"
      blocks={[
        {
          title: "Everywhere at once, not one store",
          body: "Shopper is not a single storefront with a search box. It looks across marketplaces, independent stores, maker sites, and listings all over the web at the same time, so the best option wins, not the easiest one to find.",
        },
        {
          title: "It looks where a search box can't",
          body: "Some of the best deals hide on marketplaces, forums, and finicky sites. Shopper opens a real browser and works through them the way you would, so the good stuff a plain search misses still turns up.",
        },
        {
          title: "Options you can trust",
          body: "Every option lands in your list with the details laid out: the item, the price, the seller, and where it came from. Sellers are checked against public business registries before you spend a cent.",
        },
        {
          title: "Use it here, or with your AI",
          body: "You can just use Shopper here and it does the searching for you. If you already use AI assistants like ChatGPT or Claude, you can connect them too, and they shop through the same lists.",
        },
      ]}
      ctaTitle="Let Shopper do the searching."
    />
  );
}
