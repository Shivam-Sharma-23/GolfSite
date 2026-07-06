import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE } from "@/lib/motion";

/**
 * Signal fired the moment the preloader begins revealing the site. The Hero
 * listens for this to start its entrance timeline so the copy rises in AS the
 * curtain lifts (rather than animating unseen underneath it). A global flag
 * covers the race where the Hero mounts after the event has already fired.
 */
export const PRELOADER_DONE_EVENT = "meridian:revealed";

declare global {
  interface Window {
    __meridianRevealed?: boolean;
  }
}

function announceReveal() {
  if (window.__meridianRevealed) return;
  window.__meridianRevealed = true;
  window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
}

/**
 * Intro curtain (kommakomma-style): a full-screen panel on the brand black that
 * draws the apex mark, counts 00 → 100, then wipes up to reveal the site.
 * Scroll is locked while it's on screen. Honors reduced motion by snapping
 * straight to a short hold + fade.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const brand = useRef<HTMLDivElement>(null);
  const mark = useRef<SVGPathElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      // Lock scroll while the curtain is up (same idiom as the mobile nav sheet).
      document.body.style.overflow = "hidden";

      const finish = () => {
        document.body.style.overflow = "";
        // Single, safe refresh: scroll was locked, so the user cannot be
        // mid-scroll through the pinned Hero — no pin jump.
        ScrollTrigger.refresh();
        setDone(true);
      };

      const counter = { v: 0 };
      const setCount = () => {
        if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(2, "0");
      };

      const mm = gsap.matchMedia();

      // Reduced motion: no draw, no count — brief hold, then a clean fade + reveal.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([brand.current, count.current, bar.current], { opacity: 1 });
        counter.v = 100;
        setCount();
        const tl = gsap.timeline({ delay: 0.5, onStart: announceReveal, onComplete: finish });
        tl.to(root.current, { autoAlpha: 0, duration: 0.6, ease: EASE.out });
        return () => tl.kill();
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const len = mark.current?.getTotalLength() ?? 60;
        gsap.set(mark.current, { strokeDasharray: len, strokeDashoffset: len });

        const tl = gsap.timeline({
          defaults: { ease: EASE.out },
          // Reveal starts as the curtain begins to lift, not when it's gone.
          onComplete: finish,
        });

        tl
          // Draw the apex mark, then bring the wordmark in.
          .to(mark.current, { strokeDashoffset: 0, duration: 0.9, ease: EASE.inOut })
          .from(".pre-word", { yPercent: 120, duration: 0.7, stagger: 0.05 }, "-=0.35")
          // Count up while the progress line fills.
          .to(counter, { v: 100, duration: 1.5, ease: "power1.inOut", onUpdate: setCount }, "-=0.4")
          .to(bar.current, { scaleX: 1, duration: 1.5, ease: "power1.inOut" }, "<")
          // Beat, then lift the curtain away.
          .to({}, { duration: 0.25 })
          .add(announceReveal)
          .to(brand.current, { autoAlpha: 0, y: -18, duration: 0.5, ease: EASE.inOut })
          .to(root.current, { yPercent: -100, duration: 1.0, ease: EASE.expo }, "-=0.25");

        return () => tl.kill();
      });

      return () => {
        mm.revert();
        document.body.style.overflow = "";
      };
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-base"
      aria-hidden="true"
    >
      <div ref={brand} className="flex flex-col items-center gap-6">
        {/* Apex / swing-arc mark — drawn on entrance */}
        <svg viewBox="0 0 32 32" className="h-12 w-12" aria-hidden="true">
          <path
            ref={mark}
            d="M3 26 L16 5 L29 26"
            fill="none"
            stroke="currentColor"
            className="text-fg"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle cx="16" cy="5" r="2.6" className="fill-accent" />
        </svg>

        <div className="overflow-hidden">
          <span className="pre-word block font-display text-[1.4rem] font-medium tracking-[0.42em] text-fg">
            MERIDIAN
          </span>
        </div>
      </div>

      {/* Progress line + counter, pinned near the bottom */}
      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-4 px-8">
        <div className="h-px w-full max-w-[280px] overflow-hidden bg-line-strong">
          <span ref={bar} className="block h-full w-full origin-left scale-x-0 bg-accent" />
        </div>
        <span
          ref={count}
          className="font-display text-[0.8rem] tracking-[0.3em] text-muted"
        >
          00
        </span>
      </div>
    </div>
  );
}
