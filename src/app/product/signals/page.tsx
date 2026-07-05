import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Radar | Shopper",
  description:
    "Radar standing scans watch the web 24/7 for the items your agent is hunting: pre-owned GPUs, shoes in your size, parts, anything. Matches land in your list the moment they appear. Plus gets 5 scans, Pro gets 25.",
};

export default function SignalsPage() {
  return (
    <FeaturePage
      eyebrow="Radar"
      title="Standing scans that watch"
      accent="the web 24/7"
      subtitle="Some things are not for sale today at the price you want. Your agent sets a Radar scan once, and the engine keeps hunting around the clock, so the moment the right listing shows up at the right price, it is already in your list."
      heroImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=75&w=1600&auto=format&fit=crop"
      blocks={[
        {
          title: "One tool call, a standing hunt",
          body: "Your agent describes what you are waiting for: a pre-owned RTX 4090 under $1,100, a size 10M loafer under $400, a specific part. Radar takes it from there, with no tab to leave open and no saved search to remember.",
        },
        {
          title: "Matches, not noise",
          body: "Radar runs against your limits: price ceiling, size, condition, location, pulled from the same About You context every connected agent shares. What lands in your list is a real match from a vetted seller, not an inbox full of alerts.",
        },
        {
          title: "The patient agent wins",
          body: "The best deals go to whoever spots the listing first. Radar watches marketplaces, forums, and storefronts around the clock, so your agent is first to the find, and you hear about it the moment it matters.",
        },
        {
          title: "On paid plans",
          body: "Radar comes with Plus ($10/mo, 5 standing scans) and Pro ($20/mo, 25 standing scans). Pro also watches manufacturers and suppliers, for buying that goes past the retail shelf.",
        },
      ]}
      ctaTitle="Put a Radar scan on it."
    />
  );
}
