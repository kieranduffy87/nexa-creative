import { Link } from "react-router-dom";
import { NexaLogo } from "./NexaLogo";
import { ArrowIcon } from "./ui";

const DISCOVER = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Work", to: "/work" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

// PLACEHOLDER — point these at the studio's real profiles.
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X", href: "https://x.com" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          {/* Identity */}
          <div className="md:col-span-4">
            <Link
              to="/"
              className="inline-block text-nexa-red transition-colors duration-300 hover:text-white"
              aria-label="Nexa Creative — home"
            >
              <NexaLogo className="h-[18px] w-auto" />
            </Link>
            <p className="t-body mt-6 max-w-xs !text-white/50">
              Brand and digital design studio. Dublin, Ireland.
            </p>
          </div>

          {/* Discover */}
          <nav className="md:col-span-3">
            <p className="t-eyebrow !text-white/40">Discover</p>
            <ul className="mt-5 space-y-3">
              {DISCOVER.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-[15px] tracking-[-0.02em] text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials */}
          <nav className="md:col-span-2">
            <p className="t-eyebrow !text-white/40">Socials</p>
            <ul className="mt-5 space-y-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[15px] tracking-[-0.02em] text-white/70 transition-colors hover:text-white"
                  >
                    {s.label}
                    <ArrowIcon className="h-2.5 w-2.5" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="t-eyebrow !text-white/40">Work with us</p>
            <a
              href="mailto:hello@nexacreative.ie"
              className="mt-5 block text-[15px] tracking-[-0.02em] text-white/70 transition-colors hover:text-white"
            >
              hello@nexacreative.ie
            </a>
            <Link
              to="/contact"
              className="btn-pill mt-6 !bg-white/10 !text-white hover:!bg-white hover:!text-ink"
            >
              <span>Start a project</span>
              <span className="arrow-dot !bg-nexa-red !text-white">
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-white/40">
            © {new Date().getFullYear()} Nexa Creative. All rights reserved.
          </p>
          <p className="text-[13px] text-white/40">Dublin, Ireland</p>
        </div>
      </div>
    </footer>
  );
}
