import { useEffect, useLayoutEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Drives Lenis and keeps ScrollTrigger in step with it. Mounted once, in Layout.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    window.__lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
}

/** Jump to top without Lenis easing through the whole document. */
export function scrollToTop() {
  if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

const PRESETS = {
  up: { y: 28, opacity: 0 },
  fade: { opacity: 0 },
  scale: { opacity: 0, scale: 0.97 },
  left: { x: -24, opacity: 0 },
};

/**
 * Reveals its children on scroll. `stagger` walks direct children instead of
 * animating the wrapper, which is what gives the section-by-section cascade.
 */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "up",
  delay = 0,
  stagger = false,
  duration = 1,
  start = "top 85%",
  className = "",
  ...rest
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion()) {
      gsap.set(stagger ? el.children : el, { clearProps: "all", opacity: 1 });
      return;
    }

    const targets = stagger ? Array.from(el.children) : el;
    const from = PRESETS[variant] ?? PRESETS.up;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        from,
        {
          y: 0,
          x: 0,
          opacity: 1,
          scale: 1,
          duration,
          delay,
          ease: "expo.out",
          stagger: stagger ? 0.09 : 0,
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [variant, delay, stagger, duration, start]);

  return (
    <Tag
      ref={ref}
      className={className}
      {...(stagger ? {} : { "data-reveal": "" })}
      {...rest}
    >
      {stagger
        ? Array.isArray(children)
          ? children
          : children
        : children}
    </Tag>
  );
}

/**
 * Slow parallax drift for hero and full-bleed media.
 */
export function useParallax(ref, distance = 80) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;

    const ctx = gsap.context(() => {
      // Symmetric about centre: paired with .media-parallax overscan this
      // never lets the frame's background show through at an edge.
      gsap.fromTo(el, { yPercent: -distance / 20 }, {
        yPercent: distance / 20,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [ref, distance]);
}

export { gsap, ScrollTrigger };
