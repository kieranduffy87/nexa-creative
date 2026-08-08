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

/**
 * A single white bar hanging from the top edge of the viewport — rounded on its
 * bottom corners only, so it reads as attached to the top of the page rather
 * than floating over it. Because it carries its own white ground, it needs no
 * light/dark handling regardless of what it sits over.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <div className="pointer-events-auto w-full max-w-[calc(100%-1.5rem)] sm:w-auto sm:max-w-none">
        <div className="flex h-14 items-center gap-4 rounded-b-2xl bg-white px-2 pl-4 shadow-[0_0_16px_rgba(0,0,0,0.08)] sm:gap-8 sm:pl-5">
          <Link
            to="/"
            className="shrink-0 text-nexa-red transition-colors duration-300 hover:text-ink"
            aria-label="Nexa Creative home"
          >
            <NexaLogo className="h-5 w-auto" />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
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

          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <Link
              to="/contact"
              className="group hidden h-10 items-center gap-2.5 rounded-[12px] bg-ink py-1 pl-1 pr-3 text-[13px] font-medium tracking-[-0.02em] text-white transition-colors duration-300 hover:bg-nexa-red sm:inline-flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-nexa-red text-white transition-colors duration-300 group-hover:bg-white group-hover:text-nexa-red">
                <ArrowIcon />
              </span>
              Let&apos;s talk
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-mist text-ink transition-colors hover:bg-ink hover:text-white md:hidden"
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
          className={`overflow-hidden transition-[max-height,opacity] duration-500 md:hidden ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mt-2 rounded-2xl bg-white p-2 shadow-[0_0_16px_rgba(0,0,0,0.08)]">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="flex items-center justify-between rounded-[10px] px-4 py-3 text-[15px] tracking-[-0.02em] transition-colors hover:bg-black/[0.04]"
              >
                {l.label}
                <ArrowIcon className="h-3 w-3 text-text-light" />
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
