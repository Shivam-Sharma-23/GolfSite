import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { cn } from "@/utils/cn";

export const BRAND = "MERIDIAN";

/* ------------------------------------------------------------------ Icons */
type IconProps = { className?: string };
export const ArrowRight = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const CartIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.2a1 1 0 0 0 1-.78L20 8H6.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9.5" cy="20" r="1.2" fill="currentColor" />
    <circle cx="17" cy="20" r="1.2" fill="currentColor" />
  </svg>
);
export const MenuIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
export const CloseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
export const PlusIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ----------------------------------------------------------------- Logo */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      {/* Apex / swing-arc mark — static, accent on group hover */}
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path d="M3 26 L16 5 L29 26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" opacity="0.92" />
        <circle cx="16" cy="5" r="2.6" className="fill-accent" />
      </svg>
      <span className="font-display text-[1.05rem] font-medium tracking-[0.22em] text-fg">
        MERIDIAN
      </span>
    </span>
  );
}

/* --------------------------------------------------------------- Eyebrow */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  // Static accent dot — deliberately NOT animated (no pulsing indicators).
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-[0.7rem] font-medium uppercase tracking-[0.32em] text-muted", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- Button */
type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "ghost" | "link";
  as?: ElementType;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
};

export function Button({
  children, variant = "primary", as, href, className, onClick, type = "button", ariaLabel,
}: ButtonProps) {
  const Comp: ElementType = as ?? (href ? "a" : "button");

  const base =
    "group inline-flex items-center justify-center gap-2 font-medium transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-[var(--ease-quiet)] select-none";

  const variants: Record<string, string> = {
    // Primary CTA — single tactile lift (Krehel selective, not on everything)
    primary:
      "rounded-full bg-accent px-6 py-3 text-[0.92rem] text-base hover:bg-accent-2 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] accent-glow",
    ghost:
      "rounded-full border border-line-strong px-6 py-3 text-[0.92rem] text-fg hover:border-fg/40 hover:bg-white/[0.03]",
    link:
      "gap-1.5 px-1 py-1 text-[0.92rem] text-fg",
  };

  return (
    <Comp
      href={href}
      onClick={onClick}
      type={href ? undefined : type}
      aria-label={ariaLabel}
      className={cn(base, variants[variant], className)}
    >
      {children}
    </Comp>
  );
}

/* ---------------------------------------------------------------- Reveal */
/**
 * Single fade + rise on enter. Used SPARINGLY for a few section intros only
 * (anti-AI-slop: avoid uniform fade-ins across the page). Respects
 * prefers-reduced-motion via matchMedia — content is visible by default.
 */
export function Reveal({
  children, className, y = 28, duration = 0.9, delay = 0, blur = false, start = "top 88%",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  delay?: number;
  blur?: boolean;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 0px)", () => {
        gsap.from(el, {
          opacity: 0,
          y,
          ...(blur ? { filter: "blur(8px)" } : {}),
          duration,
          delay,
          ease: EASE.out,
          scrollTrigger: { trigger: el, start, toggleActions: "play none none reverse" },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
