import { useState } from "react";
import { Eyebrow, Button, ArrowRight, Reveal } from "./primitives";

export default function ShopCTA() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
    // Instant, quiet confirmation — no celebratory motion on a utility action.
    setDone(true);
  };

  return (
    <section id="shop" className="relative bg-base px-5 py-24 sm:px-8 lg:py-32">
      <Reveal y={34} duration={1} className="mx-auto max-w-[1100px]">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-16 text-center sm:px-12 lg:py-24">
          {/* ambient accent glow (static) */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] max-w-[120%] -translate-x-1/2 -translate-y-1/3 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(198,255,58,0.16), transparent 62%)",
              filter: "blur(10px)",
            }}
          />
          <div className="relative">
            <div className="flex justify-center">
              <Eyebrow>The 2026 Collection</Eyebrow>
            </div>
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2.4rem,6vw,4.4rem)] font-light leading-[0.98] tracking-[-0.02em] text-fg">
              Build your bag.
            </h2>
            <p className="mx-auto mt-6 max-w-md text-muted">
              Drivers, irons, balls and apparel — engineered as one system.
              Free shipping and custom fitting on every order.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button href="#lineup" variant="primary">
                Shop the collection
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Button href="#athletes" variant="ghost">
                Book a fitting
              </Button>
            </div>

            {/* Newsletter — quiet, fast utility interaction */}
            <div className="mx-auto mt-12 max-w-md border-t border-line pt-8">
              {done ? (
                <p className="text-sm text-accent">
                  You're on the list. Watch your inbox for early access.
                </p>
              ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="shop-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="shop-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email for early access"
                    className="h-12 flex-1 rounded-full border border-line-strong bg-base px-5 text-sm text-fg outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/30"
                  />
                  <Button as="button" type="submit" variant="ghost" className="h-12 shrink-0">
                    Notify me
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
