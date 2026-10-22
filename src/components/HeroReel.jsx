import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "../lib/motion";
import { projects } from "../data/projects";
import { PillButton } from "./ui";
import { useDock } from "../lib/dock";

// Three.js is ~700kB and nothing above the fold depends on it arriving first,
// so the glass loads as its own chunk after the page has painted.
const NexaGlassScene = lazy(() =>
  import("./NexaGlassScene").then((m) => ({ default: m.NexaGlassScene })),
);

const SLIDES = [
  { kind: "intro", key: "intro" },
  ...projects.map((p) => ({ kind: "project", key: p.slug, project: p })),
];

/* The strip is laid out at full size and zoomed DOWN for the overview, never
   laid out small and zoomed up: video and the WebGL canvas render at their
   layout size, so scaling them up would soften every full-bleed frame. */
const GAP = 8; // % of the stage width between cards in the strip
const STEP = 100 + GAP; // xPercent from one card to the next
const OVERVIEW = 0.34; // strip scale while zoomed out
const BEHIND = 0.8; // cards other than the live one sit a little smaller
const RADIUS = 44; // card corner in layout px; ~15px on screen at OVERVIEW
const SCROLL_PER_SLIDE = 0.7; // viewport heights of scroll per slide

const pad = (n) => String(n).padStart(2, "0");

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The homepage hero as a reel of the work. The glass mark is the first slide,
 * then each case study full-bleed. Moving between them zooms out to the whole
 * strip, pans, and zooms back in on the next one.
 *
 * Scroll drives it: the section pins for one short step per slide, and each
 * step plays a complete transition rather than scrubbing one, so the strip is
 * never left half-zoomed. Once the last slide is reached the pin releases and
 * the rest of the homepage scrolls as normal.
 */
export function HeroReel() {
  const sectionRef = useRef(null);
  const zoomRef = useRef(null);
  const stripRef = useRef(null);
  const cardsRef = useRef([]);
  const videosRef = useRef([]);
  const stRef = useRef(null);
  const tlRef = useRef(null);
  const shownRef = useRef(0); // card the strip is centred on
  const targetRef = useRef(0); // card the strip is heading for

  const [active, setActive] = useState(0);
  const [moving, setMoving] = useState(false);
  const { setReel } = useDock();

  /* ── Transition ─────────────────────────────────────────────────────── */

  const go = useCallback((i) => {
    targetRef.current = i;
    const cards = cardsRef.current;
    const from = shownRef.current;

    if (reducedMotion()) {
      gsap.set(stripRef.current, { xPercent: -i * STEP });
      cards.forEach((c, k) => gsap.set(c, { scale: k === i ? 1 : BEHIND }));
      shownRef.current = i;
      setActive(i);
      return;
    }

    // Interrupting is fine: every tween starts from wherever the last one
    // left off, so a fast scroll just re-aims the strip mid-flight.
    tlRef.current?.kill();
    setMoving(true);

    const distance = Math.abs(i - from);
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        shownRef.current = i;
      },
    });

    tl.to(zoomRef.current, { scale: OVERVIEW, duration: 0.6 })
      .to(cards, { borderRadius: RADIUS, duration: 0.6 }, "<")
      .to(
        stripRef.current,
        { xPercent: -i * STEP, duration: 0.65 + 0.15 * Math.min(distance, 3) },
        "-=0.2",
      )
      .to(cards[i], { scale: 1, duration: 0.5 }, "<")
      .to(
        cards.filter((_, k) => k !== i),
        { scale: BEHIND, duration: 0.5 },
        "<",
      )
      .call(() => {
        setActive(i);
        setMoving(false);
      })
      .to(zoomRef.current, { scale: 1, duration: 0.7 }, "-=0.1")
      .to(cards, { borderRadius: 0, duration: 0.7 }, "<");

    tlRef.current = tl;
  }, []);

  /* ── Scroll pin ─────────────────────────────────────────────────────── */

  useLayoutEffect(() => {
    const section = sectionRef.current;
    gsap.set(stripRef.current, { xPercent: 0 });
    cardsRef.current.forEach((c, k) => gsap.set(c, { scale: k === 0 ? 1 : BEHIND }));

    if (reducedMotion()) return undefined;

    // The section sits inside the page frame's inset. Pinning at "top top"
    // would snap it flush to the viewport and lose the frame while pinned, so
    // it pins at whatever offset it starts at.
    const offset = () => section.getBoundingClientRect().top + window.scrollY;
    const last = SLIDES.length - 1;

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
    });
    stRef.current = st;

    return () => {
      st.kill();
      tlRef.current?.kill();
      stRef.current = null;
    };
  }, [go]);

  /* Buttons and keys move the page, and the pin moves the reel, so there is
     only ever one source of truth for which slide is showing. */
  const jump = useCallback(
    (i) => {
      const n = Math.max(0, Math.min(SLIDES.length - 1, i));
      const st = stRef.current;
      if (!st) {
        go(n);
        return;
      }
      const y = st.start + (n / (SLIDES.length - 1)) * (st.end - st.start);
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

  /* ── Side effects of the live slide ─────────────────────────────────── */

  // Only the slide on screen plays; the rest hold their poster frame
  useEffect(() => {
    videosRef.current.forEach((v, k) => {
      if (!v) return;
      if (k === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  useEffect(() => {
    setReel({ index: active, count: SLIDES.length, slide: SLIDES[active] });
  }, [active, setReel]);

  useEffect(() => () => setReel(null), [setReel]);

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
      {/* ── The strip ─────────────────────────────────────────────────── */}
      <div
        ref={zoomRef}
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: "50% 50%" }}
      >
        <div ref={stripRef} className="absolute inset-0 will-change-transform">
          {SLIDES.map((s, k) => (
            <div
              key={s.key}
              ref={(el) => (cardsRef.current[k] = el)}
              className="absolute inset-y-0 w-full overflow-hidden will-change-transform"
              style={{ left: `${k * STEP}%` }}
              aria-hidden={k !== active}
            >
              {s.kind === "intro" ? (
                <div className="hero-bg-dark hero-grain absolute inset-0">
                  <Suspense fallback={null}>
                    <NexaGlassScene variant="shards" className="h-full w-full" />
                  </Suspense>
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(100deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 34%, rgba(0,0,0,0) 62%)",
                    }}
                  />
                </div>
              ) : (
                <div className="absolute inset-0" style={{ background: s.project.accent }}>
                  <video
                    ref={(el) => (videosRef.current[k] = el)}
                    src={s.project.heroVideo}
                    poster={s.project.heroPoster}
                    muted
                    loop
                    playsInline
                    preload={k === 1 ? "auto" : "metadata"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Overlay ───────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* White on the media, so it steps out while the strip shows the
            light ground behind the cards */}
        <p
          className={`absolute right-5 top-5 hidden text-[12px] tracking-[-0.01em] text-white/70 transition-opacity duration-500 md:block md:right-7 md:top-6 ${
            moving ? "opacity-0" : "opacity-100"
          }`}
        >
          Brand, digital and motion. Dublin.
        </p>

        {/* Text for the live slide. It leaves as the strip zooms out and
            arrives as it zooms back in, so nothing reads at thumbnail size. */}
        {/* Placement and the enter/leave motion live on separate elements:
            both are translates, and on one element they would overwrite each
            other. */}
        <div
          className={`shell absolute inset-x-0 ${
            slide.kind === "intro" ? "bottom-28 md:bottom-24" : "top-1/2 -translate-y-1/2"
          }`}
          aria-live="polite"
        >
        <div
          key={slide.key}
          className={`transition-[opacity,transform] duration-500 ${
            moving ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {slide.kind === "intro" ? (
            <div className="pointer-events-auto max-w-[46rem]">
              <h1 className="t-display text-balance">
                Brand and digital design
                <br className="hidden sm:block" /> that earns attention.
              </h1>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <PillButton to="/contact" accent>
                  Start a project
                </PillButton>
                <PillButton to="/work" className="!bg-white/10 !text-white">
                  See the work
                </PillButton>
              </div>
              <p className="t-body mt-10 max-w-md !text-white/55">
                A Dublin studio building identities, websites and motion for
                companies that need to be taken seriously.
              </p>
            </div>
          ) : (
            <div className="max-w-[40rem]">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">
                {slide.project.sector}
              </p>
              <h2 className="mt-4 text-balance text-[clamp(2.75rem,7vw,6.5rem)] font-normal leading-[0.95] tracking-[-0.045em]">
                {slide.project.name}
              </h2>
              <p className="mt-5 text-[15px] text-white/70 md:text-[17px]">
                {slide.project.tagline}
              </p>
            </div>
          )}
        </div>
        </div>

        {/* Counter and steppers. Bottom-left on desktop; on phones the dock
            takes the full width of the bottom edge, so they move to the top. */}
        <div className="pointer-events-auto absolute right-4 top-4 flex items-center gap-1.5 md:bottom-6 md:left-7 md:right-auto md:top-auto">
          <span className="rounded-[10px] bg-black/35 px-2.5 py-1.5 text-[12px] tabular-nums tracking-[0.04em] text-white backdrop-blur-md">
            {pad(active + 1)} <span className="text-white/45">/ {pad(SLIDES.length)}</span>
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
          <button
            type="button"
            onClick={() => jump(targetRef.current + 1)}
            disabled={active === SLIDES.length - 1}
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
