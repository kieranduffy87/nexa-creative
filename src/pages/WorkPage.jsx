import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/PageHero";

const projects = [
  {
    slug: "whatsexposed",
    title: "WhatsExposed",
    tags: ["Brand Strategy", "Naming", "Brand Identity", "Logo System", "Guidelines", "Web"],
    image: "/projects/whatsexposed/landscape-light.svg",
    imageBg: "#0a0a0a",
    span: "md:col-span-7",
  },
  {
    title: "O'Brien Craft Brewery",
    tags: ["Brand Strategy", "Brand Identity", "Logo", "Guidelines", "E-commerce", "Web", "Engineering"],
    image: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=2000&q=80",
    span: "md:col-span-5",
  },
  {
    title: "Meridian Property Group",
    tags: ["Brand Strategy", "Naming", "Logo", "Digital Experience", "Web", "Engineering"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    span: "md:col-span-5",
  },
  {
    title: "Wild Atlantic Tours",
    tags: ["Brand Strategy", "Research", "Brand Identity", "Logo", "Guidelines", "Campaigns", "Motion & Video"],
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2400&q=80",
    span: "md:col-span-12",
  },
  {
    title: "Bloom Wellness Studio",
    tags: ["Brand Strategy", "Brand Identity", "Logo", "Social Media", "Content"],
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&q=80",
    span: "md:col-span-5",
  },
  {
    title: "TechVault Solutions",
    tags: ["Google Ads", "Meta Ads", "Analytics", "Conversion"],
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1800&q=80",
    span: "md:col-span-7",
  },
  {
    title: "Harbour Coffee Roasters",
    tags: ["Naming", "Research", "Brand Identity", "Logo", "Campaigns", "Packaging", "E-commerce"],
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1800&q=80",
    span: "md:col-span-7",
  },
  {
    title: "Solas Health Clinic",
    tags: ["Web Design", "AI SEO", "Content", "Engineering"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80",
    span: "md:col-span-5",
  },
  {
    title: "Greenway Architects",
    tags: ["Web Design", "SEO", "Photography", "Guidelines"],
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2400&q=80",
    span: "md:col-span-12",
  },
];

function ProjectCardInner({ project }) {
  return (
    <>
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
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

export default function WorkPage() {
  return (
    <>
      <PageHero
        tag="Case Studies"
        title={<><em>Work</em> created at moments where change becomes <em>inevitable</em> by design.</>}
        subtitle="A selection of work we're proud of — from brand launches to performance campaigns delivering real, measurable results."
      />

      {/* Projects grid */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="border-t border-border pt-10 md:pt-14">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-14 md:gap-y-20">
              {projects.map((project, i) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: (i % 2) * 0.1 }}
                  className={project.span}
                >
                  {project.slug ? (
                    <Link to={`/work/${project.slug}`} className="block group">
                      <ProjectCardInner project={project} />
                    </Link>
                  ) : (
                    <div className="block group cursor-pointer">
                      <ProjectCardInner project={project} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <Link to="/contact" className="block group">
            <div className="relative aspect-[16/10] md:aspect-[21/9] overflow-hidden bg-bg-dark">
              <img
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=2400&q=80"
                alt="Start a project"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
                <h2
                  style={{ fontFamily: "var(--font-serif)" }}
                  className="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[80px] font-normal text-white leading-[0.95] tracking-[-0.02em] mb-6 md:mb-8 max-w-4xl"
                >
                  Want results <br />
                  like <em>these</em>?
                </h2>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white">
                  Start a Project
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
