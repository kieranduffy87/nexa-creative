import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/PageHero";

const services = [
  {
    number: "01",
    title: "Branding & Identity",
    description: "Logo design, brand strategy, and visual identity systems that make your business unforgettable.",
    features: ["Logo & visual identity", "Brand strategy & positioning", "Brand guidelines", "Packaging & collateral"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=1600&q=80",
  },
  {
    number: "02",
    title: "Web Design & Development",
    description: "Stunning, responsive websites built for performance, accessibility, and conversion.",
    features: ["Custom website design", "Responsive development", "E-commerce solutions", "CMS integration"],
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1600&q=80",
  },
  {
    number: "03",
    title: "Website Maintenance",
    description: "Ongoing support, updates, security monitoring, and performance optimisation.",
    features: ["Security updates", "Performance optimisation", "Content updates", "Uptime monitoring"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
  },
  {
    number: "04",
    title: "SEO",
    description: "Data-driven search engine optimisation to boost your rankings and organic traffic.",
    features: ["Technical SEO audits", "On-page & off-page SEO", "Keyword research", "Monthly reporting"],
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1600&q=80",
  },
  {
    number: "05",
    title: "AI-Powered SEO",
    description: "Next-gen AI tools and strategies to stay ahead of search algorithm changes.",
    features: ["AI content optimisation", "Predictive analysis", "Automated tracking", "Competitor analysis"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",
  },
  {
    number: "06",
    title: "Google Ads",
    description: "High-ROI Google Ads campaigns with precise targeting and continuous optimisation.",
    features: ["Search & display", "Shopping & PMax", "Conversion tracking", "A/B testing"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
  },
  {
    number: "07",
    title: "Meta Ads",
    description: "Facebook and Instagram advertising that reaches the right audience and drives results.",
    features: ["Campaign strategy", "Audience targeting", "Creative production", "Funnel optimisation"],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1600&q=80",
  },
  {
    number: "08",
    title: "Social Media Marketing",
    description: "Content strategy, community management, and campaigns that build engagement.",
    features: ["Content calendar", "Community management", "Influencer partnerships", "Analytics"],
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1600&q=80",
  },
  {
    number: "09",
    title: "Video Production",
    description: "Professional video content for social, web, and advertising that tells your story.",
    features: ["Brand & promo videos", "Social content", "Testimonials", "Motion graphics"],
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&q=80",
  },
];

const process = [
  { step: "01", title: "Discovery & Strategy", desc: "We understand your business, goals, audience, and competitors to craft a tailored strategy." },
  { step: "02", title: "Design & Create", desc: "Our creative team designs and builds your brand assets, website, or campaign with precision." },
  { step: "03", title: "Launch & Optimise", desc: "We launch your project and continuously monitor, test, and optimise for maximum performance." },
  { step: "04", title: "Report & Grow", desc: "Regular reporting and strategic recommendations to keep your business growing month after month." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        tag="Our Services"
        title={<>Everything you need to <em>grow online</em>.</>}
        subtitle="From brand strategy to performance marketing, we offer a full suite of digital services to help your business thrive."
      />

      {/* Services list - editorial layout */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="border-t border-border">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="border-b border-border py-10 md:py-16 group"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                  <div className="md:col-span-1">
                    <span className="text-text-muted text-xs font-medium tracking-[0.12em]">
                      {service.number}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h3
                      style={{ fontFamily: "var(--font-serif)" }}
                      className="text-3xl md:text-4xl lg:text-5xl font-normal text-text leading-[1.05] tracking-[-0.02em]"
                    >
                      {service.title}
                    </h3>
                  </div>
                  <div className="md:col-span-4">
                    <p className="text-text-muted text-sm md:text-base leading-relaxed mb-5">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((f) => (
                        <li key={f} className="text-text text-sm flex items-center gap-2.5">
                          <span className="w-1 h-1 rounded-full bg-nexa-red shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:col-span-3">
                    <div className="aspect-[4/3] overflow-hidden bg-bg-dark">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="border-t border-border pt-10 md:pt-14 mb-10 md:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
              <div className="md:col-span-3">
                <p className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase">
                  Our Process
                </p>
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ fontFamily: "var(--font-serif)" }}
                className="md:col-span-9 text-[32px] sm:text-[44px] md:text-[56px] lg:text-[68px] font-normal text-text leading-[1.05] tracking-[-0.02em]"
              >
                How we <em>work</em>.
              </motion.h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
            {process.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border-t border-border pt-6"
              >
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-text-muted text-xs font-medium tracking-[0.12em]">{item.step}</span>
                  <h3
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-2xl md:text-3xl font-normal text-text"
                  >
                    {item.title}
                  </h3>
                </div>
                <p className="text-text-muted text-sm md:text-base leading-relaxed">{item.desc}</p>
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
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=2400&q=80"
                alt="Get started"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
                <h2
                  style={{ fontFamily: "var(--font-serif)" }}
                  className="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[80px] font-normal text-white leading-[0.95] tracking-[-0.02em] mb-6 md:mb-8 max-w-4xl"
                >
                  Let's find the right <br />
                  <em>solution</em>.
                </h2>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white">
                  Get a Free Consultation
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
