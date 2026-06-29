import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BallFlight from "@/components/BallFlight";
import Showcase from "@/components/Showcase";
import TechBreakdown from "@/components/TechBreakdown";
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

    // Recalculate all triggers after fonts + images have settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
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
        <ParallaxInterstitial />
        <Testimonials />
        <ShopCTA />
      </main>

      <Footer />
    </div>
  );
}
