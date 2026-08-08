import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { asset } from "../lib/asset";

const values = [
  { number: "01", title: "Results-Driven", description: "Every decision is backed by data and aimed at delivering measurable outcomes." },
  { number: "02", title: "Creative Excellence", description: "We push creative boundaries while staying true to your brand." },
  { number: "03", title: "Transparent Partnership", description: "No jargon, no hidden costs. Honest communication and true partnership." },
  { number: "04", title: "Continuous Growth", description: "We don't just launch and leave. We optimise, iterate, and evolve." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        tag="About Us"
        title={<>A creative agency with a digital-first mindset.</>}
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
                  things look good. We make them work.
                </p>
              </motion.div>
            </div>

            {/* Big image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="aspect-[21/9] overflow-hidden bg-ink mb-16 md:mb-24"
            >
              <img
                src={asset("projects/whatsexposed/we-conference.jpg")}
                alt="Our studio"
                className="w-full h-full object-cover"
              />
            </motion.div>

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
                className="md:col-span-9 text-[32px] sm:text-[44px] md:text-[56px] lg:text-[68px] font-medium text-text leading-[1.05] tracking-[-0.05em]"
              >
                What drives us.
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
                    className="text-2xl md:text-3xl font-medium text-text"
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


      {/* CTA */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <Link to="/contact" className="block group">
            <div className="relative aspect-[16/10] md:aspect-[21/9] overflow-hidden bg-ink">
              <img
                src={asset("projects/quinnit/qi-server.jpg")}
                alt="Work together"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
                <h2
                  className="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[80px] font-medium text-white leading-[0.95] tracking-[-0.05em] mb-6 md:mb-8 max-w-4xl"
                >
                  Let's work <br />
                  together.
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
