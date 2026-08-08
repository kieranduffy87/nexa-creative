import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { NexaLogo } from "./NexaLogo";
import { ArrowIcon } from "./ui";
import { useTheme } from "../lib/theme";

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
function ThemeToggle({ theme, onToggle }) {
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      title={dark ? "Light theme" : "Dark theme"}
      className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-mist text-text transition-colors hover:bg-contrast hover:text-contrast-on"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="h-[18px] w-[18px]"
        aria-hidden="true"
      >
        {dark ? (
          // Moon
          <path
            d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        ) : (
          // Sun
          <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <circle cx="10" cy="10" r="3.6" />
            <path d="M10 1.6v2M10 16.4v2M18.4 10h-2M3.6 10h-2M15.9 4.1l-1.4 1.4M5.5 14.5l-1.4 1.4M15.9 15.9l-1.4-1.4M5.5 5.5 4.1 4.1" />
          </g>
        )}
      </svg>
    </button>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <div className="pointer-events-auto w-full max-w-[calc(100%-1.5rem)] sm:w-auto sm:max-w-none">
        <div className="flex h-14 items-center gap-4 rounded-b-2xl bg-bg px-2 pl-4 shadow-[0_0_16px_rgba(0,0,0,0.08)] sm:gap-8 sm:pl-5">
          <Link
            to="/"
            className="shrink-0 text-nexa-red transition-colors duration-300 hover:text-text"
            aria-label="Nexa Creative home"
          >
            <NexaLogo className="h-6 w-auto" />
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
            <ThemeToggle theme={theme} onToggle={toggle} />

            <Link
              to="/contact"
              className="group hidden h-10 items-center gap-2.5 rounded-[12px] bg-contrast py-1 pl-1 pr-3 text-[13px] font-medium tracking-[-0.02em] text-contrast-on transition-colors duration-300 hover:bg-nexa-red hover:text-white sm:inline-flex"
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
              className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-mist text-text transition-colors hover:bg-contrast hover:text-contrast-on md:hidden"
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
          <nav className="mt-2 rounded-2xl bg-bg p-2 shadow-[0_0_16px_rgba(0,0,0,0.08)]">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="flex items-center justify-between rounded-[10px] px-4 py-3 text-[15px] tracking-[-0.02em] transition-colors hover:bg-mist"
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
