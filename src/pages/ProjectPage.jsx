import { useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Reveal, useParallax } from "../lib/motion";
import {
  ArrowIcon,
  Asterisk,
  Eyebrow,
  Ordinal,
  PillButton,
} from "../components/ui";
import { getAdjacent, getProject } from "../data/projects";

/* ---------------------------------------------------------------- media --- */

function Media({ kind, src, poster, className = "" }) {
  if (kind === "video") {
    return (
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={className}
      />
    );
  }
  return <img src={src} alt="" loading="lazy" className={className} />;
}

const WIDTHS = {
  full: "shell",
  wide: "shell",
  inset: "shell",
};

function MediaBlock({ kind, src, width = "wide", bg, caption }) {
  const inner = (
    <figure>
      <div
        className="media"
        style={bg ? { background: bg } : undefined}
      >
        <Media kind={kind} src={src} className="w-full" />
      </div>
      {caption && (
        <figcaption className="t-body mt-4 !text-[13px]">{caption}</figcaption>
      )}
    </figure>
  );

  if (width === "full") {
    return (
      <div className="px-5 md:px-10 xl:px-16">
        <div className="mx-auto max-w-[1600px]">{inner}</div>
      </div>
    );
  }
  return <div className={WIDTHS[width]}>{inner}</div>;
}

function MediaGrid({ items, cols = 2 }) {
  return (
    <div className="shell">
      <Reveal
        className={`grid gap-4 md:gap-6 ${
          cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"
        }`}
        stagger
      >
        {items.map((it, i) => (
          <div key={i} className="media aspect-[4/3]">
            <Media kind={it.kind} src={it.src} />
          </div>
        ))}
      </Reveal>
    </div>
  );
}

/* --------------------------------------------------------------- section --- */

function Section({ section }) {
  if (section.type === "text") {
    return (
      <div className="shell">
        <div className="grid gap-6 md:grid-cols-12 md:gap-10">
          {/* Sticky must sit on the grid item itself — a wrapper sized to its
              own content has no travel to stick within. */}
          <Reveal className="md:col-span-5 md:sticky md:top-32 md:self-start">
            <h2 className="t-h2 text-balance">{section.title}</h2>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-7" stagger>
            {section.body.map((p, i) => (
              <p key={i} className="t-body-lg mb-5 last:mb-0 text-text-muted">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </div>
    );
  }

  if (section.type === "media") {
    return (
      <Reveal variant="scale" duration={1.2}>
        <MediaBlock {...section} />
      </Reveal>
    );
  }

  if (section.type === "media-grid") {
    return <MediaGrid items={section.items} cols={section.cols} />;
  }

  return null;
}

/* ------------------------------------------------------------------ page --- */

export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProject(slug);
  const heroRef = useRef(null);

  useParallax(heroRef, 60);

  if (!project) return <Navigate to="/work" replace />;

  const { prev, next } = getAdjacent(slug);

  const meta = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "Sector", value: project.sector },
  ];

  return (
    <>
      {/* ── Title ───────────────────────────────────────────────────────── */}
      <section className="shell pb-12 pt-36 md:pb-16 md:pt-48">
        <Reveal variant="fade">
          <Link
            to="/work"
            className="t-eyebrow inline-flex items-center gap-2 transition-colors hover:text-ink"
          >
            {/* The glyph points up-right, so 225° lands it pointing west */}
            <ArrowIcon className="h-2.5 w-2.5 rotate-[225deg]" />
            All work
          </Link>
        </Reveal>

        <Reveal duration={1.2} className="mt-10">
          <h1 className="t-display text-balance">{project.name}</h1>
        </Reveal>

        <Reveal delay={0.1} className="mt-6 flex flex-wrap items-center gap-3">
          <p className="t-h3 !font-normal text-text-muted">
            {project.tagline}
          </p>
        </Reveal>

        <Reveal delay={0.16} className="mt-8 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="tag-pill">
              {t}
            </span>
          ))}
        </Reveal>
      </section>

      {/* ── Hero media ──────────────────────────────────────────────────── */}
      <div className="px-5 md:px-10 xl:px-16">
        <Reveal variant="scale" duration={1.4}>
          <div
            className="media mx-auto max-w-[1600px] aspect-[16/10] md:aspect-[16/8]"
            style={{ background: project.accent }}
          >
            <video
              ref={heroRef}
              src={project.heroVideo}
              poster={project.heroPoster}
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </Reveal>
      </div>

      {/* ── Overview + meta ─────────────────────────────────────────────── */}
      <section className="section-y">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-12 md:gap-10">
            <Reveal className="md:col-span-7">
              <p className="t-h2 text-balance">{project.summary}</p>
            </Reveal>

            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
              <dl className="divide-y divide-border border-y border-border">
                {meta.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-baseline justify-between gap-6 py-4"
                  >
                    <dt className="t-eyebrow">{m.label}</dt>
                    <dd className="text-[15px] tracking-[-0.02em]">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="t-eyebrow mt-10">Scope</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.scope.map((s) => (
                  <li key={s} className="tag-pill">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-20 pb-24 md:gap-28 md:pb-32">
        {project.sections.map((s, i) => (
          <Section key={i} section={s} />
        ))}
      </div>

      {/* ── Process notes ───────────────────────────────────────────────── */}
      <section className="section-y bg-ink text-white">
        <div className="shell">
          <Reveal variant="fade">
            <div className="h-px bg-ink-border" />
            <p className="t-eyebrow mt-4 text-white/45">Process notes</p>
          </Reveal>

          <Reveal duration={1.1} className="mt-8 max-w-3xl">
            <h2 className="t-h1 text-balance">
              How the work actually happened.
            </h2>
          </Reveal>

          <div className="mt-16 divide-y divide-white/10 border-t border-white/10">
            {project.process.map((p, i) => (
              <Reveal key={p.title} variant="left" delay={i * 0.05}>
                <div className="grid items-start gap-4 py-8 md:grid-cols-12 md:gap-8">
                  <Ordinal n={i + 1} className="text-nexa-red md:col-span-1" />
                  <h3 className="t-h3 md:col-span-4">{p.title}</h3>
                  <p className="t-body !text-white/55 md:col-span-7">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Decisions ───────────────────────────────────────────────────── */}
      <section className="section-y">
        <div className="shell">
          <Reveal variant="fade">
            <div className="hairline mb-4" />
            <Eyebrow>Decisions</Eyebrow>
          </Reveal>

          <Reveal duration={1.1} className="mt-8 max-w-3xl">
            <h2 className="t-h1 text-balance">
              Three decisions that shaped it.
            </h2>
          </Reveal>

          <Reveal
            className="mt-16 grid gap-px overflow-hidden rounded-card bg-border md:grid-cols-3"
            stagger
          >
            {project.decisions.map((d, i) => (
              <div key={d.title} className="bg-bg p-8 md:p-10">
                <Ordinal n={i + 1} className="text-nexa-red" />
                <h3 className="t-h3 mt-6 text-balance">{d.title}</h3>
                <p className="t-body mt-4">{d.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Brand system, distilled ─────────────────────────────────────── */}
      <section className="section-y bg-bone">
        <div className="shell">
          <Reveal variant="fade">
            <div className="hairline mb-4" />
            <Eyebrow>The system, distilled</Eyebrow>
          </Reveal>

          <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-10">
            <Reveal className="md:col-span-7">
              <h3 className="t-h4">Palette</h3>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {project.palette.map((c) => (
                  <div key={c.hex}>
                    <div
                      className="aspect-[3/2] rounded-image border border-black/10"
                      style={{ background: c.hex }}
                    />
                    <p className="mt-2.5 text-[13px] font-medium tracking-[-0.02em]">
                      {c.name}
                    </p>
                    <p className="t-body !text-[12px] uppercase">{c.hex}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
              <h3 className="t-h4">Principles</h3>
              <dl className="mt-6 divide-y divide-black/10 border-y border-black/10">
                {project.principles.map((p) => (
                  <div key={p.name} className="py-4">
                    <dt className="flex items-center gap-2 text-[15px] font-medium tracking-[-0.02em]">
                      <Asterisk className="h-3 w-3 text-nexa-red" />
                      {p.name}
                    </dt>
                    <dd className="t-body mt-1 !text-[13px]">{p.body}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Next project ────────────────────────────────────────────────── */}
      <section className="section-y">
        <div className="shell">
          <div className="hairline" />
          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <Eyebrow>Next project</Eyebrow>
              <Link to={`/work/${next.slug}`} className="group mt-4 block">
                <h2 className="t-h1 transition-colors duration-300 group-hover:text-nexa-red">
                  {next.name}
                </h2>
                <p className="t-body mt-2">{next.tagline}</p>
              </Link>
            </Reveal>

            <Reveal delay={0.08} className="flex gap-2">
              {prev.slug !== next.slug && (
                <PillButton to={`/work/${prev.slug}`}>Previous</PillButton>
              )}
              <PillButton to={`/work/${next.slug}`} accent>
                Next
              </PillButton>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
