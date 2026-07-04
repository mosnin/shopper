"use client";

// Fluid spatial hero, adapted for Shopper. A canvas of floating product images
// drifts behind a stationary liquid-glass prompt box: "tell your agent what to
// hunt." Only the background moves; the headline and box hold still so the copy
// stays readable. Palette is white with yellow/green/blue accents, wordmark is
// Space Grotesk (font-brand), and the send action routes to sign-up. Honors
// prefers-reduced-motion and mounts client-side so positions are stable.

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { ArrowRight, Plus, ScanSearch, ChevronDown } from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";

const random = (min: number, max: number) => Math.random() * (max - min) + min;

export type FloatingImage = {
  src: string;
  className: string;
  initialRotate: number;
  duration: number;
};

// Curated product photography (Unsplash) - the things people shop for. Swap in
// your own by passing the `images` prop; these are on-brand-neutral defaults.
const defaultImages: FloatingImage[] = [
  { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=70&w=480&auto=format&fit=crop", className: "w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[260px] md:h-[260px] rounded-full", initialRotate: -3, duration: 3.5 },
  { src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=70&w=480&auto=format&fit=crop", className: "w-[180px] h-[220px] sm:w-[240px] sm:h-[280px] md:w-[300px] md:h-[340px] rounded-[40%_60%_60%_40%/60%_30%_70%_40%]", initialRotate: 4, duration: 4.2 },
  { src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=70&w=480&auto=format&fit=crop", className: "w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] rounded-[30%_70%_70%_30%/30%_30%_70%_70%]", initialRotate: -5, duration: 3.8 },
  { src: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=70&w=480&auto=format&fit=crop", className: "w-[180px] h-[140px] sm:w-[260px] sm:h-[200px] md:w-[320px] md:h-[260px] rounded-[50px]", initialRotate: 6, duration: 4.0 },
  { src: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=70&w=480&auto=format&fit=crop", className: "w-[140px] h-[180px] sm:w-[180px] sm:h-[240px] md:w-[240px] md:h-[300px] rounded-full", initialRotate: 2, duration: 3.6 },
  { src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=70&w=480&auto=format&fit=crop", className: "w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[300px] md:h-[300px] rounded-[40%_60%_50%_50%/50%_50%_50%_50%]", initialRotate: -4, duration: 4.5 },
  { src: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=70&w=480&auto=format&fit=crop", className: "w-[140px] h-[200px] sm:w-[200px] sm:h-[280px] md:w-[260px] md:h-[340px] rounded-[60px]", initialRotate: 7, duration: 3.4 },
  { src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=70&w=480&auto=format&fit=crop", className: "w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] rounded-full", initialRotate: -2, duration: 4.1 },
  { src: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=70&w=480&auto=format&fit=crop", className: "w-[180px] h-[140px] sm:w-[260px] sm:h-[200px] md:w-[320px] md:h-[260px] rounded-[35%_65%_65%_35%/35%_35%_65%_65%]", initialRotate: 5, duration: 3.9 },
  { src: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=70&w=480&auto=format&fit=crop", className: "w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] md:w-[260px] md:h-[260px] rounded-full", initialRotate: -6, duration: 4.3 },
  { src: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=70&w=480&auto=format&fit=crop", className: "w-[180px] h-[220px] sm:w-[240px] sm:h-[280px] md:w-[300px] md:h-[340px] rounded-[45%_55%_60%_40%/55%_45%_55%_45%]", initialRotate: 3, duration: 3.7 },
  { src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=70&w=480&auto=format&fit=crop", className: "w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] rounded-[50px]", initialRotate: -7, duration: 4.4 },
  { src: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=70&w=480&auto=format&fit=crop", className: "w-[140px] h-[180px] sm:w-[200px] sm:h-[260px] md:w-[260px] md:h-[320px] rounded-full", initialRotate: 4, duration: 3.3 },
  { src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=70&w=480&auto=format&fit=crop", className: "w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[300px] md:h-[300px] rounded-[40%_60%_55%_45%/50%_50%_50%_50%]", initialRotate: -3, duration: 4.6 },
  { src: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=70&w=480&auto=format&fit=crop", className: "w-[160px] h-[140px] sm:w-[220px] sm:h-[200px] md:w-[280px] md:h-[260px] rounded-[60px]", initialRotate: 6, duration: 3.2 },
  { src: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=70&w=480&auto=format&fit=crop", className: "w-[180px] h-[220px] sm:w-[240px] sm:h-[300px] md:w-[280px] md:h-[360px] rounded-full", initialRotate: -7, duration: 4.3 },
];

// Bright blob backdrop: yellow, green, blue, sky on the white canvas.
const blobs = [
  { color: "#3B82F6", anim: { scale: [1, 1.2, 1], rotate: [0, 90, 0] }, duration: 20, className: "top-[-10%] left-[-10%] w-[60vw] h-[60vw] blur-[100px] md:blur-[140px] opacity-40 dark:opacity-30" },
  { color: "#22C55E", anim: { scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }, duration: 25, className: "top-[20%] right-[-10%] w-[50vw] h-[50vw] blur-[100px] md:blur-[140px] opacity-35 dark:opacity-25" },
  { color: "#FACC15", anim: { scale: [1, 1.3, 1], rotate: [0, 45, 0] }, duration: 22, className: "bottom-[-20%] left-[20%] w-[70vw] h-[70vw] blur-[120px] md:blur-[160px] opacity-35 dark:opacity-20" },
  { color: "#38BDF8", anim: { scale: [1.1, 0.9, 1.1], rotate: [0, -45, 0] }, duration: 18, className: "bottom-[-10%] right-[10%] w-[40vw] h-[40vw] blur-[100px] md:blur-[120px] opacity-40 dark:opacity-20" },
];

const PROMPTS = [
  "A comfy office chair under $200",
  "Running shoes, size 10, on sale",
  "The best deal on an air fryer",
  "A birthday gift for a coffee lover",
];

type Positioned = FloatingImage & { style: { top: string; left: string } };

export default function FluidSpatialHero({ images = defaultImages }: { images?: FloatingImage[] }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [placed, setPlaced] = useState<Positioned[]>([]);
  const [prompt, setPrompt] = useState("");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const canvasX = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.8 });
  const canvasY = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.8 });

  useEffect(() => {
    setMounted(true);
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    // On phones, place far fewer tiles: the image payload and compositing cost
    // are the main reason the hero felt heavy on mobile.
    const count = mobile ? 7 : 16;
    const rows = 4, cols = 4;
    const cells = Array.from({ length: 16 }, (_, i) => i).sort(() => Math.random() - 0.5);
    setPlaced(
      images.slice(0, count).map((img, i) => {
        const cell = cells[i] ?? i;
        const row = Math.floor(cell / cols);
        const col = cell % cols;
        const cw = 100 / cols, ch = 100 / rows;
        return {
          ...img,
          style: {
            left: `${random(col * cw + 2, (col + 1) * cw - 12)}%`,
            top: `${random(row * ch + 2, (row + 1) * ch - 12)}%`,
          },
        };
      }),
    );

    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const onMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [images, mouseX, mouseY]);

  const normX = useTransform(canvasX, (x: number) => (windowSize.width === 0 ? 0 : (x / windowSize.width - 0.5) * 2));
  const normY = useTransform(canvasY, (y: number) => (windowSize.height === 0 ? 0 : (y / windowSize.height - 0.5) * 2));
  const translateX = useTransform(normX, [-1, 1], [350, -350]);
  const translateY = useTransform(normY, [-1, 1], [350, -350]);
  function submit() {
    router.push("/sign-up");
  }

  const stillBlobs = reduce || isMobile;

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-background pt-20 transition-colors duration-500 sm:pt-24">
      {/* Soft brand wash at the very top so the area behind the floating header
          reads intentional instead of a blank white gap. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-48 bg-[linear-gradient(to_bottom,rgba(37,99,235,0.10),transparent)]" />

      {/* Blob backdrop. Static on phones (animating giant blurs was a big cost). */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            aria-hidden
            animate={stillBlobs ? undefined : b.anim}
            transition={{ duration: b.duration, repeat: Infinity, ease: "linear" }}
            className={`absolute rounded-full mix-blend-multiply dark:mix-blend-screen ${b.className}`}
            style={{ backgroundColor: b.color }}
          />
        ))}
      </div>

      {/* Floating product canvas (4x4, zero overlap). Hidden pre-mount. */}
      {mounted && (
        <motion.div
          className="absolute z-10 h-[250vh] w-[250vw] left-[-75vw] top-[-75vh]"
          style={reduce ? undefined : { x: translateX, y: translateY }}
        >
          {placed.map((img, index) => (
            <motion.div
              key={index}
              className={`absolute overflow-hidden border border-primary/10 bg-card shadow-[0_16px_40px_rgba(15,23,42,0.12)] dark:border-white/5 dark:bg-black/40 dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)] ${img.className}`}
              style={img.style}
              initial={{ rotate: img.initialRotate }}
              animate={stillBlobs ? undefined : {
                y: [0, -40, 0],
                x: [0, 20, 0],
                rotate: [img.initialRotate, img.initialRotate + 5, img.initialRotate],
              }}
              transition={{ duration: img.duration, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }}
            >
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-white/25 to-transparent mix-blend-overlay dark:from-white/10 dark:mix-blend-lighten" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt=""
                aria-hidden
                loading="lazy"
                className="pointer-events-none h-full w-full object-cover transition-opacity duration-500 dark:opacity-90"
                draggable={false}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Headline + liquid-glass prompt box. Stationary on purpose: only the
          background canvas drifts, so the text stays perfectly readable. */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 px-4 pointer-events-none md:gap-8">
        <div className="mt-[-4vh] flex flex-col items-center text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary sm:text-sm">
            Your personal shopper, powered by AI
          </p>
          <h1 className="font-brand mb-3 bg-gradient-to-b from-[#0F172A] to-[#2563EB] bg-clip-text text-5xl font-bold tracking-tighter text-transparent transition-all duration-500 dark:from-white dark:to-[#60A5FA] sm:text-7xl md:mb-4 md:text-8xl">
            Shopper
          </h1>
          <p className="max-w-lg text-center text-base font-medium leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            Tell Shopper what you are looking for. It searches the whole internet,
            finds the best price, and keeps every option in one simple list.
          </p>
        </div>

        {/* Liquid-glass prompt box */}
        <div className="pointer-events-auto relative mx-auto flex w-[calc(100%-2rem)] max-w-[760px] flex-col gap-3 rounded-[2rem] border border-white/40 bg-card/40 p-4 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12),inset_0_1px_2px_rgba(255,255,255,0.7)] backdrop-blur-2xl transition-all duration-500 hover:bg-card/55 dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)] sm:gap-4 sm:rounded-[2.5rem] sm:p-5 md:p-6">
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/50 via-white/5 to-transparent opacity-70 dark:from-white/15 sm:rounded-[2.5rem]" />

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
            }}
            placeholder={`e.g. ${PROMPTS[0]}`}
            className="relative z-10 min-h-[80px] w-full resize-none bg-transparent pt-1 text-lg font-normal text-foreground outline-none transition-colors duration-500 selection:bg-primary/20 placeholder:text-muted-foreground/70 sm:min-h-[96px] sm:pt-2 sm:text-xl md:min-h-[112px] md:text-2xl"
          />

          <div className="relative z-10 mt-1 flex flex-row items-center justify-between sm:mt-2">
            {/* Left: attach + deep-shop chips (decorative on the logged-out hero) */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <button
                type="button"
                onClick={submit}
                aria-label="Start a hunt"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground shadow-sm transition-all hover:bg-background/90 hover:text-foreground sm:h-10 sm:w-10 md:h-12 md:w-12"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                type="button"
                onClick={submit}
                className="flex h-9 items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 text-muted-foreground shadow-sm transition-all hover:bg-background/90 hover:text-foreground sm:h-10 sm:gap-2 sm:px-4 md:h-12 md:px-5"
              >
                <ScanSearch className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-xs font-medium sm:text-sm">Any store</span>
              </button>
            </div>

            {/* Right: plan chip + send */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <button
                type="button"
                onClick={submit}
                className="flex h-9 items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 text-foreground shadow-sm transition-all hover:bg-background/90 sm:h-10 sm:gap-2 sm:px-4 md:h-12 md:px-5"
              >
                <LogoMark className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap text-xs font-medium sm:text-sm">Free plan</span>
                <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_6px_rgba(22,163,74,0.5)]" />
                <ChevronDown className="h-3 w-3 opacity-40 sm:h-3.5 sm:w-3.5" />
              </button>
              <button
                type="button"
                onClick={submit}
                aria-label="Send to your agent"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_3px_10px_rgba(15,23,42,0.2)] transition-all hover:-translate-y-0.5 hover:brightness-110 sm:h-10 sm:w-10 md:h-12 md:w-12"
              >
                <ArrowRight className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Real secondary path, so the hero always has a plain link out. */}
        <Link
          href="/pricing"
          className="pointer-events-auto text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Free to start, then Plus $10 or Pro $20 a month. See pricing.
        </Link>
      </div>

    </section>
  );
}
