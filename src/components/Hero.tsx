import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { Button, Eyebrow, ArrowRight } from "./primitives";
import { PRELOADER_DONE_EVENT } from "./Preloader";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const textGroup = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(textGroup.current, { opacity: 1, y: 0 });
    });

    // Below lg: run the SAME scroll choreography as desktop, but scrubbed to
    // the hero's natural scroll-through instead of pinned, keeping every layout
    // dimension identical.
    //
    // The entrance .from() is deliberately NOT used here: on real mobile devices
    // a delayed/staggered .from() can leave the copy stuck at its (opacity:0)
    // start state, reading as "missing" paragraph/buttons/spec-strip. Copy stays
    // visible immediately; only scroll-tied motion is added on top.
    mm.add("(max-width: 1023px)", () => {
      gsap.set(".hero-rise", { opacity: 1, y: 0 });

      // Copy: translate + fade parallax as it scrolls off the top. Transform +
      // opacity only (GPU-cheap); a .to() so the resting state is fully visible.
      gsap.to(textGroup.current, {
        yPercent: -8,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: textGroup.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // Scroll cue (visible md+ only) fades on first scroll — cheap opacity tween.
      gsap.to(cue.current, {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "top -8%",
          scrub: true,
        },
      });
    });

    mm.add("(min-width: 1024px)", () => {
      // Hero entrance is held paused until the intro curtain begins lifting, so
      // the copy rises in as the site is revealed — not unseen underneath it.
      const entrance = gsap.timeline({ paused: true });
      entrance.from(".hero-rise", { y: 22, opacity: 0, duration: 0.9, ease: EASE.out, stagger: 0.12 });

      const play = () => entrance.play();
      if (window.__meridianRevealed) {
        entrance.delay(0.15).play();
      } else {
        window.addEventListener(PRELOADER_DONE_EVENT, play, { once: true });
      }

      gsap.set(textGroup.current, { willChange: "transform, opacity" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=95%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl
        .to(textGroup.current, { yPercent: -14 }, 0)
        .to(textGroup.current, { autoAlpha: 0 }, 0.3)
        .to(cue.current, { autoAlpha: 0, duration: 0.15 }, 0)
        .to(glow.current, { scale: 1.6, autoAlpha: 0.65 }, 0)
        .to(glow.current, { autoAlpha: 0 }, 0.85);

      return () => window.removeEventListener(PRELOADER_DONE_EVENT, play);
    });

    return () => {
      mm.revert();
    };
  }, {});

  return (
    <section
      ref={root}
      id="top"
      className="relative min-h-screen w-full bg-base"
    >
      {/* Background image — backmost layer. Two art-directed crops: a tight
          landscape frame on desktop, a full-body portrait on phones. */}
      <img
        src="/images/hero-bg-desktop.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-center opacity-60 lg:block"
      />
      <img
        src="/images/hero-bg-mobile.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-60 lg:hidden"
      />
      {/* Scrim: horizontal fade keeps the left-hand copy legible over the image;
          the extra vertical wash gives stacked mobile copy its own contrast. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-base via-base/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-base/70 via-transparent to-base/70 lg:hidden" />

      {/* Ambient layers (static, atmospheric — no looping motion) */}
      <div
        ref={glow}
        className="pointer-events-none absolute left-1/2 top-[42%] h-[70vw] w-[70vw] max-h-[760px] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(198,255,58,0.16) 0%, rgba(198,255,58,0.05) 38%, transparent 68%)",
          filter: "blur(20px)",
        }}
      />
      <Topo className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.5]" />

      {/* Vertical editorial side label */}
      <span className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 rotate-180 text-[0.62rem] uppercase tracking-[0.4em] text-faint [writing-mode:vertical-rl] lg:block">
        Tour Series · Est. 2026
      </span>

      <div className="relative mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:pt-24">
        {/* ---- Copy ---- */}
        <div ref={textGroup} className="relative z-10 lg:col-span-6 lg:col-start-1">
          <div className="hero-rise">
            <Eyebrow>2026 Tour Series</Eyebrow>
          </div>

          <h1
            ref={headline}
            className="mt-6 font-display text-[clamp(2.7rem,7vw,5.6rem)] font-light leading-[1.04] tracking-[-0.02em] text-fg"
          >
            Distance,
            <br />
            dialed to perfection.
          </h1>

          <p className="hero-rise mt-7 max-w-md text-[1.02rem] leading-relaxed text-muted">
            Aerodynamically forged drivers, milled irons, and tour-grade balls —
            engineered in the workshop, proven under pressure on Sunday.
          </p>

          <div className="hero-rise mt-9 flex flex-wrap items-center gap-3">
            <Button href="#lineup" variant="primary">
              Explore the line
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
            <Button href="#flight" variant="ghost">
              See the flight
            </Button>
          </div>

          {/* Quiet spec strip */}
          <div className="hero-rise mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
            {[
              ["Ball speed", "+4.2 mph"],
              ["Forgiveness", "10k MOI"],
              ["Tour wins", "37"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="font-display text-xl text-fg">{v}</div>
                <div className="text-[0.68rem] uppercase tracking-[0.2em] text-faint">{k}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Scroll cue — static, not pulsing */}
      <div
        ref={cue}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-faint md:flex"
      >
        <span className="text-[0.62rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-line-strong to-transparent" />
      </div>
    </section>
  );
}

/* Faint topographic contour field — aerodynamic / precision motif (static). */
function Topo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="rgba(232,239,230,0.05)" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={i}
            d={`M -100 ${260 + i * 70} C 360 ${180 + i * 70}, 1080 ${360 + i * 70}, 1560 ${200 + i * 70}`}
          />
        ))}
      </g>
    </svg>
  );
}

// keep ScrollTrigger reference warm (registered once in lib/gsap)
void ScrollTrigger;
