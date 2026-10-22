import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { NexaLogo } from "./NexaLogo";
import { ArrowIcon } from "./ui";
import { useTheme } from "../lib/theme";

const LINKS = [
  { to: "/work", label: "Work", sub: "Selected projects" },
  { to: "/services", label: "Services", sub: "What we do" },
  { to: "/about", label: "About", sub: "The studio" },
  { to: "/contact", label: "Contact", sub: "Start a project" },
];

/**
 * Three tiles hanging from the top edge rather than one bar: the mark on the
 * left, the links in the middle, the utilities on the right. Each tile keeps
 * the rounded-bottom shape, so the nav still reads as attached to the top of
 * the page, but it now spans the full width the way the hero does.
 *
 * Because every tile carries its own ground, none of them need to know what
 * they are sitting over.
 */
function Tile({ className = "", children }) {
  return (
    <div
      className={`pointer-events-auto flex items-center rounded-b-2xl bg-bg shadow-[0_0_16px_rgba(0,0,0,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}

/** Dublin wall clock. The studio is in one place and says so. */
function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = new Intl.DateTimeFormat("en-IE", {
    timeZone: "Europe/Dublin",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  return (
    <div className="hidden flex-col justify-center pr-1 text-right leading-none lg:flex">
      <span className="text-[10px] uppercase tracking-[0.14em] text-text-light">
        Dublin
      </span>
      <span className="mt-1 text-[13px] tabular-nums tracking-[-0.01em] text-text">
        {time}
      </span>
    </div>
  );
}

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
      <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
        {dark ? (
          <path
            d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        ) : (
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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="flex items-start justify-between gap-3 px-3 sm:px-4">
        <Tile className="h-14 px-4">
          <Link
            to="/"
            className="shrink-0 text-nexa-red transition-colors duration-300 hover:text-text"
            aria-label="Nexa Creative home"
          >
            <NexaLogo className="h-6 w-auto" />
          </Link>
        </Tile>

        {/* Each link carries what it actually leads to, so the nav says more
            than four words. The sublabel is decorative: the link text alone
            is the accessible name. */}
        <Tile className="hidden h-[4.5rem] gap-7 px-6 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="group flex flex-col justify-center leading-none"
              data-active={pathname.startsWith(l.to) ? "true" : "false"}
            >
              <span
                className="nav-link"
                data-active={pathname.startsWith(l.to) ? "true" : "false"}
              >
                {l.label}
              </span>
              <span
                aria-hidden="true"
                className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-text-light transition-colors duration-300 group-hover:text-text-muted"
              >
                {l.sub}
              </span>
            </NavLink>
          ))}
        </Tile>

        <Tile className="h-14 gap-2 px-2 lg:gap-4 lg:pl-5">
          <Clock />
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
        </Tile>
      </div>

      {/* Mobile sheet */}
      <div
        className={`pointer-events-auto overflow-hidden px-3 transition-[max-height,opacity] duration-500 sm:px-4 md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mt-2 rounded-2xl bg-bg p-2 shadow-[0_0_16px_rgba(0,0,0,0.08)]">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="flex items-center justify-between rounded-[10px] px-4 py-3 transition-colors hover:bg-mist"
            >
              <span className="flex flex-col leading-none">
                <span className="text-[15px] tracking-[-0.02em]">{l.label}</span>
                <span
                  aria-hidden="true"
                  className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-text-light"
                >
                  {l.sub}
                </span>
              </span>
              <ArrowIcon className="h-3 w-3 text-text-light" />
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
