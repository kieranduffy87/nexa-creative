import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/PageHero";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "", service: "", budget: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", company: "", service: "", budget: "", message: "" });
    }, 5000);
  };

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      <PageHero
        tag="Contact"
        title={<>Let&apos;s start your next project.</>}
        subtitle="Ready to elevate your brand and grow your business? Get in touch and we'll get back to you within 24 hours."
      />

      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="border-t border-border pt-10 md:pt-14">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
              {/* Left - Contact info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-5"
              >
                <p className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase mb-8">
                  Get in Touch
                </p>

                <div className="space-y-10">
                  <div>
                    <h3 className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase mb-3">Email</h3>
                    <a
                      href="mailto:hello@nexacreative.ie"
                      className="text-2xl md:text-3xl text-text hover:text-text-muted transition-colors"
                    >
                      hello@nexacreative.ie
                    </a>
                  </div>

                  <div>
                    <h3 className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase mb-3">Phone</h3>
                    <a
                      href="tel:+353123456789"
                      className="text-2xl md:text-3xl text-text hover:text-text-muted transition-colors"
                    >
                      +353 1 234 5678
                    </a>
                  </div>

                  <div>
                    <h3 className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase mb-3">Visit</h3>
                    <p
                      className="text-2xl md:text-3xl text-text leading-tight mb-2"
                    >
                      Dublin 2,<br />
                      Ireland
                    </p>
                    <a
                      href="https://maps.google.com/?q=Dublin+Ireland"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-text-muted hover:text-text transition-colors text-sm"
                    >
                      Google Maps <ArrowUpRight size={12} />
                    </a>
                  </div>

                  <div>
                    <h3 className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase mb-3">Hours</h3>
                    <p
                      className="text-2xl md:text-3xl text-text leading-tight"
                    >
                      Mon to Fri<br />
                      9am to 6pm
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Right - Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="md:col-span-7"
              >
                <p className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase mb-8">
                  Project Brief
                </p>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                    <div>
                      <label className="text-text-muted text-xs font-medium tracking-[0.08em] uppercase block mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="w-full bg-transparent border-b border-border py-2.5 text-base text-text outline-none focus:border-text transition-colors placeholder-text-light"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-text-muted text-xs font-medium tracking-[0.08em] uppercase block mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="w-full bg-transparent border-b border-border py-2.5 text-base text-text outline-none focus:border-text transition-colors placeholder-text-light"
                        placeholder="you@company.com"
                      />
                    </div>
                    <div>
                      <label className="text-text-muted text-xs font-medium tracking-[0.08em] uppercase block mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="w-full bg-transparent border-b border-border py-2.5 text-base text-text outline-none focus:border-text transition-colors placeholder-text-light"
                        placeholder="+353..."
                      />
                    </div>
                    <div>
                      <label className="text-text-muted text-xs font-medium tracking-[0.08em] uppercase block mb-2">Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => update("company", e.target.value)}
                        className="w-full bg-transparent border-b border-border py-2.5 text-base text-text outline-none focus:border-text transition-colors placeholder-text-light"
                        placeholder="Your company"
                      />
                    </div>
                    <div>
                      <label className="text-text-muted text-xs font-medium tracking-[0.08em] uppercase block mb-2">Service</label>
                      <select
                        value={formData.service}
                        onChange={(e) => update("service", e.target.value)}
                        className="w-full bg-transparent border-b border-border py-2.5 text-base text-text outline-none focus:border-text transition-colors cursor-pointer"
                      >
                        <option value="">Select a service</option>
                        <option value="branding">Branding & Identity</option>
                        <option value="web">Web Design & Development</option>
                        <option value="maintenance">Website Maintenance</option>
                        <option value="seo">SEO</option>
                        <option value="ai-seo">AI-Powered SEO</option>
                        <option value="google-ads">Google Ads</option>
                        <option value="meta-ads">Meta Ads</option>
                        <option value="social">Social Media Marketing</option>
                        <option value="video">Video Production</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-text-muted text-xs font-medium tracking-[0.08em] uppercase block mb-2">Budget</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => update("budget", e.target.value)}
                        className="w-full bg-transparent border-b border-border py-2.5 text-base text-text outline-none focus:border-text transition-colors cursor-pointer"
                      >
                        <option value="">Select budget</option>
                        <option value="under-2k">Under €2,000</option>
                        <option value="2k-5k">€2,000 to €5,000</option>
                        <option value="5k-10k">€5,000 to €10,000</option>
                        <option value="10k-25k">€10,000 to €25,000</option>
                        <option value="25k+">€25,000+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-text-muted text-xs font-medium tracking-[0.08em] uppercase block mb-2">Tell us about your project *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => update("message", e.target.value)}
                      className="w-full bg-transparent border-b border-border py-2.5 text-base text-text outline-none focus:border-text transition-colors resize-none placeholder-text-light"
                      placeholder="What are your goals? What challenges are you facing?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitted}
                    className="inline-flex items-center gap-2 text-[13px] font-medium text-text hover:text-text-muted transition-colors group disabled:opacity-60 mt-4 cursor-pointer"
                  >
                    {submitted ? "Message Sent! We'll be in touch soon." : (
                      <>
                        Send Message
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
