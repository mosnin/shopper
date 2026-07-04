"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

// "Shop anything" - the breadth statement. Adapted from a category-card grid to
// Shopper's palette and voice: warm brown tiles, cream text, no external stock
// photos so nothing breaks and it reads on-brand. Drop a real photo in per tile
// by setting `image` (rendered full-bleed under the brown gradient scrim).
type Category = {
  name: string;
  blurb: string;
  /** Optional background image URL. Omit for the gradient-only tile. */
  image?: string;
  /** Two brand-brown stops for the tile gradient (from -> to). */
  from: string;
  to: string;
};

const categories: Category[] = [
  { name: "Electronics & tech", blurb: "GPUs, cameras, a deal on last year's flagship", from: "#412D15", to: "#1F150C" },
  { name: "Fashion & sneakers", blurb: "That grail in your exact size, at your price", from: "#6B4E2A", to: "#2A1D10" },
  { name: "Auto & parts", blurb: "A project car, or the part that's always sold out", from: "#4E3A1E", to: "#1F150C" },
  { name: "Home & moving", blurb: "Furnish a place from empty, on a budget", from: "#5A431F", to: "#241708" },
  { name: "Groceries & supplies", blurb: "The recurring list, restocked and checked off", from: "#3E2C14", to: "#1A1109" },
  { name: "Collectibles & rare finds", blurb: "The thing that only shows up on forums", from: "#6B4E2A", to: "#332412" },
  { name: "Business supplies", blurb: "Bulk orders, better sellers, cleaner margins", from: "#4A3419", to: "#1F150C" },
  { name: "Manufacturers & sourcing", blurb: "Go past the middleman, straight to the maker", from: "#5A431F", to: "#241708" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function CategoriesSection() {
  const reduce = useReducedMotion();
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Shop anything</p>
          <h2 className="font-brand mt-3 text-3xl tracking-tight text-foreground sm:text-4xl">
            If it's for sale, your agent can{" "}
            <span className="text-gradient-orange">hunt it down</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Shopper is not a fixed catalog. Point an agent at any category and it
            works the whole web: marketplaces, forums, local sellers, and makers.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <motion.div
              key={c.name}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: EASE }}
            >
              <Link
                href="/sign-up"
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-border/60"
                style={{ backgroundImage: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
              >
                {c.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                  />
                )}
                {/* Brown scrim so cream text always reads, image or not */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F150C]/85 via-[#1F150C]/25 to-transparent" />
                <div className="absolute inset-0 flex items-end p-5">
                  <div>
                    <h3 className="font-brand text-base font-semibold text-[#F3EFE1]">{c.name}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#F3EFE1]/70">{c.blurb}</p>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#F3EFE1] opacity-80 transition-opacity group-hover:opacity-100">
                      Start a hunt
                      <span className="transition-transform duration-300 group-hover:translate-x-0.5">-&gt;</span>
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
