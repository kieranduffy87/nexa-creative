import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { projects, projectList } from "../data/projects";

export default function ProjectPage() {
  const { slug } = useParams();
  const project = projects[slug];

  if (!project) return <Navigate to="/work" replace />;

  const currentIndex = projectList.findIndex((p) => p.slug === slug);
  const next = projectList[(currentIndex + 1) % projectList.length];

  return (
    <article>
      {/* Hero */}
      <section
        className="relative pt-32 md:pt-44 lg:pt-52 pb-16 md:pb-24 overflow-hidden"
        style={{ backgroundColor: project.heroBg }}
      >
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 z-10">
          <Link
            to="/work"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-text-muted hover:text-text tracking-[0.12em] uppercase mb-12 transition-colors"
          >
            <ArrowLeft size={14} />
            All Work
          </Link>
          <p className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase mb-6">
            {project.client}
          </p>
          <h1
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-[40px] sm:text-[56px] md:text-[80px] lg:text-[96px] font-normal text-text leading-[0.95] tracking-[-0.02em] mb-10 max-w-[1100px]"
          >
            {project.title}
          </h1>
          <p className="text-text text-base md:text-lg max-w-2xl leading-relaxed">
            {project.summary}
          </p>
        </div>
      </section>

      {/* Hero image */}
      <section style={{ backgroundColor: project.heroBg }} className="pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="aspect-[16/9] w-full overflow-hidden bg-bg-dark">
            <img
              src={project.hero}
              alt={`${project.client} hero`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Metadata */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
            <Meta label="Client" value={project.client} />
            <Meta label="Year" value={project.year} />
            <Meta label="Sector" value={project.sector} />
            <Meta label="Scope" value={project.services.join(", ")} />
            <Meta label="Team" value={project.team.join(", ")} />
          </div>
        </div>
      </section>

      {/* Sections */}
      {project.sections.map((section, i) => (
        <Section key={i} section={section} />
      ))}

      {/* Next project */}
      <section className="border-t border-border">
        <Link
          to={`/work/${next.slug}`}
          className="block group py-20 md:py-28"
        >
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
            <p className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase mb-6">
              Next Project
            </p>
            <h2
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-[32px] sm:text-[44px] md:text-[64px] lg:text-[80px] font-normal text-text leading-[0.95] tracking-[-0.02em] inline-flex items-center gap-4 md:gap-6 group-hover:text-nexa-red transition-colors duration-500"
            >
              {next.client}
              <ArrowUpRight
                size={48}
                className="md:w-16 md:h-16 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2"
              />
            </h2>
          </div>
        </Link>
      </section>
    </article>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <p className="text-text-muted text-[11px] font-medium tracking-[0.12em] uppercase mb-3">
        {label}
      </p>
      <p className="text-text text-sm leading-relaxed">{value}</p>
    </div>
  );
}

function Section({ section }) {
  if (section.type === "overview" || section.type === "text-block") {
    return (
      <section className="py-16 md:py-24 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
            <div className="md:col-span-3">
              <p className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase">
                {section.label}
              </p>
            </div>
            <div className="md:col-span-8 md:col-start-5">
              {section.heading && (
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{ fontFamily: "var(--font-serif)" }}
                  className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] font-normal text-text leading-[1.05] tracking-[-0.02em] mb-8"
                >
                  {section.heading}
                </motion.h2>
              )}
              {section.body.map((p, i) => (
                <p
                  key={i}
                  className="text-text text-base md:text-lg leading-relaxed mb-5 last:mb-0 max-w-3xl"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "image-full") {
    return (
      <section style={{ backgroundColor: section.bg || "#f5f5f5" }} className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-[16/9] w-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: section.innerBg || "#1a1a1a" }}
          >
            <img src={section.src} alt={section.caption || ""} className="w-3/4 max-w-[760px]" />
          </motion.div>
          {section.caption && (
            <p className="text-text-muted text-xs font-medium tracking-[0.05em] mt-4">
              {section.caption}
            </p>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "image-cover") {
    return (
      <section style={{ backgroundColor: section.bg || "#f5f5f5" }} className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-[16/9] w-full overflow-hidden bg-bg-dark"
          >
            <img
              src={section.src}
              alt={section.caption || ""}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {section.caption && (
            <p className="text-text-muted text-xs font-medium tracking-[0.05em] mt-4">
              {section.caption}
            </p>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "video") {
    return (
      <section style={{ backgroundColor: section.bg || "#0a0a0a" }} className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-[16/9] w-full overflow-hidden bg-bg-dark"
          >
            <video
              src={section.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          </motion.div>
          {section.caption && (
            <p className="text-text-muted text-xs font-medium tracking-[0.05em] mt-4">
              {section.caption}
            </p>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "image-grid") {
    return (
      <section style={{ backgroundColor: section.bg || "#f5f5f5" }} className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {section.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className="aspect-[4/3] flex items-center justify-center overflow-hidden mb-4"
                  style={{ backgroundColor: item.bg || "#fff" }}
                >
                  <img src={item.src} alt={item.label} className="w-1/2 max-w-[320px]" />
                </div>
                <p className="text-xs font-medium tracking-[0.05em] uppercase text-text-muted">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "image-grid-cover") {
    const isDark = section.bg && section.bg !== "#fff" && section.bg !== "#ffffff" && section.bg !== "#f5f5f5";
    return (
      <section style={{ backgroundColor: section.bg || "#f5f5f5" }} className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {section.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="aspect-[4/3] overflow-hidden mb-4 bg-bg-dark">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className={`text-xs font-medium tracking-[0.05em] uppercase ${
                    isDark ? "text-white/50" : "text-text-muted"
                  }`}
                >
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "cta") {
    return (
      <section className="py-20 md:py-32 border-t border-border bg-bg">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
            <div className="md:col-span-3">
              <p className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase">
                {section.label}
              </p>
            </div>
            <div className="md:col-span-8 md:col-start-5">
              <h2
                style={{ fontFamily: "var(--font-serif)" }}
                className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] font-normal text-text leading-[1.05] tracking-[-0.02em] mb-6"
              >
                {section.heading}
              </h2>
              <p className="text-text text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                {section.body}
              </p>
              <a
                href={section.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-nexa-red text-white px-5 py-3 text-sm font-medium hover:bg-text transition-colors"
              >
                {section.cta}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
