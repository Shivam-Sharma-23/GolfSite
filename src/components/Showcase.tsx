import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { Eyebrow, ArrowRight, SplitLines } from "./primitives";

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
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 0px)", () => {
        // Staggered card entrance.
        gsap.from(".showcase-card", {
          y: 48,
          autoAlpha: 0,
          duration: 0.9,
          ease: EASE.out,
          stagger: 0.09,
          scrollTrigger: {
            trigger: grid.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });

        // Gentle parallax inside each image window (image is pre-scaled so
        // the drift never exposes edges). Runs on a wrapper so it never
        // fights the CSS hover-zoom transition on the <img> itself.
        gsap.utils.toArray<HTMLElement>(".showcase-parallax").forEach((layer) => {
          const card = layer.closest(".showcase-card");
          gsap.fromTo(
            layer,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="lineup" className="section-fade relative bg-base-2 px-5 py-24 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-[1400px]">
        {/* Heading row */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <div data-scrub>
              <Eyebrow>The Collection</Eyebrow>
            </div>
            <SplitLines className="mt-4 font-display text-[clamp(2.1rem,5vw,3.6rem)] font-light leading-[1.0] tracking-[-0.02em] text-fg">
              The 2026 Lineup
            </SplitLines>
          </div>
          <p data-scrub className="hidden max-w-xs text-right text-sm leading-relaxed text-muted md:block">
            Drivers, irons, balls and apparel — engineered as one coherent system.
          </p>
        </div>

        {/* Grid */}
        <div ref={grid} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-7">
          {PRODUCTS.map((p) => (
            <article
              key={p.n}
              className="showcase-card group relative overflow-hidden rounded-2xl border border-line bg-surface"
            >
              <div className="relative h-[34vh] min-h-[200px] max-h-[420px] overflow-hidden lg:h-[38vh]">
                <div className="showcase-parallax h-full w-full will-change-transform">
                  <img
                    src={p.img}
                    alt={`${p.name} ${p.category}`}
                    loading="lazy"
                    className="h-full w-full scale-[1.16] object-cover transition-transform duration-500 ease-[var(--ease-quiet)] group-hover:scale-[1.2]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
                <span className="absolute left-4 top-4 font-display text-sm text-fg/70">
                  {p.n}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[0.68rem] uppercase tracking-[0.22em] text-accent">
                      {p.category}
                    </div>
                    <h3 className="mt-1.5 font-display text-xl text-fg">{p.name}</h3>
                    <p className="mt-1 text-[0.8rem] text-muted">{p.spec}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-fg">{p.price}</span>
                </div>

                {/* Product CTA — full-width, fills accent on hover (matches the
                    card interaction language; primary lift is reserved for the
                    page-level CTAs, not repeated on every card). */}
                <button
                  type="button"
                  aria-label={`Add ${p.name} to bag`}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line-strong px-5 py-3 text-[0.88rem] font-medium text-fg transition-[background-color,border-color,color,transform] duration-200 ease-[var(--ease-quiet)] hover:border-accent hover:bg-accent hover:text-base active:scale-[0.98]"
                >
                  Add to Bag
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
