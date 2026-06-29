import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Eyebrow } from "./primitives";

type Feature = { n: string; title: string; desc: string; img: string };

const FEATURES: Feature[] = [
  {
    n: "01",
    title: "Aerodynamics",
    desc: "A carbon crown tuned across 400 wind-tunnel hours cuts drag and holds a penetrating, wind-boring flight.",
    img: "/images/product-driver.jpg",
  },
  {
    n: "02",
    title: "The Face",
    desc: "A variable-thickness C300 steel face, milled to ±0.01mm, returns ball speed across the entire hitting area.",
    img: "/images/tech-face.jpg",
  },
  {
    n: "03",
    title: "Stability",
    desc: "A 10,000 MOI perimeter weighting keeps the face square to the ball when the strike is anything but perfect.",
    img: "/images/product-irons.jpg",
  },
];

const STATS = [
  { target: 317, dec: 0, suffix: "yd", label: "Avg. carry" },
  { target: 10000, dec: 0, suffix: "MOI", label: "Forgiveness" },
  { target: 176, dec: 0, suffix: "mph", label: "Ball speed" },
  { target: 0.01, dec: 2, suffix: "mm", label: "Face tolerance" },
];

const fmt = (v: number, dec: number) =>
  dec > 0 ? v.toFixed(dec) : Math.round(v).toLocaleString("en-US");

export default function TechBreakdown() {
  const section = useRef<HTMLElement>(null);
  const pinEl = useRef<HTMLDivElement>(null);
  const contentWrap = useRef<HTMLDivElement>(null);
  const blurBg = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const pin = pinEl.current;
      const wrap = contentWrap.current;
      const blur = blurBg.current;
      if (!pin || !wrap || !blur) return;

      const q = (sel: string) => Array.from(pin.querySelectorAll<HTMLElement>(sel));

      // ---------- Desktop: pinned cross-fade -------------------------------
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const visuals = q(".tech-visual");
        const texts = q(".tech-text");
        const dots = q(".tech-dot");

        gsap.set(visuals[0], { opacity: 1 });
        gsap.set(visuals.slice(1), { opacity: 0 });
        gsap.set(texts[0], { opacity: 1, y: 0 });
        gsap.set(texts.slice(1), { opacity: 0, y: 26 });

        const setDot = (i: number) =>
          dots.forEach((d, idx) => {
            const on = idx === i;
            d.style.backgroundColor = on ? "var(--color-accent)" : "rgba(232,239,230,0.18)";
            d.style.width = on ? "2.5rem" : "1.25rem";
          });
        setDot(0);

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: "+=260%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => setDot(Math.min(2, Math.floor(self.progress * 3))),
          },
        });

        // Entrance: section fades in, blur builds
        tl.fromTo(wrap, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
        tl.fromTo(blur, { opacity: 0, filter: "blur(0px)" }, { opacity: 1, filter: "blur(12px)", duration: 0.6 }, 0)
        // step 0 -> 1
        tl.to(visuals[1], { opacity: 1, duration: 1 }, 1)
          .to(visuals[0], { opacity: 0, duration: 1 }, 1)
          .to(texts[1], { opacity: 1, y: 0, duration: 1 }, 1)
          .to(texts[0], { opacity: 0, y: -12, duration: 1 }, 1)
          // step 1 -> 2
          .to(visuals[2], { opacity: 1, duration: 1 }, 2)
          .to(visuals[1], { opacity: 0, duration: 1 }, 2)
          .to(texts[2], { opacity: 1, y: 0, duration: 1 }, 2)
          .to(texts[1], { opacity: 0, y: -12, duration: 1 }, 2)
          // Exit: blur fades out after last cross-fade
          .to(blur, { opacity: 0, filter: "blur(0px)", duration: 0.4 }, 2.5);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      // ---------- Mobile feature blocks: per-item reveal ------------------
      mm.add("(max-width: 1023px)", () => {
        const tweens = q(".feature-block").map((el) =>
          gsap.from(el, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
          })
        );
        return () => tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      });

      return () => mm.revert();
    },
    { scope: section }
  );

  return (
    <section ref={section} id="tech" className="relative bg-base">
      {/* ============ Desktop pinned ============ */}
      <div ref={pinEl} className="hidden lg:block">
        {/* Blur backdrop — fades in during entrance, fades out after cross-fade */}
        <div ref={blurBg} className="pointer-events-none absolute inset-0 z-0" style={{ opacity: 0, filter: "blur(0px)" }}>
          <div className="h-full w-full" style={{ background: "radial-gradient(circle, rgba(198,255,58,0.12) 0%, rgba(198,255,58,0.06) 40%, transparent 70%)" }} />
        </div>
        <div ref={contentWrap} className="relative z-10 mx-auto grid h-screen max-w-[1400px] grid-cols-2 items-center gap-16 px-10">
          {/* Left: copy */}
          <div className="relative z-10">
            <Eyebrow>Engineering</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,4vw,3.6rem)] font-light leading-[1.0] tracking-[-0.02em] text-fg">
              Built down to<br />the micron.
            </h2>

            {/* Stacked, cross-fading feature copy */}
            <div className="relative mt-10 min-h-[200px]">
              {FEATURES.map((f, i) => (
                <div key={f.n} className="tech-text absolute inset-0" style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? "translateY(0)" : "translateY(26px)" }}>
                  <div className="font-display text-sm text-accent">{f.n}</div>
                  <h3 className="mt-3 font-display text-3xl text-fg">{f.title}</h3>
                  <p className="mt-3 max-w-sm leading-relaxed text-muted">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Step dots */}
            <div className="mt-10 flex items-center gap-3">
              {FEATURES.map((f) => (
                <span
                  key={f.n}
                  className="tech-dot block h-px"
                  style={{ width: "1.25rem", backgroundColor: "rgba(232,239,230,0.18)", transition: "width 0.3s, background-color 0.3s" }}
                />
              ))}
            </div>
          </div>

          {/* Right: stacked visuals */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line">
            {FEATURES.map((f, i) => (
              <div key={f.n} className="tech-visual absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                <img src={f.img} alt={f.title} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-base/70 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ Mobile stack ============ */}
      <div className="rm-show-mobile px-5 py-24 sm:px-8 lg:hidden">
        <Eyebrow>Engineering</Eyebrow>
        <h2 className="mt-4 font-display text-[clamp(2.1rem,8vw,3rem)] font-light leading-[1.0] tracking-[-0.02em] text-fg">
          Built down to the micron.
        </h2>
        <div className="mt-14 space-y-16">
          {FEATURES.map((f) => (
            <div key={f.n} className="feature-block">
              <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-line">
                <img src={f.img} alt={f.title} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-base/70 to-transparent" />
              </div>
              <div className="mt-5 font-display text-sm text-accent">{f.n}</div>
              <h3 className="mt-2 font-display text-2xl text-fg">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ Count-up stats (all sizes) ============ */}
      <StatsStrip />
    </section>
  );
}

function StatsStrip() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const nums = gsap.utils.toArray<HTMLElement>(".stat-num");

      mm.add("(prefers-reduced-motion: reduce)", () => {
        nums.forEach((el) => {
          const target = parseFloat(el.dataset.target || "0");
          const dec = parseInt(el.dataset.dec || "0", 10);
          el.textContent = fmt(target, dec);
        });
      });

      mm.add("(min-width: 0px)", () => {
        const tweens = nums.map((el) => {
          const target = parseFloat(el.dataset.target || "0");
          const dec = parseInt(el.dataset.dec || "0", 10);
          const obj = { v: 0 };
          return gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
            onUpdate: () => {
              el.textContent = fmt(obj.v, dec);
            },
          });
        });
        return () => tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="border-y border-line bg-base-2">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px px-5 py-14 sm:px-8 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="px-2 py-4">
            <div className="flex items-baseline gap-1.5">
              <span
                className="stat-num font-display text-[clamp(2rem,4vw,3rem)] font-light text-fg"
                data-target={s.target}
                data-dec={s.dec}
              >
                0
              </span>
              <span className="text-sm text-accent">{s.suffix}</span>
            </div>
            <div className="mt-1 text-[0.72rem] uppercase tracking-[0.2em] text-faint">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
