import { lazy, Suspense, useState } from "react";
import { ArrowIcon, Eyebrow } from "../components/ui";

// Lazy here too, or three gets pulled into the main bundle and the homepage
// pays for a route it never loads.
const HeroObject = lazy(() =>
  import("../components/HeroObject").then((m) => ({ default: m.HeroObject })),
);

/**
 * Not linked from the site. A scratch route for comparing hero treatments
 * live, at full size, before one gets committed to the homepage.
 */

const OBJECTS = [
  {
    id: "glass",
    label: "Glass",
    note: "Transmission, dispersion and red attenuation. Light bends through it and splits at the facet edges.",
  },
  {
    id: "chrome",
    label: "Liquid chrome",
    note: "Fully metallic, near-zero roughness. The environment is the entire surface, so it reads as polished metal.",
  },
  {
    id: "mineral",
    label: "Weathered mineral",
    note: "Rough, faceted, barely metallic. Closest to the rock on your reference site — tactile rather than slick.",
  },
];

const BACKDROPS = [
  { id: "bone", label: "Bone gradient", cls: "hero-bg-bone", dark: false },
  { id: "white", label: "White + drift", cls: "hero-bg-white", dark: false },
  { id: "dark", label: "Near-black", cls: "hero-bg-dark", dark: true },
];

function Toggle({ items, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={() => onChange(it.id)}
          className={`rounded-pill px-4 py-2 text-[13px] font-medium tracking-[-0.02em] transition-colors ${
            value === it.id
              ? "bg-ink text-white"
              : "bg-black/[0.05] text-text-muted hover:bg-black/10"
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export default function HeroLabPage() {
  const [obj, setObj] = useState("glass");
  const [bg, setBg] = useState("bone");
  const [grain, setGrain] = useState(true);

  const backdrop = BACKDROPS.find((b) => b.id === bg);
  const object = OBJECTS.find((o) => o.id === obj);
  const onDark = backdrop.dark;

  return (
    <>
      {/* Live hero preview, using the real homepage layout */}
      <section
        className={`relative overflow-hidden ${backdrop.cls} ${
          grain ? "hero-grain" : ""
        } ${onDark ? "text-white" : ""}`}
      >
        {/* Full opacity at every width — this is a lab, not the real layout */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full lg:w-[46%]">
          <Suspense fallback={null}>
            <HeroObject variant={obj} dark={onDark} className="h-full w-full" />
          </Suspense>
        </div>

        <div className="shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-16 pt-36 md:pb-20">
          <h1 className="t-display max-w-[46rem] text-balance">
            Brand and digital design
            <br className="hidden sm:block" /> that earns attention.
          </h1>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="btn-pill btn-pill-accent">
              <span>Start a project</span>
              <span className="arrow-dot">
                <ArrowIcon />
              </span>
            </span>
            <span className={`btn-pill ${onDark ? "!bg-white/10 !text-white" : ""}`}>
              <span>See the work</span>
              <span className="arrow-dot">
                <ArrowIcon />
              </span>
            </span>
          </div>

          <div
            className={`mt-14 max-w-md border-t pt-5 ${
              onDark ? "border-white/15" : "border-border"
            }`}
          >
            <p className={`t-body ${onDark ? "!text-white/55" : ""}`}>
              A Dublin studio building identities, websites and motion for
              companies that need to be taken seriously.
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="section-y">
        <div className="shell">
          <div className="hairline mb-4" />
          <Eyebrow>Hero lab</Eyebrow>

          <h2 className="t-h1 mt-8 max-w-3xl text-balance">
            Pick a combination, then I will commit it to the homepage.
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-7">
              <p className="t-eyebrow">Object</p>
              <div className="mt-4">
                <Toggle items={OBJECTS} value={obj} onChange={setObj} />
              </div>
              <p className="t-body mt-4 max-w-md">{object.note}</p>

              <p className="t-eyebrow mt-10">Backdrop</p>
              <div className="mt-4">
                <Toggle items={BACKDROPS} value={bg} onChange={setBg} />
              </div>

              <p className="t-eyebrow mt-10">Film grain</p>
              <div className="mt-4">
                <Toggle
                  items={[
                    { id: "on", label: "On" },
                    { id: "off", label: "Off" },
                  ]}
                  value={grain ? "on" : "off"}
                  onChange={(v) => setGrain(v === "on")}
                />
              </div>
            </div>

            <div className="md:col-span-4 md:col-start-9">
              <p className="t-eyebrow">Currently showing</p>
              <dl className="mt-4 divide-y divide-border border-y border-border">
                {[
                  ["Object", object.label],
                  ["Backdrop", backdrop.label],
                  ["Grain", grain ? "On" : "Off"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-6 py-4"
                  >
                    <dt className="t-eyebrow">{k}</dt>
                    <dd className="text-[15px] tracking-[-0.02em]">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="t-body mt-6">
                Scroll back up after each change — the hero above is live, not a
                screenshot.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
