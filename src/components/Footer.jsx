import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative">
      {/* Big CTA */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pt-20 md:pt-32 pb-16 md:pb-24 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
          <div className="md:col-span-3">
            <p className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase">
              Get in Touch
            </p>
          </div>
          <div className="md:col-span-9">
            <h2
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-[36px] sm:text-[56px] md:text-[80px] lg:text-[104px] font-normal text-text leading-[0.95] tracking-[-0.02em] mb-8 md:mb-10"
            >
              Build Your <em>New Future</em> With Us
            </h2>
            <p className="text-text-muted text-base md:text-lg max-w-2xl leading-relaxed">
              Nexa Creative is a Dublin-based creative agency helping organizations
              navigate growth, reinvention, and change through strategy, design,
              and digital.
            </p>
          </div>
        </div>
      </div>

      {/* Footer grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 border-t border-border py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-10">
          {/* Sitemap */}
          <div className="md:col-span-3">
            <h4 className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase mb-5">
              Sitemap
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "Services", to: "/services" },
                { label: "Work", to: "/work" },
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-text hover:text-text-muted transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div className="md:col-span-3">
            <h4 className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase mb-5">
              Visit
            </h4>
            <p className="text-text text-sm leading-relaxed mb-3">
              Dublin 2,<br />
              Ireland
            </p>
            <a
              href="https://maps.google.com/?q=Dublin+Ireland"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-text-muted hover:text-text transition-colors text-sm"
            >
              Google Maps <ArrowUpRight size={12} />
            </a>
          </div>

          {/* Work With Us */}
          <div className="md:col-span-3">
            <h4 className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase mb-5">
              Work With Us
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:hello@nexacreative.ie"
                  className="text-text hover:text-text-muted transition-colors text-sm"
                >
                  hello@nexacreative.ie
                </a>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1 text-text hover:text-text-muted transition-colors text-sm"
                >
                  Schedule a call <ArrowUpRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-3">
            <h4 className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase mb-5">
              Follow
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Instagram", href: "https://instagram.com" },
                { label: "LinkedIn", href: "https://linkedin.com" },
                { label: "TikTok", href: "https://tiktok.com" },
                { label: "X", href: "https://x.com" },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-text hover:text-text-muted transition-colors text-sm"
                  >
                    {s.label} <ArrowUpRight size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-text-muted text-xs">
          &copy; {new Date().getFullYear()} Nexa Creative. All rights reserved.
        </p>
        <p className="text-text-muted text-xs">
          Dublin, Ireland
        </p>
      </div>
    </footer>
  );
}
