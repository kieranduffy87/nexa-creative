import { Reveal } from "../lib/motion";
import { Eyebrow } from "./ui";

export function PageHero({ tag, title, subtitle }) {
  return (
    <section className="shell pb-16 pt-36 md:pb-24 md:pt-48">
      {tag && (
        <Reveal variant="fade">
          <div className="hairline mb-4" />
          <Eyebrow>{tag}</Eyebrow>
        </Reveal>
      )}

      <Reveal duration={1.2} className="mt-8 max-w-5xl">
        <h1 className="t-display text-balance">{title}</h1>
      </Reveal>

      {subtitle && (
        <Reveal delay={0.12} className="mt-8 max-w-xl">
          <p className="t-body-lg text-text-muted">{subtitle}</p>
        </Reveal>
      )}
    </section>
  );
}
