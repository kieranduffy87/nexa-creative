import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { NexaLogo } from "./NexaLogo";
import { ArrowIcon } from "./ui";
import { useTheme } from "../lib/theme";
import { useDock } from "../lib/dock";
import { projects } from "../data/projects";
import { asset } from "../lib/asset";

const EMAIL = "hello@nexacreative.ie";
const BAR = 64; // closed dock height, px

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Small parts ──────────────────────────────────────────────────────── */

function Thumb({ src, className = "" }) {
  // The logo is always in the bar, so with no project to show there is
  // nothing to add beside it
  if (!src) return null;
  return (
    <span className={`block overflow-hidden ${className}`}>
      <img key={src} src={src} alt="" className="swap-in h-full w-full object-cover" />
    </span>
  );
}

/** What the closed dock offers, which depends on where the visitor is. One
    short label, as on mubien: the thumbnail beside it says which project. */
function ctaFor(pathname, reel) {
  if (pathname === "/" && reel) {
    const p = reel.slide.project;
    return { to: `/work/${p.slug}`, label: "View case study", thumb: p.thumb };
  }

  const m = pathname.match(/^\/work\/([^/]+)/);
  if (m) {
    const k = projects.findIndex((p) => p.slug === m[1]);
    const next = projects[(k + 1) % projects.length];
    return { to: `/work/${next.slug}`, label: "Next case study", thumb: next.thumb };
  }

  if (pathname.startsWith("/contact")) {
    return { to: "/work", label: "See the work", thumb: null };
  }
  return { to: "/contact", label: "Start a project", thumb: null };
}

/**
 * The showreel, full screen over everything. Opened from the menu's reel card;
 * Esc, the close button or a click outside the video closes it. The file only
 * loads when it is first played.
 */
function ShowreelPlayer({ open, onClose }) {
  const videoRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!open) {
      v?.pause();
      return undefined;
    }
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
    closeRef.current?.focus({ preventScroll: true });
    window.__lenis?.stop();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
    };
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Nexa Creative showreel"
      aria-hidden={!open}
      inert={!open}
      onClick={onClose}
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/90 px-[calc(var(--frame-inset)*2)] py-20 backdrop-blur-sm transition-opacity duration-500 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Room above for the close button, so it never sits on the picture */}
      <video
        ref={videoRef}
        src={asset("showreel/nexa-showreel.mp4")}
        poster={asset("showreel/nexa-showreel-poster.jpg")}
        controls
        playsInline
        preload="none"
        onClick={(e) => e.stopPropagation()}
        className={`aspect-video max-h-full w-full max-w-[calc((100svh-10rem)*16/9)] rounded-[var(--panel-radius)] bg-black transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "scale-100" : "scale-95"
        }`}
      />
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close showreel"
        className="absolute right-[calc(var(--frame-inset)*2)] top-[calc(var(--frame-inset)*2)] flex h-12 w-12 items-center justify-center rounded-[12px] bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
      >
        <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
          <path d="m2 2 10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/** Analogue Dublin clock. Minutes are all a studio clock needs. */
function ClockTile() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);

  const parts = new Intl.DateTimeFormat("en-IE", {
    timeZone: "Europe/Dublin",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const h = +parts.find((p) => p.type === "hour").value;
  const m = +parts.find((p) => p.type === "minute").value;
  const minuteAngle = m * 6;
  const hourAngle = (h % 12) * 30 + m * 0.5;

  return (
    <div className="flex h-28 items-center gap-3.5 rounded-[14px] bg-mist p-3.5">
      <svg viewBox="0 0 40 40" className="h-14 w-14 shrink-0 rounded-full bg-bg p-1 text-text" aria-hidden="true">
        {[0, 90, 180, 270].map((a) => (
          <circle key={a} cx={20 + 17 * Math.sin((a * Math.PI) / 180)} cy={20 - 17 * Math.cos((a * Math.PI) / 180)} r="0.9" fill="currentColor" opacity="0.4" />
        ))}
        <line x1="20" y1="20" x2="20" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" transform={`rotate(${hourAngle} 20 20)`} />
        <line x1="20" y1="20" x2="20" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${minuteAngle} 20 20)`} />
        <circle cx="20" cy="20" r="1.6" className="fill-nexa-red" />
      </svg>
      <span className="flex flex-col self-end">
        <span className="text-[14px] leading-none tracking-[-0.02em]">Dublin</span>
        <span className="mt-1.5 text-[11px] tabular-nums leading-none text-text-light">
          {pad2(h)}:{pad2(m)}
        </span>
      </span>
    </div>
  );
}
const pad2 = (n) => String(n).padStart(2, "0");

/**
 * Drag the knob across to get to the contact page. Keyboard users get the
 * same destination from Enter or Space on the knob: the slide is the fun part,
 * not a gate.
 */
function SlideToContact({ onDone }) {
  const trackRef = useRef(null);
  const knobRef = useRef(null);
  const labelRef = useRef(null);
  const drag = useRef(null);

  const max = () => trackRef.current.clientWidth - knobRef.current.offsetWidth - 8;

  const setX = (x) => {
    gsap.set(knobRef.current, { x });
    gsap.set(labelRef.current, { opacity: 1 - Math.min(1, x / (max() * 0.6)) });
  };

  const onPointerDown = (e) => {
    knobRef.current.setPointerCapture(e.pointerId);
    drag.current = { start: e.clientX, x: gsap.getProperty(knobRef.current, "x") };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const x = Math.max(0, Math.min(max(), drag.current.x + e.clientX - drag.current.start));
    setX(x);
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    const x = gsap.getProperty(knobRef.current, "x");
    if (x > max() * 0.82) {
      gsap.to(knobRef.current, { x: max(), duration: 0.18, ease: "power2.out", onComplete: onDone });
    } else {
      gsap.to(knobRef.current, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.6)" });
      gsap.to(labelRef.current, { opacity: 1, duration: 0.3 });
    }
  };

  return (
    <div ref={trackRef} className="relative flex h-14 items-center rounded-full bg-mist p-1">
      <span
        ref={labelRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center pl-10 text-[13px] tracking-[-0.01em] text-text-muted"
      >
        Slide to contact us
      </span>
      <button
        ref={knobRef}
        type="button"
        aria-label="Contact us"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onDone();
          }
        }}
        className="relative z-10 flex h-12 w-12 touch-none cursor-grab items-center justify-center rounded-full bg-bg text-nexa-red shadow-[0_2px_10px_rgba(0,0,0,0.12)] active:cursor-grabbing"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
          <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="m3 5.5 7 5 7-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function NavTile({ to, label, sub, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="dock-item group flex h-28 flex-col justify-end rounded-[14px] bg-mist p-3.5 transition-colors duration-300 hover:bg-contrast hover:text-contrast-on"
    >
      <span className="text-[14px] leading-none tracking-[-0.02em]">{label}</span>
      <span className="mt-1.5 text-[11px] leading-none text-text-light transition-colors group-hover:text-contrast-on/60">
        {sub}
      </span>
    </Link>
  );
}

/* ── The dock ─────────────────────────────────────────────────────────── */

/**
 * Site navigation as a dock across the top of the frame, after mubien.com.
 * Closed, it is the logo plus one useful action for wherever you are: on the
 * homepage it follows the reel and opens the project on screen; on a case
 * study it offers the next. Open, it grows downwards out of itself into a
 * stack of tiles, with the logo staying where it was.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { reel, setMenuOpen } = useDock();
  const cta = ctaFor(pathname, reel);
  const [playerOpen, setPlayerOpen] = useState(false);

  const panelRef = useRef(null);
  const menuBtnRef = useRef(null);
  const previewRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);
  const closePlayer = useCallback(() => {
    setPlayerOpen(false);
    menuBtnRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => setMenuOpen(open || playerOpen), [open, playerOpen, setMenuOpen]);

  // The reel card's preview only runs while the menu is open to see it
  useEffect(() => {
    const v = previewRef.current;
    if (!v) return;
    if (open && !reducedMotion()) v.play().catch(() => {});
    else v.pause();
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  // Esc closes; page scroll stops underneath while it is open
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.__lenis?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
    };
  }, [open]);

  // Grow out of the bar: a clip reveal from the bar's own height downwards,
  // then the tiles settle in after it
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const items = panel.querySelectorAll(".dock-item");
    const h = panel.offsetHeight;

    if (reducedMotion()) {
      gsap.set(panel, { clipPath: "none", autoAlpha: open ? 1 : 0 });
      gsap.set(items, { clearProps: "all" });
    } else if (open) {
      gsap.set(panel, { autoAlpha: 1 });
      gsap.fromTo(
        panel,
        { clipPath: `inset(0px 0px ${h - BAR}px 0px round 20px)` },
        { clipPath: "inset(0px 0px 0px 0px round 20px)", duration: 0.55, ease: "power4.out" },
      );
      gsap.fromTo(
        items,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.035, delay: 0.08 },
      );
    } else {
      gsap.to(panel, {
        clipPath: `inset(0px 0px ${h - BAR}px 0px round 20px)`,
        duration: 0.35,
        ease: "power3.in",
        onComplete: () => gsap.set(panel, { autoAlpha: 0 }),
      });
    }

    if (open) {
      panel.querySelector(".dock-item")?.focus({ preventScroll: true });
    }
  }, [open]);

  const wasOpen = useRef(false);
  useEffect(() => {
    // Closing the menu hands focus back to its button, unless it closed to
    // open the showreel, which takes focus itself (and returns it on close)
    if (wasOpen.current && !open && !playerOpen) menuBtnRef.current?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open, playerOpen]);

  return (
    <>
      {/* Dim the page behind the open dock */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Inset twice the frame inset: the panels sit one inset inside the
          viewport, so the bar sits the same distance inside the panel as the
          panel sits inside the frame. */}
      <nav
        aria-label="Main"
        className="pointer-events-none fixed inset-x-0 top-[calc(var(--frame-inset)*2)] z-50 flex justify-center px-[calc(var(--frame-inset)*2)]"
      >
        <div className="pointer-events-auto relative w-full max-w-[29rem]">
          {/* ── Open: the panel, anchored to the bar's top edge ── */}
          <div
            ref={panelRef}
            id="dock-panel"
            className="invisible absolute inset-x-0 top-0 max-h-[calc(100svh-(var(--frame-inset)*4))] overflow-y-auto rounded-[20px] bg-bg p-2 opacity-0 shadow-[0_8px_40px_rgba(0,0,0,0.22)]"
            aria-hidden={!open}
            inert={!open}
          >
            {/* Same footprint as the closed bar, so opening and closing land
                in place: the logo stays put, the menu button becomes close */}
            <div className="mb-2 flex h-12 items-center justify-between pl-2">
              <Link
                to="/"
                onClick={close}
                aria-label="Nexa Creative home"
                className="dock-head text-nexa-red transition-colors duration-300 hover:text-text"
              >
                <NexaLogo className="h-5 w-auto" />
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-mist text-text transition-colors hover:bg-contrast hover:text-contrast-on"
              >
                <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                  <path d="m2 2 10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <NavTile to="/work" label="Work" sub="Selected projects" onClick={close} />
              <NavTile to="/services" label="Services" sub="What we do" onClick={close} />
              <NavTile to="/about" label="About" sub="The studio" onClick={close} />
              <button
                type="button"
                onClick={toggle}
                aria-pressed={theme === "dark"}
                className="dock-item group flex h-28 flex-col justify-between rounded-[14px] bg-mist p-3.5 text-left transition-colors duration-300 hover:bg-contrast hover:text-contrast-on"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px] self-end" aria-hidden="true">
                  {theme === "dark" ? (
                    <path d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  ) : (
                    <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                      <circle cx="10" cy="10" r="3.6" />
                      <path d="M10 1.6v2M10 16.4v2M18.4 10h-2M3.6 10h-2M15.9 4.1l-1.4 1.4M5.5 14.5l-1.4 1.4M15.9 15.9l-1.4-1.4M5.5 5.5 4.1 4.1" />
                    </g>
                  )}
                </svg>
                <span>
                  <span className="block text-[14px] leading-none tracking-[-0.02em]">Appearance</span>
                  <span className="mt-1.5 block text-[11px] leading-none text-text-light transition-colors group-hover:text-contrast-on/60">
                    {theme === "dark" ? "Dark" : "Light"}
                  </span>
                </span>
              </button>

              {/* The showreel, as on mubien: a live preview that opens the
                  full reel over everything */}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setPlayerOpen(true);
                }}
                className="dock-item group relative col-span-2 flex h-36 items-end overflow-hidden rounded-[14px] bg-black p-3.5 text-left text-white"
              >
                <video
                  ref={previewRef}
                  src={asset("showreel/nexa-showreel-preview.mp4")}
                  poster={asset("showreel/nexa-showreel-preview-poster.jpg")}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="relative">
                  <span className="block text-[11px] uppercase tracking-[0.14em] text-white/60">
                    Showreel 2026
                  </span>
                  <span className="mt-1.5 block text-[15px] leading-none tracking-[-0.02em]">
                    Play reel
                  </span>
                </span>
                <span className="relative ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:scale-110">
                  <svg viewBox="0 0 12 12" className="ml-0.5 h-3 w-3" fill="currentColor" aria-hidden="true">
                    <path d="M3 1.8v8.4L10 6z" />
                  </svg>
                </span>
              </button>

              <div className="dock-item col-span-2">
                <SlideToContact
                  onDone={() => {
                    close();
                    navigate("/contact");
                  }}
                />
              </div>

              <div className="dock-item">
                <ClockTile />
              </div>
              <a
                href={`mailto:${EMAIL}`}
                className="dock-item group flex h-28 flex-col justify-end rounded-[14px] bg-mist p-3.5 transition-colors duration-300 hover:bg-contrast hover:text-contrast-on"
              >
                <span className="text-[14px] leading-none tracking-[-0.02em]">Email</span>
                <span className="mt-1.5 break-all text-[11px] leading-snug text-text-light transition-colors group-hover:text-contrast-on/60">
                  {EMAIL}
                </span>
              </a>
            </div>

          </div>

          {/* ── Closed: the bar ── */}
          <div
            className={`relative flex items-center gap-3 overflow-hidden rounded-[20px] bg-bg p-2 shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-opacity duration-200 ${
              open ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            style={{ height: BAR }}
          >
            {/* The reel's countdown to its next slide, filling behind the
                bar as on mubien. The reel writes --reel-progress directly. */}
            {pathname === "/" && reel && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 origin-left bg-mist"
                style={{ transform: "scaleX(var(--reel-progress, 0))" }}
              />
            )}
            <Link
              to="/"
              aria-label="Nexa Creative home"
              tabIndex={open ? -1 : undefined}
              className="relative shrink-0 pl-2 text-nexa-red transition-colors duration-300 hover:text-text"
            >
              <NexaLogo className="h-5 w-auto" />
            </Link>
            <span className="relative h-7 w-px shrink-0 bg-border" aria-hidden="true" />
            <Link
              to={cta.to}
              className="group relative flex min-w-0 flex-1 items-center gap-3"
              tabIndex={open ? -1 : undefined}
            >
              <Thumb src={cta.thumb} className="hidden h-12 w-12 shrink-0 rounded-[12px] sm:block" />
              <span key={cta.label} className="swap-in min-w-0 truncate text-[14px] leading-none tracking-[-0.02em]">
                {cta.label}
              </span>
              <ArrowIcon className="ml-auto h-3 w-3 shrink-0 text-text-light transition-transform duration-500 group-hover:translate-x-0.5" />
            </Link>
            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="dock-panel"
              aria-label="Open menu"
              tabIndex={open ? -1 : undefined}
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-mist text-text transition-colors hover:bg-contrast hover:text-contrast-on"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      <ShowreelPlayer open={playerOpen} onClose={closePlayer} />
    </>
  );
}
