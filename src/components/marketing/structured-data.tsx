// Server component: emits SoftwareApplication JSON-LD for Shopper so search
// engines and agent crawlers can read plan pricing and category directly.
// No client-side behavior, no hooks: safe to render from any server page.
export function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Shopper",
    url: "https://shopper.sh",
    description:
      "Shopper is the shopping engine your agents run: connect over MCP and get web-wide hunts, seller vetting, standing Radar scans, and structured Wish List and Shopping List state, all grounded in your About You context.",
    applicationCategory: "ShoppingApplication",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "0",
          priceCurrency: "USD",
          billingIncrement: 1,
          unitCode: "MON",
        },
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "20",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "20",
          priceCurrency: "USD",
          billingIncrement: 1,
          unitCode: "MON",
        },
      },
      {
        "@type": "Offer",
        name: "Max",
        price: "49",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "49",
          priceCurrency: "USD",
          billingIncrement: 1,
          unitCode: "MON",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
