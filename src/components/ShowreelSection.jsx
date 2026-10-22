import { useEffect, useRef } from "react";
import { Reveal } from "../lib/motion";
import { asset } from "../lib/asset";
import { useDock } from "../lib/dock";
import { SectionHeader } from "./ui";

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function PlayIcon() {
  return (
    <svg viewBox="0 0 12 12" className="ml-px h-2.5 w-2.5" fill="currentColor" aria-hidden="true">
      <path d="M3 1.8v8.4L10 6z" />
    </svg>
  );
}

/**
 * The showreel on the homepage. Inline it runs silent, from a lighter 720p
 * cut that only loads once it scrolls into view and pauses again when it
 * leaves; it never autoplays under reduced motion. Clicking it, or "Play with
 * sound", opens the full 1080p reel with its score in the nav's player.
 *
 * Nothing is laid over the picture: the controls sit in the header above it.
 */
export function ShowreelSection() {
  const videoRef = useRef(null);
  const { setPlayerOpen } = useDock();
  const open = () => setPlayerOpen(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reducedMotion()) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.getAttribute("src")) v.setAttribute("src", asset("showreel/nexa-showreel-inline.mp4"));
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section-y">
      <div className="shell">
        <SectionHeader
          eyebrow="Showreel"
          title="Four brands in forty-two seconds."
          action={
            <button type="button" onClick={open} className="btn-pill">
              <span>Play with sound</span>
              <span className="arrow-dot">
                <PlayIcon />
              </span>
            </button>
          }
        />

        <Reveal duration={1.1} className="mt-12 md:mt-16">
          <button
            type="button"
            onClick={open}
            aria-label="Play the showreel with sound"
            className="group block w-full overflow-hidden rounded-[var(--radius-image)] bg-black"
          >
            <video
              ref={videoRef}
              poster={asset("showreel/nexa-showreel-poster.jpg")}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
            />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
