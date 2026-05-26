export const projects = {
  whatsexposed: {
    slug: "whatsexposed",
    client: "WhatsExposed",
    title: "Brand Identity for a Modern Data Transparency Platform",
    summary:
      "WhatsExposed is a privacy intelligence platform helping individuals and organizations understand their digital exposure. We partnered with the team to define a brand that feels both authoritative and approachable — clinical enough for security professionals, friendly enough for everyday users.",
    year: "2026",
    sector: "Technology · Cyber Security",
    services: ["Brand Strategy", "Naming", "Brand Identity", "Logo System", "Brand Guidelines", "Web"],
    deliverables: ["Logo system", "Typography", "Colour", "Guidelines", "Web design"],
    team: ["Kieran Duffy", "Aoife Murphy", "Ciaran Walsh"],
    partners: ["WhatsExposed Founders"],
    heroBg: "#0a0a0a",
    accent: "#ef4136",
    hero: "/projects/whatsexposed/landscape-light.svg",
    sections: [
      {
        type: "overview",
        label: "Overview",
        body: [
          "WhatsExposed is built on a simple but powerful idea — people deserve to know what the internet knows about them. The product surfaces leaked credentials, exposed personal data, and breach history in one calm, confident interface.",
          "Our role was to build the visual and verbal system that could carry that mission. We crafted a brandmark, a wordmark, a stacked lockup, and an industry variant designed to flex across product UI, marketing, and partner contexts.",
        ],
      },
      {
        type: "image-full",
        src: "/projects/whatsexposed/landscape-light.svg",
        bg: "#0a0a0a",
        innerBg: "#0a0a0a",
        caption: "Primary landscape lockup on dark.",
      },
      {
        type: "image-grid",
        bg: "#f5f5f5",
        items: [
          { src: "/projects/whatsexposed/brandmark.svg", label: "Brandmark", bg: "#fff" },
          { src: "/projects/whatsexposed/stacked.svg", label: "Stacked", bg: "#fff" },
        ],
      },
      {
        type: "text-block",
        label: "Identity",
        heading: "A mark that signals protection without alarm.",
        body: [
          "The brandmark fuses an eye and a shield into a single geometric form. It reads as observant, intentional, and quietly authoritative — the brand equivalent of someone watching your back.",
          "We paired the mark with a confident geometric wordmark, drawing on a contemporary sans serif weighted toward readability at small UI sizes.",
        ],
      },
      {
        type: "image-full",
        src: "/projects/whatsexposed/industry-light.svg",
        bg: "#0a0a0a",
        innerBg: "#0a0a0a",
        caption: "Industry lockup for partner and integration contexts.",
      },
      {
        type: "image-grid",
        bg: "#0a0a0a",
        items: [
          { src: "/projects/whatsexposed/brandmark-light.svg", label: "Brandmark · Light", bg: "#1a1a1a" },
          { src: "/projects/whatsexposed/stacked-light.svg", label: "Stacked · Light", bg: "#1a1a1a" },
        ],
      },
      {
        type: "text-block",
        label: "System",
        heading: "Built to scale across product, marketing, and security contexts.",
        body: [
          "Every lockup was drawn in vector and shipped in SVG, PDF, and raster formats from 1.5× through 20× to cover everything from a 16px favicon to a 4m trade stand.",
          "Light and dark variants were considered as first-class citizens — the system never compromises legibility against a hero image, a dashboard panel, or a security report header.",
        ],
      },
      {
        type: "cta",
        label: "Download",
        heading: "Want to see the full guidelines?",
        body: "We've published the full brand guidelines as a downloadable PDF — colour, typography, lockup geometry, and usage rules.",
        href: "/projects/whatsexposed/brand-guides.pdf",
        cta: "Download brand guides",
      },
    ],
  },
};

export const projectList = Object.values(projects);
