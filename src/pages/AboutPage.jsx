import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/PageHero";

const stats = [
  { value: "150+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "8+", label: "Years Experience" },
  { value: "100%", label: "Irish Owned" },
];

const values = [
  { number: "01", title: "Results-Driven", description: "Every decision is backed by data and aimed at delivering measurable outcomes." },
  { number: "02", title: "Creative Excellence", description: "We push creative boundaries while staying true to your brand." },
  { number: "03", title: "Transparent Partnership", description: "No jargon, no hidden costs. Honest communication and true partnership." },
  { number: "04", title: "Continuous Growth", description: "We don't just launch and leave. We optimise, iterate, and evolve." },
];

const team = [
  { name: "Kieran Duffy", role: "Creative Director", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
  { name: "Aoife Murphy", role: "Lead Designer", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80" },
  { name: "Ciaran Walsh", role: "Head of Development", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80" },
  { name: "Siobhan Kelly", role: "Marketing Strategist", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        tag="About Us"
        title={<>A creative agency with a <em>digital-first</em> mindset.</>}
        subtitle="We partner with ambitious businesses to create powerful brand identities, build high-performance websites, and run digital campaigns that deliver."
      />

      {/* Story */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="border-t border-border pt-10 md:pt-14">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mb-12 md:mb-20">
              <div className="md:col-span-3">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase"
                >
                  Our Story
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-9 space-y-6 text-text text-lg md:text-xl leading-relaxed max-w-3xl"
              >
                <p>
                  Nexa Creative was founded with a simple belief: that Irish businesses
                  deserve world-class digital experiences. Based in Dublin, we&apos;ve
                  grown from a small design studio into a full-service creative agency
                  serving clients across Ireland and beyond.
                </p>
                <p>
                  Our team combines creative design thinking with deep technical
                  expertise and data-driven marketing strategy. We don&apos;t just make
                  things look good — we make them work.
                </p>
              </motion.div>
            </div>

            {/* Big image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="aspect-[21/9] overflow-hidden bg-bg-dark mb-16 md:mb-24"
            >
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=2400&q=80"
                alt="Our studio"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 border-t border-border pt-10 md:pt-14">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <div
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-4xl md:text-5xl lg:text-6xl font-normal text-text mb-2 tracking-[-0.02em]"
                  >
                    {stat.value}
                  </div>
                  <div className="text-text-muted text-xs md:text-sm font-medium tracking-wide uppercase">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="border-t border-border pt-10 md:pt-14 mb-12 md:mb-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
              <div className="md:col-span-3">
                <p className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase">
                  Our Values
                </p>
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ fontFamily: "var(--font-serif)" }}
                className="md:col-span-9 text-[32px] sm:text-[44px] md:text-[56px] lg:text-[68px] font-normal text-text leading-[1.05] tracking-[-0.02em]"
              >
                What <em>drives</em> us.
              </motion.h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border-t border-border pt-6"
              >
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-text-muted text-xs font-medium tracking-[0.12em]">{v.number}</span>
                  <h3
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-2xl md:text-3xl font-normal text-text"
                  >
                    {v.title}
                  </h3>
                </div>
                <p className="text-text-muted text-sm md:text-base leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="border-t border-border pt-10 md:pt-14 mb-12 md:mb-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
              <div className="md:col-span-3">
                <p className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase">
                  The Team
                </p>
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ fontFamily: "var(--font-serif)" }}
                className="md:col-span-9 text-[32px] sm:text-[44px] md:text-[56px] lg:text-[68px] font-normal text-text leading-[1.05] tracking-[-0.02em]"
              >
                The people behind <em>Nexa</em>.
              </motion.h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group"
              >
                <div className="aspect-[3/4] overflow-hidden mb-4 bg-bg-dark">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                  />
                </div>
                <h3
                  style={{ fontFamily: "var(--font-serif)" }}
                  className="text-xl md:text-2xl font-normal text-text mb-1"
                >
                  {member.name}
                </h3>
                <p className="text-text-muted text-xs md:text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <Link to="/contact" className="block group">
            <div className="relative aspect-[16/10] md:aspect-[21/9] overflow-hidden bg-bg-dark">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=2400&q=80"
                alt="Work together"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
                <h2
                  style={{ fontFamily: "var(--font-serif)" }}
                  className="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[80px] font-normal text-white leading-[0.95] tracking-[-0.02em] mb-6 md:mb-8 max-w-4xl"
                >
                  Let's work <br />
                  <em>together</em>.
                </h2>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white">
                  Get in Touch
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
