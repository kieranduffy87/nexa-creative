export function PageHero({ tag, title, subtitle }) {
  return (
    <section className="relative pt-32 md:pt-44 pb-16 md:pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        {tag && (
          <p className="text-text-muted text-xs font-medium tracking-[0.12em] uppercase mb-8">
            {tag}
          </p>
        )}
        <h1
          style={{ fontFamily: "var(--font-serif)" }}
          className="text-[44px] sm:text-[64px] md:text-[88px] lg:text-[112px] font-normal text-text leading-[0.95] tracking-[-0.02em] mb-8 max-w-[1100px]"
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-text-muted text-base md:text-lg max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
