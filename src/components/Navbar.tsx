import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/utils/cn";
import { Button, CloseIcon, Logo, MenuIcon, CartIcon } from "./primitives";

const LINKS = [
  { label: "Drivers", href: "#lineup" },
  { label: "Irons", href: "#lineup" },
  { label: "Balls", href: "#lineup" },
  { label: "Tech", href: "#tech" },
  { label: "Athletes", href: "#athletes" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Toggle the quiet backdrop once the user scrolls past the hero lip.
  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: "top -1",
      end: "max",
      onUpdate: (self) => {
        const next = self.scroll() > 24;
        setScrolled((prev) => (prev !== next ? next : prev));
      },
    });
    return () => st.kill();
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ease-[var(--ease-quiet)]",
          scrolled
            ? "border-b border-line bg-base/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:h-20">
          <a href="#top" className="text-fg" aria-label="Meridian home">
            <Logo />
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="group relative text-[0.86rem] font-medium tracking-wide text-muted transition-colors duration-200 hover:text-fg"
                >
                  {l.label}
                  {/* origin-aware underline reveal (left → right) */}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-200 ease-[var(--ease-quiet)] group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button href="#shop" variant="ghost" className="hidden sm:inline-flex">
              Shop
            </Button>
            <button
              type="button"
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-line text-fg transition-colors duration-200 hover:border-fg/40"
            >
              <CartIcon className="h-[1.05rem] w-[1.05rem]" />
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold text-base">
                2
              </span>
            </button>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-fg transition-colors duration-200 hover:border-fg/40 lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet — fast, quiet (no bounce). */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden transition-[opacity,visibility] duration-200 ease-[var(--ease-quiet)]",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-base/95 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-[82%] max-w-sm flex-col gap-2 border-l border-line bg-surface px-6 py-6 transition-transform duration-200 ease-[var(--ease-quiet)]",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <Logo />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-fg transition-colors hover:border-fg/40"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 font-display text-2xl text-fg transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          ))}
          <Button href="#shop" variant="primary" className="mt-6" onClick={() => setOpen(false)}>
            Shop the collection
          </Button>
        </div>
      </div>
    </>
  );
}
