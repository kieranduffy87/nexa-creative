import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowIcon } from "./ui";
import { projects } from "../data/projects";

const DWELL = 5000;

/**
 * A numbered index of the work, sitting along the foot of the hero and
 * advancing on its own. It gives the hero something that moves without
 * touching the glass composition behind it, and it puts four live links to
 * the case studies above the fold.
 *
 * The timer is the only thing that animates, so when the visitor has asked for
 * reduced motion it simply stops: the index still works, it just waits to be
 * clicked rather than moving by itself.
 */
export function HeroTicker() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const paused = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAuto(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!auto) return undefined;
    const id = setInterval(() => {
      if (!paused.current) setI((n) => (n + 1) % projects.length);
    }, DWELL);
    return () => clearInterval(id);
  }, [auto]);

  const p = projects[i];
  const n = (k) => String(k + 1).padStart(2, "0");

  return (
    <div
      className="border-t border-white/15 pt-5"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        {/* The current project, swapped in place */}
        <Link
          to={`/work/${p.slug}`}
          className="group flex min-w-0 items-end gap-4"
          aria-label={`${p.name} case study`}
        >
          <span className="text-[11px] tabular-nums leading-none tracking-[0.14em] text-white/40">
            {n(i)}
            <span className="mx-1">/</span>
            {String(projects.length).padStart(2, "0")}
          </span>

          <span key={p.slug} className="hero-ticker-swap min-w-0">
            <span className="block truncate text-[15px] tracking-[-0.02em] text-white md:text-[17px]">
              {p.name}
            </span>
            <span className="mt-1 block truncate text-[12px] text-white/45">
              {p.tagline}
            </span>
          </span>

          {/* Not .arrow-dot: that fills itself with --color-contrast, which in
              dark mode is near-white, so a white arrow vanishes into it. */}
          <span className="mb-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill border border-white/25 text-white transition-all duration-500 group-hover:translate-x-1 group-hover:border-white/60">
            <ArrowIcon className="h-3 w-3" />
          </span>
        </Link>

        {/* Index: one bar per project, the live one filling as it dwells */}
        <div className="flex items-center gap-2">
          {projects.map((q, k) => (
            <button
              key={q.slug}
              type="button"
              onClick={() => setI(k)}
              aria-label={q.name}
              aria-current={k === i ? "true" : undefined}
              className="group h-5 w-10 cursor-pointer md:w-14"
            >
              {/* The active track is brightened in its own right, so which
                  project is showing stays legible even if the fill animation
                  never gets a chance to run. */}
              <span
                className={`relative block h-px w-full overflow-hidden transition-colors duration-300 ${
                  k === i ? "bg-white/50" : "bg-white/20 group-hover:bg-white/40"
                }`}
              >
                {k === i && (
                  <span
                    key={`${q.slug}-${auto}`}
                    className="absolute inset-y-0 left-0 block bg-white"
                    style={
                      auto
                        ? { animation: `hero-ticker-fill ${DWELL}ms linear forwards` }
                        : { width: "100%" }
                    }
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
