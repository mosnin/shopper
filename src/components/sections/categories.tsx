"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

// "Shop anything" - the breadth statement. Yellow/green/blue gradient tiles,
// white text, no external stock photos so nothing breaks and it reads on-brand.
// Drop a real photo in per tile by setting `image` (rendered full-bleed under
// the slate gradient scrim).
type Category = {
  name: string;
  blurb: string;
  /** Optional background image URL. Omit for the gradient-only tile. */
  image?: string;
  /** Two color stops for the tile gradient (from -> to). */
  from: string;
  to: string;
};

const categories: Category[] = [
  { name: "Electronics & tech", blurb: "GPUs, cameras, a deal on last year's flagship", from: "#2563EB", to: "#1E3A8A" },
  { name: "Fashion & sneakers", blurb: "That grail in your exact size, at your price", from: "#16A34A", to: "#14532D" },
  { name: "Auto & parts", blurb: "A project car, or the part that's always sold out", from: "#0EA5E9", to: "#075985" },
  { name: "Home & moving", blurb: "Furnish a place from empty, on a budget", from: "#CA8A04", to: "#713F12" },
  { name: "Groceries & supplies", blurb: "The recurring list, restocked and checked off", from: "#22C55E", to: "#166534" },
  { name: "Collectibles & rare finds", blurb: "The thing that only shows up on forums", from: "#3B82F6", to: "#1E40AF" },
  { name: "Business supplies", blurb: "Bulk orders, better sellers, cleaner margins", from: "#0891B2", to: "#164E63" },
  { name: "Manufacturers & sourcing", blurb: "Go past the middleman, straight to the maker", from: "#EAB308", to: "#854D0E" },
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
                {/* Slate scrim so white text always reads, image or not */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/85 via-[#0B1120]/25 to-transparent" />
                <div className="absolute inset-0 flex items-end p-5">
                  <div>
                    <h3 className="font-brand text-base font-semibold text-[#FFFFFF]">{c.name}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#FFFFFF]/70">{c.blurb}</p>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#FFFFFF] opacity-80 transition-opacity group-hover:opacity-100">
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
