import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/utils/cn";
import { Eyebrow, PlusIcon, Reveal } from "./primitives";

type Product = {
  n: string;
  category: string;
  name: string;
  spec: string;
  price: string;
  img: string;
};

const PRODUCTS: Product[] = [
  { n: "01", category: "Driver", name: "Meridian One", spec: "460cc · C300 steel face", price: "$649", img: "/images/product-driver.jpg" },
  { n: "02", category: "Irons", name: "Forged MB", spec: "5–PW · 1025 carbon steel", price: "$1,499", img: "/images/product-irons.jpg" },
  { n: "03", category: "Ball", name: "Tour Pro", spec: "4-piece urethane cover", price: "$58 / doz", img: "/images/product-ball.jpg" },
  { n: "04", category: "Apparel", name: "Performance Kit", spec: "Polo + structured cap", price: "$148", img: "/images/product-apparel.jpg" },
];

export default function Showcase() {
  const reduced = useReducedMotion();
  const section = useRef<HTMLDivElement>(null);
  const trackWrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const trackEl = track.current!;
        const sectionEl = section.current!;
        // Measure against the wrapper width (not the full viewport) so the
        // final card lands with breathing room rather than overshooting.
        const amount = () =>
          Math.max(0, trackEl.scrollWidth - (trackWrap.current?.clientWidth ?? window.innerWidth));

        gsap.set(trackEl, { willChange: "transform" });

        const tween = gsap.to(trackEl, {
          x: () => -amount(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            end: () => "+=" + amount(),
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress.current) {
                progress.current.style.transform = `scaleX(${self.progress})`;
              }
              if (counter.current) {
                const idx = Math.min(PRODUCTS.length, Math.floor(self.progress * PRODUCTS.length) + 1);
                counter.current.textContent = String(idx).padStart(2, "0") + " / 0" + PRODUCTS.length;
              }
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: section }
  );

  return (
    <section ref={section} id="lineup" className="relative bg-base-2">
      {/* Desktop: pinned full-height; mobile: stacked block */}
      <div className="flex min-h-screen flex-col justify-between px-5 py-24 sm:px-8 lg:min-h-[100svh] lg:py-16">
        {/* Heading row */}
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>The Collection</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2.1rem,5vw,3.6rem)] font-light leading-[1.0] tracking-[-0.02em] text-fg">
              The 2026 Lineup
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-relaxed text-muted md:block">
            Drivers, irons, balls and apparel — engineered as one coherent system.
          </p>
        </Reveal>

        {/* Track */}
        <div
          ref={trackWrap}
          className={cn(
            "no-scrollbar mt-10 flex snap-x snap-mandatory overflow-x-auto lg:mt-0",
            !reduced && "lg:overflow-visible"
          )}
        >
          <div
            ref={track}
            className="flex w-max gap-5 pr-[14vw] snap-start lg:gap-7 lg:pr-0 lg:pl-0"
          >
            {PRODUCTS.map((p) => (
              <article
                key={p.n}
                className="group relative w-[80vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-surface sm:w-[60vw] md:w-[42vw] lg:w-[26rem] xl:w-[30rem]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={p.img}
                    alt={`${p.name} ${p.category}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-quiet)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
                  <span className="absolute left-4 top-4 font-display text-sm text-fg/70">
                    {p.n}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-4 p-5">
                  <div>
                    <div className="text-[0.68rem] uppercase tracking-[0.22em] text-accent">
                      {p.category}
                    </div>
                    <h3 className="mt-1.5 font-display text-xl text-fg">{p.name}</h3>
                    <p className="mt-1 text-[0.8rem] text-muted">{p.spec}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="text-sm font-medium text-fg">{p.price}</span>
                    <button
                      type="button"
                      aria-label={`Add ${p.name} to bag`}
                      className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-fg transition-[background-color,border-color,transform] duration-200 ease-[var(--ease-quiet)] hover:border-accent hover:bg-accent hover:text-base"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Progress / counter (desktop) */}
        <div className="mt-10 flex items-center justify-between gap-6 lg:mt-0">
          <div className="h-px w-full max-w-xs overflow-hidden bg-line">
            <div
              ref={progress}
              className="h-full w-full origin-left scale-x-0 bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <span ref={counter} className="font-display text-sm text-muted">
            01 / 04
          </span>
        </div>
      </div>
    </section>
  );
}
