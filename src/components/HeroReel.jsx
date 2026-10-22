import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "../lib/motion";
import { projects } from "../data/projects";
import { useDock } from "../lib/dock";

const SLIDES = projects.map((p) => ({ kind: "project", key: p.slug, project: p }));
const N = SLIDES.length;

/* ── Ring geometry ──────────────────────────────────────────────────────
   Zoomed out, the cards sit on a ring seen from the front, as on mubien.com:
   the card at the front is largest, the two beside it are cut by the frame
   edges, and the ones round the back are small and sit between them. The
   ring is laid out by hand (no CSS 3D), from two numbers the timeline tweens:

     angle  which card faces the front, as a continuous slide index
     zoom   0 = the whole ring in view, 1 = the front card filling the frame

   Every card is laid out at full frame size and only ever scaled DOWN, so
   video and the WebGL canvas are never upscaled. */
const RING = 1.4; // ring radius, in frame widths
const LENS = 1.2; // perspective: smaller = steeper falloff to the back
const OVERVIEW = 0.34; // camera scale with the whole ring in view
const TILT = 0.8; // how far round-the-back cards rise; the camera looks down on
// the ring a little. With four cards a level ring would park the back card
// exactly behind the front one, so it would never be seen.
const RADIUS = 15; // card corner on screen while zoomed out, px
const SCROLL_PER_SLIDE = 0.7; // viewport heights of scroll per slide
const DWELL = 7; // seconds a slide holds before the reel moves on by itself

const lerp = (a, b, t) => a + (b - a) * t;
const pad = (n) => String(n).padStart(2, "0");
const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The homepage hero as a reel of the work, each case study full-bleed. On
 * arrival the ring spins in and settles on the first project; after that, each
 * scroll step zooms out to the ring, spins it to the next card and zooms back
 * in.
 *
 * Scroll drives it: the section pins for one short step per slide, and each
 * step plays a complete transition rather than scrubbing one, so the ring is
 * never left half-turned. After the last slide the pin releases and the rest
 * of the homepage scrolls as normal.
 *
 * Left alone, it also moves on by itself every DWELL seconds, as mubien's
 * does, and the nav bar fills behind its label as the countdown runs. It does
 * that by scrolling within the pinned range (nothing on screen moves except
 * the reel), so the pin stays the one source of truth for the slide. It holds
 * while the menu is open, while the tab is hidden, once the visitor has
 * scrolled past it, and when paused; it never runs under reduced motion.
 */
export function HeroReel() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const videosRef = useRef([]);
  const stRef = useRef(null);
  const tlRef = useRef(null);
  const ringRef = useRef({ angle: 0, zoom: 1 });
  const targetRef = useRef(0);

  const [active, setActive] = useState(0);
  const [moving, setMoving] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reduce] = useState(reducedMotion);
  const dwellRef = useRef(null);
  const { setReel, menuOpen } = useDock();

  /* ── Layout of every card for the current angle and zoom ──────────── */

  const render = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const W = section.clientWidth;
    const H = section.clientHeight;
    const { angle, zoom } = ringRef.current;
    const camera = lerp(OVERVIEW, 1, zoom);

    cardsRef.current.forEach((card, k) => {
      if (!card) return;
      // Signed distance round the ring, wrapped to the near side
      let d = (((k - angle) % N) + N) % N;
      if (d > N / 2) d -= N;
      const theta = (d / N) * Math.PI * 2;

      const depth = LENS / (LENS + RING * (1 - Math.cos(theta))); // 1 at the front
      const scale = camera * depth;
      const x = Math.sin(theta) * RING * W * camera;
      const y = -((1 - Math.cos(theta)) / 2) * H * camera * TILT;

      // Corners stay ~15px on screen at any size, except the front card,
      // which squares off as it fills the frame
      const front = Math.max(0, 1 - Math.abs(d));
      const r = (RADIUS / scale) * (1 - zoom * front);

      card.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${scale.toFixed(4)})`;
      card.style.borderRadius = `${r.toFixed(1)}px`;
      card.style.zIndex = String(Math.round(depth * 100));
    });
  }, []);

  /* ── Transitions ─────────────────────────────────────────────────── */

  const go = useCallback(
    (i) => {
      targetRef.current = i;
      const ring = ringRef.current;

      if (reducedMotion()) {
        ring.angle = i;
        ring.zoom = 1;
        render();
        setActive(i);
        return;
      }

      // Interrupting is fine: every tween starts from wherever the ring is,
      // so a fast scroll just re-aims it mid-turn.
      tlRef.current?.kill();
      setMoving(true);
      const turns = Math.abs(i - ring.angle);

      const tl = gsap.timeline({ onUpdate: render });
      tl.to(ring, { zoom: 0, duration: 0.7, ease: "power3.inOut" })
        .to(ring, { angle: i, duration: 0.8 + 0.18 * Math.min(turns, 3), ease: "power2.inOut" }, "-=0.25")
        .call(() => {
          setActive(i);
          setMoving(false);
        })
        .to(ring, { zoom: 1, duration: 0.85, ease: "power3.inOut" }, "-=0.15");

      tlRef.current = tl;
    },
    [render],
  );

  /* ── Arrival spin, then the scroll pin ───────────────────────────── */

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const ring = ringRef.current;
    const reduce = reducedMotion();

    if (reduce) {
      ring.angle = 0;
      ring.zoom = 1;
      render();
    } else {
      // Arrive zoomed out with the ring already turning, spin about a turn
      // and a quarter, and settle on the first project.
      ring.angle = -N * 1.25;
      ring.zoom = 0;
      render();
      setMoving(true);
      tlRef.current = gsap
        .timeline({ delay: 0.25, onUpdate: render })
        .to(ring, { angle: 0, duration: 2.4, ease: "power3.out" })
        .call(() => setMoving(false))
        .to(ring, { zoom: 1, duration: 1.05, ease: "power3.inOut" }, "-=0.55");
    }

    const onResize = () => render();
    window.addEventListener("resize", onResize);

    if (reduce) {
      return () => window.removeEventListener("resize", onResize);
    }

    // The section sits inside the page frame's inset. Pinning at "top top"
    // would snap it flush to the viewport and lose the frame while pinned, so
    // it pins at whatever offset it starts at.
    const offset = () => section.getBoundingClientRect().top + window.scrollY;
    const last = N - 1;

    const st = ScrollTrigger.create({
      trigger: section,
      start: () => `top ${offset()}px`,
      end: () => `+=${last * window.innerHeight * SCROLL_PER_SLIDE}`,
      pin: true,
      // ScrollTrigger turns pin spacing off by default when the pinned
      // element's parent is a flex container, and .page-frame is a flex
      // column. Without this the next section follows straight on and scrolls
      // up over the pinned reel.
      pinSpacing: true,
      anticipatePin: 1,
      snap: {
        snapTo: 1 / last,
        duration: { min: 0.25, max: 0.6 },
        delay: 0.08,
        ease: "power1.inOut",
      },
      onUpdate: (self) => {
        const i = Math.round(self.progress * last);
        if (i !== targetRef.current) go(i);
      },
      onToggle: (self) => setInView(self.isActive),
    });
    stRef.current = st;

    return () => {
      window.removeEventListener("resize", onResize);
      st.kill();
      tlRef.current?.kill();
      stRef.current = null;
    };
  }, [go, render]);

  /* Buttons and keys move the page, and the pin moves the reel, so there is
     only ever one source of truth for which slide is showing. */
  const jump = useCallback(
    (i) => {
      const n = Math.max(0, Math.min(N - 1, i));
      const st = stRef.current;
      if (!st) {
        go(n);
        return;
      }
      const y = st.start + (n / (N - 1)) * (st.end - st.start);
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    },
    [go],
  );

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      jump(targetRef.current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      jump(targetRef.current - 1);
    }
  };

  /* ── Side effects of the live slide ─────────────────────────────── */

  // Only the slide on screen plays; the rest hold their poster frame
  useEffect(() => {
    videosRef.current.forEach((v, k) => {
      if (!v) return;
      if (k === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  // inView lets the nav drop back to its page-level action once the visitor
  // has scrolled past the reel, instead of offering a project off screen
  useEffect(() => {
    setReel({ index: active, count: N, slide: SLIDES[active], inView });
  }, [active, inView, setReel]);

  useEffect(() => () => setReel(null), [setReel]);

  /* ── Auto-advance ────────────────────────────────────────────────── */

  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const setProgress = (v) =>
    document.documentElement.style.setProperty("--reel-progress", v.toFixed(4));

  // One countdown per settled slide. It restarts from zero whenever a new
  // slide lands, and only pauses (rather than restarting) when something
  // briefly holds it, so opening and closing the menu does not reset it.
  useEffect(() => {
    if (reduce) return undefined;
    const d = dwellRef.current;

    if (moving) {
      d?.tween.kill();
      dwellRef.current = null;
      setProgress(0);
      return undefined;
    }

    const held = paused || menuOpen || !pageVisible || !inView;
    if (d && d.index === active) {
      if (held) d.tween.pause();
      else d.tween.resume();
      return undefined;
    }

    d?.tween.kill();
    const state = { p: 0 };
    setProgress(0);
    const tween = gsap.to(state, {
      p: 1,
      duration: DWELL,
      ease: "none",
      paused: held,
      onUpdate: () => setProgress(state.p),
      onComplete: () => jump((targetRef.current + 1) % N),
    });
    dwellRef.current = { tween, index: active };
    return undefined;
  }, [active, moving, paused, menuOpen, pageVisible, inView, reduce, jump]);

  useEffect(
    () => () => {
      dwellRef.current?.tween.kill();
      document.documentElement.style.removeProperty("--reel-progress");
    },
    [],
  );

  const slide = SLIDES[active];

  return (
    <section
      ref={sectionRef}
      className="hero-reel relative isolate h-[calc(100svh-(var(--frame-inset)*2))] min-h-[34rem] overflow-hidden rounded-[var(--panel-radius)] bg-bone text-white"
      aria-roledescription="carousel"
      aria-label="Selected work"
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      <h1 className="sr-only">
        Nexa Creative, a Dublin studio for brand and digital design
      </h1>

      {/* ── The ring ──────────────────────────────────────────────── */}
      {SLIDES.map((s, k) => (
        <div
          key={s.key}
          ref={(el) => (cardsRef.current[k] = el)}
          className="absolute inset-0 overflow-hidden will-change-transform"
          style={{ transformOrigin: "50% 50%" }}
          aria-hidden={k !== active}
        >
          <div className="absolute inset-0" style={{ background: s.project.accent }}>
            <video
              ref={(el) => (videosRef.current[k] = el)}
              src={s.project.heroVideo}
              poster={s.project.heroPoster}
              muted
              loop
              playsInline
              preload={k === 0 ? "auto" : "metadata"}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/5 to-transparent" />
            {/* Phones carry the name low-left, so it needs ground to sit on */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 to-transparent md:hidden" />
          </div>
        </div>
      ))}

      {/* ── Overlay ───────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-[200]">
        {/* White on the media, so it steps out while the ring shows the
            light ground behind the cards */}
        <p
          className={`absolute right-5 top-5 hidden text-[12px] tracking-[-0.01em] text-white/70 transition-opacity duration-500 lg:block lg:right-7 lg:top-6 ${
            moving ? "opacity-0" : "opacity-100"
          }`}
        >
          Brand, digital and motion. Dublin.
        </p>

        {/* The live slide's name, small and quiet, after mubien: the work is
            the headline. It leaves as the ring zooms out and arrives as it
            zooms back in, so nothing reads at thumbnail size. Placement and
            the enter/leave motion are on separate elements because both are
            translates and would overwrite each other on one. */}
        <div
          className="absolute inset-x-0 bottom-16 px-5 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:px-8"
          aria-live="polite"
        >
          <div
            key={slide.key}
            className={`transition-[opacity,transform] duration-500 ${
              moving ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <h2 className="max-w-[14ch] text-[clamp(1.75rem,2.6vw,2.5rem)] font-normal leading-[1.06] tracking-[-0.035em]">
              {slide.project.name}
            </h2>
          </div>
        </div>

        {/* Counter and steppers, bottom-left */}
        <div className="pointer-events-auto absolute bottom-4 left-4 flex items-center gap-1.5 md:bottom-6 md:left-7">
          <span className="rounded-[10px] bg-black/35 px-2.5 py-1.5 text-[12px] tabular-nums tracking-[0.04em] text-white backdrop-blur-md">
            {pad(active + 1)} <span className="text-white/45">/ {pad(N)}</span>
          </span>
          <button
            type="button"
            onClick={() => jump(targetRef.current - 1)}
            disabled={active === 0}
            aria-label="Previous"
            className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-black/35 text-white backdrop-blur-md transition-opacity hover:bg-black/55 disabled:opacity-30"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
              <path d="M7.5 2.5 4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {!reduce && (
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              aria-pressed={paused}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/55"
            >
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden="true">
                {paused ? (
                  <path d="M3.5 2.2v7.6L9.6 6z" />
                ) : (
                  <path d="M3 2.5h2v7H3zM7 2.5h2v7H7z" />
                )}
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={() => jump(targetRef.current + 1)}
            disabled={active === N - 1}
            aria-label="Next"
            className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-black/35 text-white backdrop-blur-md transition-opacity hover:bg-black/55 disabled:opacity-30"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
              <path d="M4.5 2.5 8 6 4.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
