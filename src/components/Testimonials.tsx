import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Eyebrow } from "./primitives";

const FEATURED = {
  name: "Daniel Voss",
  title: "European Tour · 6× winner",
  quote:
    "The moment I put the One driver in play, my launch numbers changed overnight. It's the first club that feels engineered around my swing — not the other way around.",
  img: "/images/pro-portrait.jpg",
};

const QUOTES = [
  { name: "Maria Solano", title: "LPGA · Major champion", quote: "More distance, without losing the flight I trust in the wind." },
  { name: "Kaito Ren", title: "PGA Tour · Rookie of the Year", quote: "The forged irons spin exactly how I draw them up on the range." },
  { name: "Marcus Field", title: "Head Coach, Atlas Academy", quote: "We fit the entire squad in Meridian. The tolerances are simply unreal." },
];

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 0px)", () => {
        gsap.set(".testimonial-card", { opacity: 0, y: 30 });
        const batch = ScrollTrigger.batch(".testimonial-card", {
          start: "top 86%",
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, overwrite: true }
            ),
        });
        return () => batch.forEach((t) => t.kill());
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="athletes" className="relative bg-base px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Trusted on Tour</Eyebrow>
            <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,5vw,3.4rem)] font-light leading-[1.02] tracking-[-0.02em] text-fg">
              Proven by the players who chase titles.
            </h2>
          </div>
          <div className="flex gap-10">
            {[
              ["37", "Tour wins"],
              ["11", "Countries"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-3xl text-fg">{v}</div>
                <div className="text-[0.7rem] uppercase tracking-[0.2em] text-faint">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured athlete */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <figure className="relative overflow-hidden rounded-2xl border border-line lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="aspect-[4/5] sm:aspect-auto">
                <img
                  src={FEATURED.img}
                  alt={`${FEATURED.name}, ${FEATURED.title}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="flex flex-col justify-between gap-8 bg-surface p-7 sm:p-9">
                <blockquote className="font-display text-[1.35rem] font-light leading-[1.35] text-fg sm:text-2xl">
                  &ldquo;{FEATURED.quote}&rdquo;
                </blockquote>
                <div>
                  <div className="font-medium text-fg">{FEATURED.name}</div>
                  <div className="text-[0.78rem] uppercase tracking-[0.18em] text-accent">{FEATURED.title}</div>
                </div>
              </figcaption>
            </div>
          </figure>

          {/* Supporting quotes */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            {QUOTES.map((q) => (
              <figure
                key={q.name}
                className="testimonial-card rounded-2xl border border-line bg-surface p-6 sm:p-7"
              >
                <blockquote className="text-[1.02rem] leading-relaxed text-fg/90">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-base-2 font-display text-sm text-accent">
                    {q.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-fg">{q.name}</span>
                    <span className="block text-[0.72rem] uppercase tracking-[0.16em] text-faint">{q.title}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
