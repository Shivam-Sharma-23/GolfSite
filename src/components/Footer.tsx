import { Logo } from "./primitives";

const COLUMNS: { heading: string; links: string[] }[] = [
  { heading: "Shop", links: ["Drivers", "Irons", "Balls", "Apparel", "Gift cards"] },
  { heading: "Company", links: ["Our craft", "Athletes", "Sustainability", "Careers", "Press"] },
  { heading: "Support", links: ["Custom fitting", "Shipping", "Returns", "Warranty", "Contact"] },
];

const SOCIALS = ["Instagram", "YouTube", "X / Twitter"];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-base-2">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              Precision-engineered golf equipment. Designed in the workshop,
              proven under pressure on tour.
            </p>
            <div className="mt-6 flex gap-5">
              {SOCIALS.map((s) => (
                <a
                  key={s}
                  href="#top"
                  className="text-sm text-muted transition-colors duration-200 hover:text-accent"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading} className="md:col-span-2">
              <div className="text-[0.7rem] uppercase tracking-[0.22em] text-faint">
                {col.heading}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#top"
                      className="text-sm text-muted transition-colors duration-200 hover:text-fg"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-line pt-7 text-[0.78rem] text-faint sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Meridian Golf. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#top" className="transition-colors hover:text-fg">Privacy</a>
            <a href="#top" className="transition-colors hover:text-fg">Terms</a>
            <a href="#top" className="transition-colors hover:text-fg">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
