import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Your assistant | Shopper",
  description:
    "A built-in shopping assistant that searches everywhere, checks sellers, and keeps your Wish List and Shopping Lists current, or connect your own AI.",
};

export default function AgentPage() {
  return (
    <FeaturePage
      eyebrow="Your assistant"
      title="A shopper that"
      accent="actually shops"
      subtitle="Shopper comes with a built-in assistant that searches everywhere, checks sellers, saves options to your wish list, and works your shopping lists, all in plain conversation. And it remembers you between visits."
      heroImage="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=75&w=1600&auto=format&fit=crop"
      blocks={[
        {
          title: "It shops, it doesn't dump links",
          body: "Ask for 'a used graphics card under $1,100 from a seller I can trust' and it does the work: searches everywhere, checks the seller, and saves a clear option to your list, not ten blue links to sort through.",
        },
        {
          title: "It knows you",
          body: "Your sizes, tastes, and budgets are remembered and kept up to date, so the assistant never asks for your shoe size twice and what it finds actually fits you.",
        },
        {
          title: "It works your lists",
          body: "Give it a shopping list for the groceries, the move, or the workshop, and it keeps an eye on the list, tracks down the items, and checks things off as you buy them.",
        },
        {
          title: "Or connect your own AI",
          body: "Already use ChatGPT, Claude, Gemini, or another AI assistant? Connect it and it shops through the same lists, with the same searching and the same seller checks.",
        },
      ]}
      ctaTitle="Put a shopper on it."
    />
  );
}
