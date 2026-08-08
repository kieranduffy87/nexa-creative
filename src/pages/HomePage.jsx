import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../lib/motion";

// Three.js is ~700kB of the bundle and nothing above the fold depends on it,
// so it loads as its own chunk after the page has painted.
const NexaGlassScene = lazy(() =>
  import("../components/NexaGlassScene").then((m) => ({
    default: m.NexaGlassScene,
  })),
);
import {
  ArrowIcon,
  Asterisk,
  Eyebrow,
  Ordinal,
  PillButton,
  SectionHeader,
} from "../components/ui";
import { projects } from "../data/projects";
import { asset } from "../lib/asset";

/* --------------------------------------------------------------- content --- */

const LOGOS = [
  "Group-copy.svg",
  "Group-1-copy.svg",
  "Group-2-copy.svg",
  "Group-3-copy.svg",
  "Group-4-copy.svg",
  "Group-5-copy.svg",
  "Group-6-copy.svg",
  "Group-567-copy.svg",
  "Group-568-copy.svg",
];

const SERVICES = [
  {
    title: "Brand",
    body: "Positioning, naming, identity systems and the guidelines that hold them together. We build brands as toolkits, so the tenth piece of collateral looks like the first.",
    icon: "asterisk",
  },
  {
    title: "Digital",
    body: "Websites and products designed and built in the same room. Plain language, real content, and interfaces that stay fast on the connection your customer actually has.",
    icon: "channel",
  },
  {
    title: "Motion",
    body: "3D, animation and campaign film drawn from the identity rather than bolted on. One build, reused everywhere motion is needed.",
    icon: "border",
  },
];

const APPROACH = [
  {
    title: "Evidence first",
    body: "We start with the category, the competitors and the people who actually buy. Positioning before pixels.",
  },
  {
    title: "Systems, not artefacts",
    body: "Every brand ships as a system with rules, so it survives being handed to a marketing team.",
  },
  {
    title: "Built to be built",
    body: "Design and development sit together. Nothing gets approved that cannot ship.",
  },
  {
    title: "Plain speech",
    body: "Jargon is a design failure. If a stranger cannot read it in three seconds, it goes back.",
  },
  {
    title: "One studio",
    body: "The people who pitch the work are the people who make it. No handover, no dilution.",
  },
];

const STEPS = [
  {
    title: "Kick off",
    body: "A working session to agree the problem, the audience and what success looks like, before anyone opens a design tool.",
  },
  {
    title: "Strategy & routes",
    body: "Category research, positioning, then two or three distinct creative routes with the reasoning attached.",
  },
  {
    title: "Build the system",
    body: "The chosen route developed into a full identity, digital platform and toolkit, with guidelines written as we go.",
  },
  {
    title: "Launch & extend",
    body: "Rollout across print, motion, environment and social. Then we stay available as the brand grows into new formats.",
  },
];

/* ------------------------------------------------------------------------- */

function ServiceIcon({ kind }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round",
  };
  if (kind === "channel") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8" {...common}>
        <path d="M4 12h16M4 6h10M4 18h7" />
      </svg>
    );
  }
  if (kind === "border") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8" {...common}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
        <path d="M12 3.5v17" />
      </svg>
    );
  }
  return <Asterisk className="h-8 w-8" />;
}

export default function HomePage() {
  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-bg-dark hero-grain relative overflow-hidden text-white">
        {/* Full-bleed glass composition: the Nexa mark extruded from its own
            path data, with glass fragments crowding in around it. */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <Suspense fallback={null}>
            <NexaGlassScene variant="shards" className="h-full w-full" />
          </Suspense>
        </div>

        {/* Legibility scrim, weighted to the left so the headline stays
            readable without flattening the composition behind it */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(100deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 34%, rgba(0,0,0,0) 62%)",
          }}
        />

        <div className="panel-full shell relative z-10 flex flex-col justify-end pb-16 pt-36 md:pb-20">
          <Reveal duration={1.3} className="max-w-[46rem]">
            <h1 className="t-display text-balance">
              Brand and digital design
              <br className="hidden sm:block" /> that earns attention.
            </h1>
          </Reveal>

          <Reveal
            delay={0.15}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <PillButton to="/contact" accent>
              Start a project
            </PillButton>
            <PillButton to="/work" className="!bg-white/10 !text-white">
              See the work
            </PillButton>
          </Reveal>

          <Reveal
            variant="fade"
            delay={0.3}
            className="mt-14 max-w-md border-t border-white/15 pt-5"
          >
            <p className="t-body !text-white/55">
              A Dublin studio building identities, websites and motion for
              companies that need to be taken seriously.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 2. Studio statement ─────────────────────────────────────────── */}
      <section className="section-y">
        <div className="shell">
          <Reveal variant="fade" duration={0.8}>
            <div className="hairline mb-4" />
            <Eyebrow>Our studio</Eyebrow>
          </Reveal>

          <Reveal duration={1.1} className="mt-8 max-w-5xl">
            <p className="t-h1 text-balance">
              We make brands that hold their nerve. Built as systems, written
              in plain speech, and designed to still look right on the hundredth
              piece of collateral.
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="mt-12 grid gap-10 md:grid-cols-3 md:gap-16"
            stagger
          >
            <p className="t-body">
              Most studios hand over a logo and a PDF. We hand over a working
              system: construction grids, colour roles, lockups for the awkward
              formats, and rules that survive being handed to a marketing team.
            </p>
            <p className="t-body">
              That matters because a brand is rarely broken by its identity. It
              is broken by the two hundred things made afterwards by people who
              were never in the room.
            </p>
            <p className="t-body">
              So we design for that moment instead of the presentation, and the
              work gets sharper, not looser, as it scales.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 3. Clients ──────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-mist py-16 md:py-20">
        <div className="shell">
          <Reveal variant="fade">
            <Eyebrow className="text-center">Clients</Eyebrow>
            <h2 className="t-h2 mt-6 text-center text-balance">
              Trusted by companies that cannot afford to look small.
            </h2>
          </Reveal>
        </div>

        <div className="marquee-mask mt-12 overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-16 px-8 md:gap-24">
            {[...LOGOS, ...LOGOS].map((file, i) => (
              <img
                key={`${file}-${i}`}
                src={asset(`logos/${file}`)}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-6 w-auto shrink-0 opacity-40 md:h-8"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Services ─────────────────────────────────────────────────── */}
      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="Services"
            title="Three disciplines, run out of one studio."
            body="Visually stunning work is the easy part. Holding it together across every format a company actually needs is the job."
            action={<PillButton to="/services">All services</PillButton>}
          />

          <Reveal
            className="mt-16 grid gap-px overflow-hidden rounded-card bg-border md:grid-cols-3"
            stagger
          >
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="group flex flex-col bg-bg p-8 transition-colors duration-500 hover:bg-mist md:p-10"
              >
                <span className="text-nexa-red transition-transform duration-700 group-hover:rotate-90">
                  <ServiceIcon kind={s.icon} />
                </span>
                <h3 className="t-h3 mt-10">{s.title}</h3>
                <p className="t-body mt-4 flex-1">{s.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── 5. Case studies ─────────────────────────────────────────────── */}
      <section className="section-y bg-bone">
        <div className="shell">
          <SectionHeader
            eyebrow="Our work"
            title="Case studies."
            body="Three brands built end to end: identity, guidelines, digital, motion and the applied estate."
            action={<PillButton to="/work">View all work</PillButton>}
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <Link to={`/work/${p.slug}`} className="group block">
                  <div
                    className="media media-zoom aspect-[4/3]"
                    style={{ background: p.accent }}
                  >
                    <video
                      src={p.heroVideo}
                      poster={p.heroPoster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-6">
                    <div>
                      <h3 className="t-h3">{p.name}</h3>
                      <p className="t-body mt-1.5">{p.tagline}</p>
                    </div>
                    <span className="arrow-dot mt-1 transition-transform duration-500 group-hover:translate-x-1">
                      <ArrowIcon />
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="tag-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Approach ─────────────────────────────────────────────────── */}
      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="Our approach"
            title="Where your ambition meets velocity."
            body="Five principles that decide how the work gets made, and what we turn down."
            action={<PillButton to="/about">About the studio</PillButton>}
          />

          <Reveal
            className="mt-16 grid gap-px overflow-hidden rounded-card bg-border sm:grid-cols-2 lg:grid-cols-3"
            stagger
          >
            {APPROACH.map((a, i) => (
              <div key={a.title} className="bg-bg p-8 md:p-10">
                <Ordinal n={i + 1} className="text-nexa-red" />
                <h3 className="t-h4 mt-6">{a.title}</h3>
                <p className="t-body mt-3">{a.body}</p>
              </div>
            ))}
            {/* Sixth cell keeps the 3-col grid square */}
            <div className="hidden bg-bg p-8 md:p-10 lg:flex lg:items-end">
              <PillButton to="/contact" accent>
                Work with us
              </PillButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 7. How it works ─────────────────────────────────────────────── */}
      <section className="section-y bg-ink text-white">
        <div className="shell">
          <Reveal variant="fade" duration={0.8}>
            <div className="h-px bg-ink-border" />
            <p className="t-eyebrow mt-4 text-white/45">How it works</p>
          </Reveal>

          <Reveal duration={1.1} className="mt-8 max-w-3xl">
            <h2 className="t-h1 text-balance">
              Four stages, and you are in the room for all of them.
            </h2>
          </Reveal>

          <div className="mt-16 divide-y divide-white/10 border-t border-white/10">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} variant="left" delay={i * 0.06}>
                <div className="grid items-start gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                  <Ordinal n={i + 1} className="text-nexa-red md:col-span-1" />
                  <h3 className="t-h3 md:col-span-4">{s.title}</h3>
                  <p className="t-body !text-white/55 md:col-span-7">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Closing CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-nexa-red text-white">
        <div className="shell relative z-10 py-24 text-center md:py-36">
          <Reveal duration={1.2}>
            <h2 className="t-display mx-auto max-w-4xl text-balance">
              Ready to make your brand work harder?
            </h2>
          </Reveal>

          <Reveal variant="fade" delay={0.15} className="mt-10">
            <Link
              to="/contact"
              className="btn-pill !bg-white !text-ink hover:!bg-ink hover:!text-white"
            >
              <span>Start a project</span>
              <span className="arrow-dot !bg-nexa-red !text-white">
                <ArrowIcon />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
