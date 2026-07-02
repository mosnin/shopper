import type { Metadata } from "next";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Radar | Shopper",
  description:
    "Standing scans that keep hunting after you stop asking: pre-owned GPUs at a good price, Gucci shoes size 10M under $400, cars, suppliers, anything.",
};

export default function SignalsPage() {
  return (
    <FeaturePage
      eyebrow="Radar"
      title="Scans that never"
      accent="stop hunting"
      subtitle="Some things are not for sale today at the price you want. Radar runs standing scans of the web, so the moment the right listing appears, it is already in your Wish List."
      blocks={[
        {
          title: "Set it once",
          body: "Describe what you are watching for: 'recently listed pre-owned GPUs at a good price', 'Gucci shoes size 10M under $400', a specific car, a supplier for a part. Radar keeps scanning on a schedule, no tab to keep open.",
        },
        {
          title: "Matches, not noise",
          body: "Scans carry your constraints: price ceilings, sizes, condition, location. What lands in your Wish List is a real match with a vetted seller, not an alert inbox to triage.",
        },
        {
          title: "The patient buyer wins",
          body: "The best deals go to whoever sees the listing first. Radar watches marketplaces and storefronts continuously, so your agent is the first to know, and can tell you the moment it matters.",
        },
        {
          title: "On paid plans",
          body: "Radar is part of Plus ($10/mo) and Pro ($20/mo). Pro extends scans to manufacturer and supplier sourcing, for buying that goes past the retail shelf.",
        },
      ]}
      ctaTitle="Catch the listing the moment it appears."
    />
  );
}
