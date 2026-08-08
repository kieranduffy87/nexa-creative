import { lazy, Suspense, useState } from "react";
import { ArrowIcon, Eyebrow } from "../components/ui";

// Lazy here too, or three gets pulled into the main bundle and the homepage
// pays for a route it never loads.
const HeroObject = lazy(() =>
  import("../components/HeroObject").then((m) => ({ default: m.HeroObject })),
);
const NexaGlassScene = lazy(() =>
  import("../components/NexaGlassScene").then((m) => ({
    default: m.NexaGlassScene,
  })),
);

/**
 * Not linked from the site. A scratch route for comparing hero treatments
 * live, at full size, before one gets committed to the homepage.
 */

const OBJECTS = [
  {
    id: "shards",
    kind: "mark",
    label: "Mark — shards",
    prefers: "dark",
    note: "The Nexa mark extruded from its real path data, copper-tinted, with angular glass fragments drifting around it on black.",
  },
  {
    id: "bouquet",
    kind: "mark",
    label: "Mark — bouquet",
    prefers: "dark",
    note: "Same mark, surrounded by curved glass lenses and clear spheres arranged radially. The busiest and most refractive of the three.",
  },
  {
    id: "stack",
    kind: "mark",
    label: "Mark — stack",
    prefers: "white",
    note: "Clear tiles laid flat and overlapping on white, one copper accent, mark reading through the middle. The calmest option.",
  },
  {
    id: "glass",
    kind: "form",
    label: "Abstract glass",
    prefers: "bone",
    note: "The earlier faceted form. Transmission, dispersion and red attenuation, no logo geometry.",
  },
  {
    id: "chrome",
    kind: "form",
    label: "Abstract chrome",
    prefers: "dark",
    note: "Fully metallic, near-zero roughness. The environment is the entire surface.",
  },
  {
    id: "mineral",
    kind: "form",
    label: "Abstract mineral",
    prefers: "bone",
    note: "Rough, faceted, barely metallic. Tactile rather than slick.",
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
  const [obj, setObj] = useState("shards");
  const [bg, setBg] = useState("dark");
  const [grain, setGrain] = useState(true);

  const object = OBJECTS.find((o) => o.id === obj);
  const backdrop = BACKDROPS.find((b) => b.id === bg);
  const onDark = backdrop.dark;

  // Picking an object snaps the backdrop to the one it was designed against
  const pickObject = (id) => {
    setObj(id);
    const next = OBJECTS.find((o) => o.id === id);
    if (next?.prefers) setBg(next.prefers);
  };

  return (
    <>
      {/* Live hero preview, using the real homepage layout */}
      <section
        className={`relative overflow-hidden ${backdrop.cls} ${
          grain ? "hero-grain" : ""
        } ${onDark ? "text-white" : ""}`}
      >
        {/* The mark scenes are full-bleed compositions, like the references.
            The abstract forms stay in their own column beside the type. */}
        <div
          className={`pointer-events-none absolute inset-0 z-0 ${
            object.kind === "mark" ? "" : "left-auto w-full lg:w-[52%]"
          }`}
        >
          <Suspense fallback={null}>
            {object.kind === "mark" ? (
              <NexaGlassScene variant={obj} className="h-full w-full" />
            ) : (
              <HeroObject variant={obj} dark={onDark} className="h-full w-full" />
            )}
          </Suspense>
        </div>

        {/* Legibility scrim — keeps the headline readable over the scene
            without flattening the composition behind it */}
        {object.kind === "mark" && (
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background: onDark
                ? "linear-gradient(100deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 34%, rgba(0,0,0,0) 62%)"
                : "linear-gradient(100deg, rgba(247,244,239,0.9) 0%, rgba(247,244,239,0.6) 34%, rgba(247,244,239,0) 62%)",
            }}
          />
        )}

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
                <Toggle
                  items={OBJECTS}
                  value={obj}
                  onChange={pickObject}
                />
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
                The hero above is live, not a screenshot — move the cursor across
                it and the whole assembly leans with you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
