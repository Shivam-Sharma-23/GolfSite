import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Eyebrow, Button, ArrowRight } from "./primitives";

export default function BallFlight() {
  const stage = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const ghost = useRef<SVGPathElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const ballWrap = useRef<HTMLDivElement>(null);
  const spin = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const stageEl = stage.current!;
        const ghostEl = ghost.current!;
        const trailEl = trail.current!;
        const svgEl = svg.current!;
        const ballEl = ballWrap.current!;
        const spinEl = spin.current!;
        const revealEl = reveal.current!;

        let killFns: Array<() => void> = [];
        let resizeTimer: ReturnType<typeof setTimeout>;

        const build = () => {
          const w = stageEl.clientWidth;
          const h = stageEl.clientHeight;
          // High tee-shot arc, computed in pixel space (1 unit = 1px).
          const d = `M ${0.06 * w} ${0.82 * h} C ${0.2 * w} ${0.02 * h}, ${
            0.62 * w
          } ${0.0 * h}, ${0.94 * w} ${0.58 * h}`;
          ghostEl.setAttribute("d", d);
          trailEl.setAttribute("d", d);
          svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);

          const len = trailEl.getTotalLength();
          gsap.set(trailEl, { strokeDasharray: len, strokeDashoffset: len });
          gsap.set([ballEl, spinEl], { willChange: "transform" });
          gsap.set(revealEl, { autoAlpha: 0, y: 26 });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stageEl,
              start: "top top",
              end: "+=170%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.to(ballEl, { motionPath: { path: d } }, 0)
            .to(spinEl, { rotation: 540, transformOrigin: "50% 50%" }, 0)
            .to(trailEl, { strokeDashoffset: 0 }, 0)
            .to(revealEl, { autoAlpha: 1, y: 0, ease: "power2.out" }, 0.68);

          killFns.push(() => {
            tl.scrollTrigger?.kill();
            tl.kill();
          });
        };

        build();
        const onResize = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            killFns.forEach((fn) => fn());
            killFns = [];
            ScrollTrigger.refresh();
            build();
            ScrollTrigger.refresh();
          }, 220);
        };
        window.addEventListener("resize", onResize);

        return () => {
          clearTimeout(resizeTimer);
          window.removeEventListener("resize", onResize);
          killFns.forEach((fn) => fn());
        };
      });
      // Reduced motion / mobile: the static fallback markup below needs no JS.
      return () => mm.revert();
    },
    { scope: stage }
  );

  return (
    <section id="flight" className="relative bg-base">
      {/* ---------------- Desktop pinned scene ---------------- */}
      <div
        ref={stage}
        className="rm-hide-desktop relative hidden h-screen w-full overflow-hidden lg:block"
      >
        {/* soft horizon glow */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "radial-gradient(120% 100% at 80% 100%, rgba(198,255,58,0.07), transparent 60%)",
          }}
        />

        <svg ref={svg} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path
            ref={ghost}
            fill="none"
            stroke="rgba(232,239,230,0.06)"
            strokeWidth="1.5"
            strokeDasharray="2 8"
            strokeLinecap="round"
          />
          <path
            ref={trail}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(198,255,58,0.5))" }}
          />
        </svg>

        {/* Ball: wrapper follows path (top-left anchor); visual is centered on it. */}
        <div ref={ballWrap} className="absolute left-0 top-0">
          <div style={{ transform: "translate(-50%, -50%)" }}>
            <div
              ref={spin}
              className="relative h-7 w-7 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 34% 28%, #ffffff, #ececec 46%, #bdbdbd 100%)",
                boxShadow:
                  "0 8px 18px rgba(0,0,0,0.5), inset -3px -4px 7px rgba(0,0,0,0.2)",
              }}
            >
              <div
                className="absolute inset-0 rounded-full opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(0,0,0,0.22) 0.6px, transparent 1.3px)",
                  backgroundSize: "6px 6px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Reveal — "lands" to introduce the product lineup */}
        <div className="pointer-events-none absolute inset-0 flex items-end">
          <div ref={reveal} className="mx-auto w-full max-w-[1400px] px-8 pb-20">
            <Eyebrow>The Lineup</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(2.4rem,5vw,4.2rem)] font-light leading-[1.0] tracking-[-0.02em] text-fg">
              Four clubs. <span className="text-accent">One standard.</span>
            </h2>
            <p className="mt-5 max-w-md text-muted">
              Every piece in the 2026 collection is built to the same exacting
              tolerance. Scroll through the range.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- Mobile / reduced-motion fallback ---------------- */}
      <div className="rm-show-mobile relative overflow-hidden px-5 py-24 sm:px-8 lg:hidden">
        <svg
          className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-40 w-full max-w-2xl opacity-70"
          viewBox="0 0 600 160"
          aria-hidden="true"
        >
          <path
            d="M 30 150 C 160 10, 440 0, 570 90"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(198,255,58,0.5))" }}
          />
          <circle cx="570" cy="90" r="9" fill="#fff" />
        </svg>
        <div className="relative mt-28">
          <Eyebrow>The Lineup</Eyebrow>
          <h2 className="mt-5 max-w-xl font-display text-[clamp(2.2rem,8vw,3.4rem)] font-light leading-[1.02] tracking-[-0.02em] text-fg">
            Four clubs. <span className="text-accent">One standard.</span>
          </h2>
          <p className="mt-5 max-w-md text-muted">
            Every piece in the 2026 collection is built to the same exacting
            tolerance.
          </p>
          <Button href="#lineup" variant="primary" className="mt-8">
            View the lineup
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
