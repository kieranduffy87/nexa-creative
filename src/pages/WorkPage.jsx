import { Link } from "react-router-dom";
import { Reveal } from "../lib/motion";
import { ArrowIcon, Eyebrow, PillButton } from "../components/ui";
import { projects } from "../data/projects";

export default function WorkPage() {
  return (
    <>
      <section className="shell pb-16 pt-36 md:pb-24 md:pt-48">
        <Reveal variant="fade">
          <div className="hairline mb-4" />
          <Eyebrow>Our work</Eyebrow>
        </Reveal>

        <Reveal duration={1.2} className="mt-8 max-w-4xl">
          <h1 className="t-display text-balance">Case studies.</h1>
        </Reveal>

        <Reveal delay={0.12} className="mt-8 max-w-xl">
          <p className="t-body-lg text-text-muted">
            Brands built end to end — identity and guidelines, digital
            platforms, motion, and the printed and physical estate that follows.
          </p>
        </Reveal>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="shell flex flex-col gap-16 md:gap-24">
          {projects.map((p, i) => (
            <Reveal key={p.slug} duration={1.1}>
              <Link to={`/work/${p.slug}`} className="group block">
                <div
                  className="media media-zoom aspect-[16/10] md:aspect-[16/8]"
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

                <div className="mt-6 grid gap-4 md:grid-cols-12 md:gap-10">
                  <div className="md:col-span-5">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="t-h2">{p.name}</h2>
                      <span className="arrow-dot mt-1.5 transition-transform duration-500 group-hover:translate-x-1">
                        <ArrowIcon />
                      </span>
                    </div>
                    <p className="t-body mt-2">{p.tagline}</p>
                  </div>

                  <div className="md:col-span-6 md:col-start-7">
                    <p className="t-body line-clamp-3">{p.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="tag-pill">
                          {t}
                        </span>
                      ))}
                      <span className="tag-pill">{p.year}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-nexa-red text-white">
        <div className="shell py-24 text-center md:py-32">
          <Reveal duration={1.2}>
            <h2 className="t-display mx-auto max-w-3xl text-balance">
              Want yours in here?
            </h2>
          </Reveal>
          <Reveal variant="fade" delay={0.15} className="mt-10">
            <PillButton to="/contact" className="!bg-white !text-ink">
              Start a project
            </PillButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
