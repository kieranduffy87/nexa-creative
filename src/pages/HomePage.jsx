import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { BackgroundVideo } from "../components/BackgroundVideo";

const workPreview = [
  {
    title: "WhatsExposed",
    tags: ["Brand Strategy", "Naming", "Brand Identity", "Logo System", "Guidelines", "Web"],
    image: "/projects/whatsexposed/hero-laptop.webp",
    span: "md:col-span-7",
    href: "/work/whatsexposed",
  },
  {
    title: "Meridian Property Group",
    tags: ["Brand Strategy", "Naming", "Logo", "Digital Experience", "Web", "Engineering"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80",
    span: "md:col-span-5",
    href: "/work",
  },
  {
    title: "Wild Atlantic Tours",
    tags: ["Brand Strategy", "Research", "Brand Identity", "Logo", "Guidelines", "Campaigns", "Motion & Video"],
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2200&q=80",
    span: "md:col-span-12",
    href: "/work",
  },
  {
    title: "Bloom Wellness Studio",
    tags: ["Brand Strategy", "Naming", "Brand Identity", "Logo", "Guidelines", "Campaigns"],
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1400&q=80",
    span: "md:col-span-5",
    href: "/work",
  },
  {
    title: "Harbour Coffee Roasters",
    tags: ["Naming", "Research", "Brand Identity", "Logo", "Guidelines", "Campaigns", "Packaging"],
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80",
    span: "md:col-span-7",
    href: "/work",
  },
];

const insights = [
  {
    title: "The Future of Digital Marketing in Ireland",
    days: "12 days ago",
    category: "Opinion",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&q=80",
  },
  {
    title: "Nexa Creative featured in Irish Design Awards",
    days: "47 days ago",
    category: "Press",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80",
  },
  {
    title: "Why Every Business Needs an AI SEO Strategy",
    days: "82 days ago",
    category: "Insights",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
  },
];

export default function HomePage() {
  const heroRef = useRef(null);

  const handleHeroMouseMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  const heroWords = [
    { text: "Transforming", italic: true },
    { text: "Brands," },
    { text: "Building", break: true },
    { text: "Futures", italic: true },
  ];

  return (
    <>
      {/* Hero - video background with red spotlight + mouse-tracked overlays */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="hero-red relative pt-32 md:pt-44 lg:pt-52 pb-32 md:pb-44 lg:pb-52"
      >
        {/* Background video */}
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          aria-hidden="true"
        />
        {/* Red tint overlay for brand cohesion + text contrast */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(239,65,54,0.55) 0%, rgba(239,65,54,0.45) 50%, rgba(140,20,20,0.65) 100%)",
            mixBlendMode: "multiply",
          }}
          aria-hidden="true"
        />
        <div className="hero-spotlight" aria-hidden="true" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 z-10">
          <h1
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-[44px] sm:text-[68px] md:text-[96px] lg:text-[128px] xl:text-[144px] font-normal text-white leading-[0.92] tracking-[-0.025em] mb-10 md:mb-14"
          >
            {heroWords.map((w, i) => (
              <span key={i}>
                <span className="hero-word">
                  {w.italic ? <em>{w.text}</em> : w.text}
                </span>
                {w.break ? <br className="hidden sm:block" /> : " "}
              </span>
            ))}
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-xl leading-relaxed">
            A Dublin-based creative agency working across strategy, design, and digital.
          </p>
        </div>
      </section>

      {/* Ambition section with video */}
      <section className="pt-24 md:pt-40 pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mb-10 md:mb-16">
            <div className="md:col-span-3">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase"
              >
                Ambition
              </motion.p>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ fontFamily: "var(--font-serif)" }}
              className="md:col-span-9 text-[32px] sm:text-[44px] md:text-[56px] lg:text-[68px] font-normal text-text leading-[1.05] tracking-[-0.02em]"
            >
              We exist to make the <em>new possible</em>. New brands. New growth. New <em>futures</em>.
            </motion.h2>
          </div>

          {/* 16:9 Video */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="aspect-video w-full overflow-hidden bg-black"
          >
            <BackgroundVideo />
          </motion.div>
        </div>
      </section>

      {/* Selected Work */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          {/* Header */}
          <div className="border-t border-border pt-10 md:pt-14 mb-10 md:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
              <div className="md:col-span-3">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase"
                >
                  Selected Work
                </motion.p>
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ fontFamily: "var(--font-serif)" }}
                className="md:col-span-6 text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-normal text-text leading-[1.1] tracking-[-0.02em]"
              >
                Work created at moments where change becomes <em>inevitable by design</em>.
              </motion.h2>
              <div className="md:col-span-3 md:justify-self-end">
                <Link
                  to="/work"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text hover:text-text-muted transition-colors group"
                >
                  All Work
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Asymmetric work grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-14 md:gap-y-20">
            {workPreview.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: (i % 2) * 0.1 }}
                className={project.span}
              >
                <Link to={project.href} className="block group">
                  <div
                    className="aspect-[3/2] overflow-hidden mb-5 md:mb-6 flex items-center justify-center"
                    style={{ backgroundColor: project.imageBg || "#1a1a1a" }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className={
                        project.imageBg
                          ? "w-2/3 max-w-[420px] group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                          : "w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                      }
                    />
                  </div>
                  <h3
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-2xl md:text-3xl font-normal text-text leading-tight mb-3"
                  >
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-1.5 gap-y-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach - full-width image with text */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <Link to="/services" className="block group">
            <div className="relative aspect-[16/10] md:aspect-[21/9] overflow-hidden bg-bg-dark">
              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=2400&q=80"
                alt="Our approach"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{ fontFamily: "var(--font-serif)" }}
                  className="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[80px] font-normal text-white leading-[0.95] tracking-[-0.02em] mb-6 md:mb-8 max-w-4xl"
                >
                  Growing Brands by <br />
                  <em>Redefining Strategy</em>.
                </motion.h2>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white"
                >
                  Our Approach
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Insights */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="border-t border-border pt-10 md:pt-14 mb-10 md:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
              <div className="md:col-span-3">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase"
                >
                  Insights
                </motion.p>
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ fontFamily: "var(--font-serif)" }}
                className="md:col-span-6 text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-normal text-text leading-[1.1] tracking-[-0.02em]"
              >
                The latest from <em>our world and beyond</em>.
              </motion.h2>
              <div className="md:col-span-3 md:justify-self-end">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text hover:text-text-muted transition-colors group"
                >
                  Explore All
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {insights.map((post, i) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden mb-4 md:mb-5 bg-bg-dark">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                </div>
                <h3
                  style={{ fontFamily: "var(--font-serif)" }}
                  className="text-xl md:text-2xl font-normal text-text leading-tight mb-3"
                >
                  {post.title}
                </h3>
                <div className="flex items-center gap-2.5 text-text-muted text-xs">
                  <span>{post.days}</span>
                  <span>·</span>
                  <span>{post.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
