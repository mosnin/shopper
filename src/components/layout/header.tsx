"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/brand/logo-mark";
import { UserButton, useAuth } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { AsciiField } from "@/components/dashboard/ascii-field";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type MenuLink = { label: string; href: string; description: string };

type Featured = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

type NavGroup = {
  label: string;
  links: MenuLink[];
  featured: Featured;
};

const groups: NavGroup[] = [
  {
    label: "Product",
    links: [
      { label: "Hunts", href: "/product/discover", description: "Your agent hunts the whole web for items for sale, from one ask." },
      { label: "Vet sellers", href: "/product/enrich", description: "Sellers checked against GLEIF, Companies House, and SEC EDGAR before money moves." },
      { label: "Radar", href: "/product/signals", description: "Standing scans that watch the web 24/7: pre-owned GPUs, size 10M Gucci, anything." },
      { label: "The agent", href: "/product/agent", description: "No agent of your own? A built-in one runs the same 52 tools." },
    ],
    featured: {
      eyebrow: "New",
      title: "Deep shopping",
      body: "Your agent gets a real browser session for forums, marketplaces, and js-heavy storefronts.",
      href: "/product/discover",
      cta: "See how agents hunt",
    },
  },
  {
    label: "Solutions",
    links: [
      { label: "Why Shopper", href: "/product/why", description: "A real engine, not a stateless shopping MCP bolted onto an LLM provider." },
      { label: "For agent builders", href: "/integrations", description: "One line over MCP: https://shopper.sh/api/mcp, OAuth or API key, 52 tools." },
      { label: "Data you own", href: "/security", description: "Wish list, lists, and About You: shared by your agents, exportable, never resold." },
      { label: "Pricing", href: "/pricing", description: "Free to start. Plus $10/mo, Pro $20/mo. Agents can pay in USDC over x402." },
    ],
    featured: {
      eyebrow: "The thesis",
      title: "The shopping engine for AI agents",
      body: "Web-wide hunts, seller vetting, Radar scans, and shared state every connected agent works from.",
      href: "/product/why",
      cta: "See why",
    },
  },
  {
    label: "Developers",
    links: [
      { label: "Connect your agent", href: "/connect", description: "One line points any MCP client at Shopper. OAuth or API key." },
      { label: "MCP tools", href: "/tools", description: "All 52 tools your agent gets: hunts, lists, vetting, memory, self-pay." },
      { label: "Integrations", href: "/integrations", description: "Claude Code, Cursor, Codex, OpenClaw, Hermes, and anything that speaks MCP." },
      { label: "FAQ", href: "/faq", description: "The honest answers: tools, plans, x402, and what agents can actually do." },
    ],
    featured: {
      eyebrow: "Copy, paste, done",
      title: "Connect in one line",
      body: "claude mcp add --transport http shopper https://shopper.sh/api/mcp",
      href: "/connect",
      cta: "Connect your agent",
    },
  },
];

// Direct links (no mega menu), Apple-style.
const directLinks = [
  { label: "Connect", href: "/connect" },
  { label: "Pricing", href: "/pricing" },
];

/* ----------------------------- Mega menu panel ---------------------------- */

function MegaPanel({ group }: { group: NavGroup }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={group.label}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, filter: "blur(4px)" }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 4, filter: "blur(4px)" }}
      transition={{ duration: 0.22, ease: EASE }}
      className="grid grid-cols-[1.2fr_1fr] gap-2 p-2.5"
    >
      {/* Links column */}
      <div className="grid grid-cols-1 gap-0.5">
        {group.links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="group/link rounded-2xl px-3.5 py-3 transition-colors hover:bg-muted/70 dark:hover:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{link.label}</p>
              <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-primary opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{link.description}</p>
          </Link>
        ))}
      </div>

      {/* Featured cell */}
      <Link
        href={group.featured.href}
        className="group/feat relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-muted/40 p-4 transition-colors hover:bg-muted/70 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
      >
        <AsciiField className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18] dark:opacity-30" cell={12} speed={0.07} gradient />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(37,99,235,0.16),transparent_60%)]" />
        <div className="relative">
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-primary">{group.featured.eyebrow}</p>
          <p className="mt-2 font-brand text-lg leading-tight text-foreground">{group.featured.title}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{group.featured.body}</p>
        </div>
        <div className="relative mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
          {group.featured.cta}
          <ArrowRight className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover/feat:translate-x-0.5" />
        </div>
      </Link>
    </motion.div>
  );
}

/* -------------------------------- Header ---------------------------------- */

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close everything on route change, the render-phase way (no effect needed):
  // when the path differs from the last render, reset and bail into a re-render.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setActive(null);
    setMobileOpen(false);
  }

  // Pill tightens and lifts once you leave the very top of the page.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll behind the full-screen mobile menu.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape closes the open mega menu.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setActive(null), 140);
  }, [cancelClose]);

  const activeGroup = groups.find((g) => g.label === active) ?? null;

  return (
    <>
      <header
        className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2"
        onMouseLeave={scheduleClose}
        onMouseEnter={cancelClose}
      >
        <motion.div
          animate={{
            paddingTop: scrolled ? 0 : 2,
            paddingBottom: scrolled ? 0 : 2,
          }}
          transition={{ duration: 0.3, ease: EASE }}
          className={cn(
            "rounded-full border backdrop-blur-2xl transition-shadow duration-300",
            scrolled
              ? "border-border bg-background/90 shadow-xl shadow-black/[0.06] ring-1 ring-inset ring-border/50 dark:border-white/10 dark:bg-charcoal/85 dark:shadow-black/40 dark:ring-white/5"
              : "border-border/70 bg-background/70 shadow-lg shadow-black/[0.03] ring-1 ring-inset ring-border/30 dark:border-white/[0.07] dark:bg-charcoal/65 dark:ring-white/5",
          )}
        >
          <div className="flex h-14 items-center justify-between pl-4 pr-3 sm:pl-5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2" aria-label="Shopper home">
              <LogoMark className="h-7 w-7" priority />
              <span className="hidden font-brand text-base font-bold text-foreground sm:inline">Shopper</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-0.5 lg:flex">
              {groups.map((group) => {
                const isOpen = active === group.label;
                return (
                  <button
                    key={group.label}
                    type="button"
                    onMouseEnter={() => {
                      cancelClose();
                      setActive(group.label);
                    }}
                    onFocus={() => setActive(group.label)}
                    onClick={() => setActive(isOpen ? null : group.label)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    className={cn(
                      "flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                      isOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {group.label}
                    <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", isOpen && "rotate-180")} />
                  </button>
                );
              })}
              {directLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setActive(null)}
                  className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 lg:flex">
                <ThemeToggle />
                {!isSignedIn ? (
                  <>
                    <Link
                      href="/sign-in"
                      className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/sign-up"
                      className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
                    >
                      Get started
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                    <UserButton />
                  </>
                )}
              </div>

              {/* Mobile trigger */}
              <button
                type="button"
                aria-label="Open menu"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mega menu panel */}
        <AnimatePresence>
          {activeGroup && (
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.985 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.99 }}
              transition={{ duration: 0.26, ease: EASE }}
              className="absolute left-1/2 top-[calc(100%+0.6rem)] hidden w-[min(92vw,720px)] -translate-x-1/2 overflow-hidden rounded-[1.75rem] border border-border bg-background/95 shadow-2xl shadow-black/10 ring-1 ring-inset ring-border/50 backdrop-blur-2xl lg:block dark:border-white/10 dark:bg-charcoal/95 dark:shadow-black/50 dark:ring-white/5"
              onMouseEnter={cancelClose}
            >
              <AnimatePresence mode="wait">
                <MegaPanel key={activeGroup.label} group={activeGroup} />
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[100] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-background/97 backdrop-blur-xl dark:bg-charcoal-dark/95" />
            <AsciiField className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] dark:opacity-30" cell={14} speed={0.09} gradient />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,rgba(37,99,235,0.18),transparent_60%)]" />

            <motion.div
              className="relative flex h-full flex-col overflow-y-auto"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <div className="flex items-center justify-between px-5 pt-6">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <LogoMark className="h-7 w-7" />
                  <span className="font-brand font-bold text-foreground">Shopper</span>
                </Link>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-foreground transition-colors hover:bg-muted/80 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/10"
                    onClick={() => setMobileOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <motion.nav
                className="flex-1 space-y-8 px-5 py-9"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }}
                initial="hidden"
                animate="show"
              >
                {groups.map((group) => (
                  <div key={group.label}>
                    <motion.p
                      variants={{
                        hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
                        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } },
                      }}
                      className="text-xs uppercase tracking-[0.3em] text-primary/80"
                    >
                      {group.label}
                    </motion.p>
                    <div className="mt-3 space-y-1">
                      {group.links.map((link) => (
                        <motion.div
                          key={link.label}
                          variants={{
                            hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
                            show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } },
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block font-brand text-3xl leading-tight text-foreground/90 transition-colors hover:text-primary"
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.nav>

              <div className="space-y-3 border-t border-border px-5 pb-9 pt-5">
                {!isSignedIn ? (
                  <>
                    <Link
                      href="/sign-up"
                      onClick={() => setMobileOpen(false)}
                      className="flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                    >
                      Get started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileOpen(false)}
                      className="flex h-12 w-full items-center justify-center rounded-full border border-border text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Sign in
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
