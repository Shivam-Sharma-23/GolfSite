import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BallFlight from "@/components/BallFlight";
import Showcase from "@/components/Showcase";
import TechBreakdown from "@/components/TechBreakdown";
import CategoryShop from "@/components/CategoryShop";
import ParallaxInterstitial from "@/components/ParallaxInterstitial";
import Testimonials from "@/components/Testimonials";
import ShopCTA from "@/components/ShopCTA";
import Footer from "@/components/Footer";

export default function App() {
  const progress = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Functional scroll-progress indicator (tracks position — not a pulsing dot).
    mm.add("(min-width: 0px)", () => {
      gsap.to(progress.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: "top top", end: "max", scrub: 0.3 },
      });
    });

    // Section fade-through: each marked section fades + drifts up into place
    // as it enters the viewport, then fades out and lifts away as it exits.
    // Scrubbed, so it rewinds on scroll-up. The pinned Hero and the fixed-bg
    // interstitial are deliberately NOT marked (a transform on the
    // interstitial would break background-attachment: fixed).
    // NOTE: gated on min-width like the hero's scrub (site convention), NOT
    // on prefers-reduced-motion — Windows "Animation effects: off" reports
    // reduce and would silently disable all scroll choreography.
    mm.add("(min-width: 0px)", () => {
      // Scroll-scrubbed text rise: any element tagged data-scrub fades and
      // drifts up in sync with scroll position (and back down on scroll-up).
      gsap.utils.toArray<HTMLElement>("[data-scrub]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 97%",
              end: "top 70%",
              scrub: 0.4,
            },
          }
        );
      });

      // Opacity only (never visibility:hidden, never a full blackout) and no
      // scale — so a mis-measured trigger can dim a section but can never
      // make it vanish, and section transforms can't retrigger SplitText's
      // ResizeObserver re-splits.
      gsap.utils.toArray<HTMLElement>(".section-fade").forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0.8, y: 48 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sec,
              start: "top 96%",
              end: "top 64%",
              scrub: 0.4,
            },
          }
        );
        gsap.fromTo(
          sec,
          { opacity: 1, y: 0 },
          {
            opacity: 0.8,
            y: -32,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: sec,
              start: "bottom 32%",
              end: "bottom 6%",
              scrub: 0.4,
            },
          }
        );
      });
    });

    // Recalculate all triggers after fonts + images have settled.
    // Only ever run once — firing ScrollTrigger.refresh() more than once while
    // the user is mid-scroll through a pinned section snaps/jumps the pin, which
    // reads as a "scrolling glitch". Whichever signal lands first wins; the rest
    // are no-ops.
    let refreshed = false;
    const refresh = () => {
      if (refreshed) return;
      refreshed = true;
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", refresh, { once: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }
    const t = window.setTimeout(refresh, 700);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      mm.revert();
    };
  }, {});

  return (
    <div className="grain relative">
      {/* Intro curtain — reveals the site once its count completes */}
      <Preloader />

      {/* Scroll progress */}
      <div
        ref={progress}
        className="fixed left-0 top-0 z-[55] h-[2px] w-full origin-left bg-accent"
        style={{ transform: "scaleX(0)" }}
        aria-hidden="true"
      />

      <Navbar />

      <main>
        <Hero />
        <BallFlight />
        <Showcase />
        <TechBreakdown />
        <CategoryShop />
        <ParallaxInterstitial />
        <Testimonials />
        <ShopCTA />
      </main>

      <Footer />
    </div>
  );
}
