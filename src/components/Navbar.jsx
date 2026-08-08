import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { NexaLogo } from "./NexaLogo";
import { ArrowIcon } from "./ui";

const LINKS = [
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className="shell flex items-center justify-between gap-4 py-4 md:py-5">
        {/* Logo — red, goes black on hover */}
        <Link
          to="/"
          className="pointer-events-auto shrink-0 text-nexa-red transition-colors duration-300 hover:text-ink"
          aria-label="Nexa Creative — home"
        >
          <NexaLogo className="h-4 w-auto md:h-[18px]" />
        </Link>

        {/* Centre pill */}
        <nav
          className={`pointer-events-auto hidden items-center gap-8 rounded-pill px-7 py-3 transition-all duration-500 md:flex ${
            scrolled
              ? "bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              : "bg-black/[0.04] backdrop-blur-sm"
          }`}
        >
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="nav-link"
              data-active={pathname.startsWith(l.to) ? "true" : "false"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="pointer-events-auto flex items-center gap-2">
          <Link
            to="/contact"
            className={`btn-pill hidden sm:inline-flex ${
              scrolled ? "bg-white/80 backdrop-blur-xl" : ""
            }`}
          >
            <span>Start a project</span>
            <span className="arrow-dot">
              <ArrowIcon />
            </span>
          </Link>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="btn-pill px-4 md:hidden"
          >
            <span className="flex flex-col gap-[3px]">
              <span
                className={`block h-px w-4 bg-current transition-transform duration-300 ${
                  open ? "translate-y-[4px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-4 bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-4 bg-current transition-transform duration-300 ${
                  open ? "-translate-y-[4px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`pointer-events-auto shell overflow-hidden transition-[max-height,opacity] duration-500 md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mt-1 rounded-card bg-white/85 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="flex items-center justify-between rounded-[8px] px-4 py-3 text-[15px] tracking-[-0.02em] transition-colors hover:bg-black/[0.04]"
            >
              {l.label}
              <ArrowIcon className="h-3 w-3 text-text-light" />
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
