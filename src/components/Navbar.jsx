import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { NexaLogo } from "./NexaLogo";

const navLinks = [
  { label: "Services", to: "/services" },
  { label: "Work", to: "/work" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <nav className="fixed top-3 md:top-5 left-3 right-3 md:left-5 md:right-5 z-50">
      <div className="mx-auto max-w-[1400px] bg-white/80 backdrop-blur-xl border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full px-4 md:px-6 lg:px-8 h-12 md:h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center shrink-0 group text-nexa-red hover:text-text transition-colors duration-300"
        >
          <NexaLogo className="h-5 sm:h-6 w-auto" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7 lg:gap-9 text-[13px] font-medium tracking-wide">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                className="nav-link relative inline-flex items-center group"
                data-active={active}
              >
                <span
                  className={`relative transition-colors duration-300 ${
                    active ? "text-text" : "text-text-muted group-hover:text-text"
                  }`}
                >
                  {link.label}
                  <span className="nav-underline absolute left-0 -bottom-1 h-px bg-text" />
                </span>
              </Link>
            );
          })}
          {/* CTA pill */}
          <Link
            to="/contact"
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-nexa-red text-white px-4 py-1.5 text-[12px] tracking-wide hover:bg-text transition-colors duration-300"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-80 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            Start a project
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-text text-[13px] font-medium tracking-wide cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-border/50 bg-white overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`py-3 text-[15px] font-medium transition-colors border-b border-border/30 ${
                    location.pathname === link.to
                      ? "text-text"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
