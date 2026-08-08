import { asset } from "../lib/asset";

const we = (f) => asset(`projects/whatsexposed/${f}`);
const qi = (f) => asset(`projects/quinnit/${f}`);
const gk = (f) => asset(`projects/gallagher/${f}`);

export const projects = [
  {
    slug: "whatsexposed",
    name: "WhatsExposed",
    tagline: "From exposure to resolution",
    year: "2026",
    client: "WhatsExposed",
    sector: "Cybersecurity",
    tags: ["Brand Identity", "Digital Design", "Campaign"],
    accent: "#1a1048",

    // Card + hero media
    thumb: we("we-overview.jpg"),
    heroVideo: we("we-hero.mp4"),
    heroPoster: we("we-overview.jpg"),

    summary:
      "WhatsExposed is a cybersecurity company built on a simple promise: find what is exposed, then help fix it. We built the brand from the ground up: the mark and wordmark, the full identity toolkit and guidelines, the website, the campaign platform, and every piece of print, event and social material the company goes to market with.",

    scope: [
      "Brand Strategy",
      "Brand Identity",
      "Brand Guidelines",
      "Brand Toolkit",
      "Web Design & Development",
      "Motion",
      "Campaign",
      "Print & Exhibition",
      "Social Media",
    ],

    sections: [
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: we("we-core.jpg") },
          { kind: "image", src: we("we-grid-1.jpg") },
        ],
      },
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: we("we-grid-2.jpg") },
          { kind: "image", src: we("we-type-colour.jpg") },
        ],
      },
      {
        type: "media",
        kind: "video",
        src: we("we-3dlogo.mp4"),
        width: "wide",
        bg: "#1a1048",
        caption: "The mark rendered in three dimensions, gradient running alarm to calm.",
      },
      {
        type: "media",
        kind: "image",
        src: we("we-appicon-phone.jpg"),
        width: "wide",
      },
      {
        type: "text",
        title: "A W that moves",
        body: [
          "The brandmark is a W built from flowing forms rather than drawn letters, because the subject is data in motion. It reads as a monogram at a glance and as a current when you look closer, which gives a security company something rare in the category: a mark that suggests movement instead of padlocks and shields.",
          "The gradient carries the argument. Colour runs from alarm to calm across the mark, so the identity states the proposition before a single word is read. Exposure resolved, threat turned into a secure environment.",
        ],
      },
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: we("we-billboard.jpg") },
          { kind: "image", src: we("we-poster.jpg") },
        ],
      },
      {
        type: "text",
        title: "Built for the floor",
        body: [
          "Cybersecurity is sold in person, at expos and summits, so the brand had to survive a trade floor. We designed the event system around the same idea as the identity: one strong image, one plain sentence, no clutter.",
          "The campaign line the stand leads with came from that principle: real-time findings, not PDFs. The supporting line explains that clients see criticals as they are discovered and start fixing before the engagement ends. It is a positioning argument compressed into a sentence a passer-by can read in three seconds, and it works at stage scale, on a billboard, and cropped into a social post.",
        ],
      },
      {
        type: "media",
        kind: "image",
        src: we("we-conference.jpg"),
        width: "full",
      },
      {
        type: "text",
        title: "Print, stationery and the physical estate",
        body: [
          "The identity extends into a full print estate: stationery, presentation folders, data sheets, posters, exhibition graphics and large-format outdoor. Each format uses the same three ingredients in different proportions: the gradient field, one portrait, and one line of plain speech.",
          "Working across so many pieces is where a guideline earns its keep. Because construction, clearspace, colour roles and typography are all fixed, new collateral gets produced quickly and still looks like it came from the same company.",
        ],
      },
      {
        type: "media-grid",
        cols: 3,
        items: [
          { kind: "image", src: we("we-stationery-1.jpg") },
          { kind: "image", src: we("we-stationery-2.jpg") },
          { kind: "image", src: we("we-folder.jpg") },
        ],
      },
      {
        type: "text",
        title: "One brand, four lockups",
        body: [
          "Security brands live in awkward spaces: a square avatar, a sponsor wall, an event backdrop, a partner footer. Rather than force one lockup everywhere, we built four. A core horizontal lockup for general use, a stacked version for square and small formats, a variant carrying the industry descriptor for moments when the logo appears with no supporting context, and a mono set for single-colour print.",
          "Every variant is drawn on the same construction grid, with clearspace measured in multiples of the mark itself, so the system scales without anyone needing to redraw it. The guidelines set minimum sizes for screen and print, and show the misuse cases explicitly, because that is where brands usually come apart once they leave the designer.",
        ],
      },
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: we("we-appicon.jpg") },
          { kind: "image", src: we("we-social.jpg") },
        ],
      },
      {
        type: "text",
        title: "Colour that argues the case",
        body: [
          "The palette is a graduated core of red, teal, yellow and purple, anchored by a deep navy and white. The gradient is the brand's primary expression and the solids do the structural work: navy for ground and confidence, white for clarity, the core colours for emphasis and calls to action.",
          "That split keeps a wide, energetic palette from turning noisy. Gradients carry emotion and movement, solids carry hierarchy, and the pattern and secondary graphic system stays deliberately supporting. The rule written into the guidelines is that decoration never competes with the message.",
        ],
      },
      {
        type: "media",
        kind: "video",
        src: we("we-social-motion.mp4"),
        width: "wide",
        bg: "#1a1048",
      },
      {
        type: "text",
        title: "Social, product and the digital estate",
        body: [
          "Social is where the tone is tested most often, so the templates are built to be filled fast without drifting. Motion carries the gradient across post formats, and the brandmark frames imagery the same way it does on the website.",
          "The system also covers the product end: app iconography, Teams backgrounds, presentation decks and sales collateral. From an avatar to an exhibition wall, it is recognisably one company.",
        ],
      },
      {
        type: "media",
        kind: "video",
        src: we("we-web-motion.mp4"),
        width: "wide",
        bg: "#1a1048",
      },
      {
        type: "text",
        title: "A website that speaks plainly",
        body: [
          "The brand voice is defined as clear, confident and informative, with technical jargon avoided on purpose. That is easy to write into a guideline and hard to hold to in cybersecurity, so we designed the website to make plain speech the path of least resistance: short declarative headlines, generous space, and the brandmark used as a viewfinder framing imagery rather than decoration sitting beside it.",
          "The result is a site that explains a technical service to a business audience without the usual wall of acronyms, while still looking like it belongs in a serious security category.",
        ],
      },
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: we("we-web-1.jpg") },
          { kind: "image", src: we("we-web-2.jpg") },
        ],
      },
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: we("we-banner.jpg") },
          { kind: "image", src: we("we-lanyard.jpg") },
        ],
      },
    ],

    process: [
      {
        title: "Positioning",
        body: "Defining a security brand around resolution rather than fear: what is exposed, and how it gets fixed.",
      },
      {
        title: "Brandmark & wordmark",
        body: "A W drawn as flowing data, paired with a bespoke wordmark and built on one construction grid.",
      },
      {
        title: "Identity toolkit",
        body: "Four lockups, clearspace and sizing rules, colour roles, typography and a secondary graphic system.",
      },
      {
        title: "Digital platform",
        body: "A website written in plain speech, with the mark used as a viewfinder for imagery.",
      },
      {
        title: "Go to market",
        body: "Campaign platform, exhibition and event graphics, print estate, social templates and sales collateral.",
      },
    ],

    decisions: [
      {
        title: "Movement instead of padlocks",
        body: "The category defaults to shields, locks and warning red. We built the mark from flowing forms instead, because the product is about data in motion and about resolution, not alarm. It is a harder sell in a first presentation and a much stronger position to own over time, since almost nothing else in the sector looks like it.",
      },
      {
        title: "The gradient carries the proposition",
        body: "Rather than treat colour as decoration, we made the gradient do the arguing: it travels from alarm to calm across the mark, so the transition from exposure to secure environment is stated visually before anyone reads a word. The trade-off is a demanding palette, which is why the guidelines give gradients the emotional work and solid navy and white the structural work.",
      },
      {
        title: "Plain speech as a design constraint",
        body: "The brand voice bans jargon, so the layouts had to make that easy to obey. Short headline slots, generous space and one image per message mean there is nowhere for a wall of acronyms to hide. The campaign line, real-time findings rather than PDFs, is the clearest test of it: a technical differentiator stated in a sentence a stranger can read from across a trade floor.",
      },
    ],

    palette: [
      { name: "Navy", hex: "#1a1048" },
      { name: "Teal", hex: "#53c3c3" },
      { name: "Purple", hex: "#6b3e98" },
      { name: "Red", hex: "#ee242a" },
      { name: "Yellow", hex: "#f2e901" },
      { name: "White", hex: "#ffffff" },
    ],

    principles: [
      { name: "Flow", body: "data in motion, not padlocks" },
      { name: "Transition", body: "exposure resolved, alarm to calm" },
      { name: "Plain speech", body: "clarity over jargon" },
    ],
  },

  {
    slug: "quinn-it",
    name: "Quinn IT",
    tagline: "Technology that keeps working",
    year: "2026",
    client: "Quinn IT",
    sector: "Technology & Managed Services",
    tags: ["Brand Identity", "3D & Motion", "Livery"],
    accent: "#3200e8",

    thumb: qi("qi-widescreen.jpg"),
    heroVideo: qi("qi-3dlayers-logo.mp4"),
    heroPoster: qi("qi-3dlayers.jpg"),

    summary:
      "Quinn IT is a technology and digital services company: managed IT, managed security, and compliance work for businesses that cannot afford downtime. We built the brand from the mark up: a geometric identity in vibrant blue that holds together across 3D, motion, vehicle livery and the uniform the engineers actually turn up in.",

    scope: [
      "Brand Strategy",
      "Brand Identity",
      "Brand Guidelines",
      "3D & Motion",
      "Web Design & Development",
      "Vehicle Livery",
      "Print & Signage",
      "Photography Direction",
      "Social Media",
    ],

    sections: [
      {
        type: "media",
        kind: "image",
        src: qi("qi-widescreen.jpg"),
        width: "full",
      },
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: qi("qi-grid-1.jpg") },
          { kind: "image", src: qi("qi-grid-2.jpg") },
        ],
      },
      {
        type: "text",
        title: "A mark you can turn",
        body: [
          "The mark is a Q built from interlocking planes rather than drawn as a letter. Read flat it is a monogram; read in three dimensions it becomes an object with depth, edges and a light source, which is what lets it live as a rotating 3D form without ever being redrawn.",
          "Construction is geometric throughout. The mark and the wordmark are both set out on the same grid, so proportions, angles and optical spacing hold at any size, from a browser tab to the side of a van.",
        ],
      },
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: qi("qi-colours.jpg") },
          { kind: "image", src: qi("qi-type.jpg") },
        ],
      },
      {
        type: "text",
        title: "Vibrant blue, cut with lime",
        body: [
          "The palette runs on one dominant colour: a vibrant blue that is deliberately more saturated than the corporate blues the IT sector defaults to. Black and grey do the structural work, and a vibrant lime provides the accent that stops the whole thing reading as another blue technology brand.",
          "Lime is rationed on purpose. It appears as an edge, a highlight or a single call to action rather than a second brand colour, which keeps the blue dominant and makes the accent mean something when it does appear.",
          "Typography follows the same rule as the mark. Bifftron is squared and technical, drawn from straight cuts and right angles rather than curves, so headline type sits on the same geometry as the logo instead of arguing with it.",
        ],
      },
      {
        type: "media",
        kind: "video",
        src: qi("qi-animation.mp4"),
        width: "full",
        bg: "#050505",
      },
      {
        type: "media",
        kind: "image",
        src: qi("qi-blocks.jpg"),
        width: "wide",
      },
      {
        type: "text",
        title: "Motion as proof of depth",
        body: [
          "Because the mark was constructed as an object rather than a flat shape, it could be rendered as glass and turned in light. Refraction picks up the blue and throws the lime through it, so the animation demonstrates the brand's own palette rather than decorating with it.",
          "The same asset covers a lot of ground: a loading state, a screen-filling moment on a stand, a social sting, or the last frame of a video. One build, used everywhere motion is needed.",
          "Pulled in close, the same forms stop reading as a logo and start reading as material: blue glass with lime caught in the bevels. That gives the brand an abstract layer it can use as background and art direction, drawn from its own geometry rather than a stock gradient.",
        ],
      },
      {
        type: "media",
        kind: "image",
        src: qi("qi-van-1.jpg"),
        width: "full",
      },
      {
        type: "media-grid",
        cols: 3,
        items: [
          { kind: "image", src: qi("qi-van-2.jpg") },
          { kind: "image", src: qi("qi-wallsign.jpg") },
          { kind: "image", src: qi("qi-office.jpg") },
        ],
      },
      {
        type: "text",
        title: "A brand that arrives in a van",
        body: [
          "For a field IT company the fleet is the most-seen piece of the identity, so the livery was designed as a considered application rather than a logo stuck on a door. The mark is used large and cropped, letting the geometry read as pattern at distance while the wordmark and web address stay legible up close.",
          "It is drawn to work across vehicle sizes, from a full transit panel to a small van, without redrawing the artwork each time.",
          "Signage takes the mark the other way. Lit from within and built with real depth, it turns the same geometry into an object on a wall: outside as a solid glass block catching daylight, inside as a blue-lit form that sets the tone of the room. The brand reads as permanent at the front door and on the road alike.",
        ],
      },
      {
        type: "media-grid",
        cols: 3,
        items: [
          { kind: "image", src: qi("qi-brochure.jpg") },
          { kind: "image", src: qi("qi-cards.jpg") },
          { kind: "image", src: qi("qi-idcard.jpg") },
        ],
      },
      {
        type: "text",
        title: "Print you can hand over",
        body: [
          "The brochure ships in a flocked blue presentation box, so the first thing a prospect handles is the brand colour at full strength before a single word is read. The cover carries the same glass render used in the 3D and motion work, which keeps the identity consistent whether it arrives on a screen or across a table.",
          "Business cards are duplexed, grey and white against a solid blue band, with a QR straight to the site instead of a printed list of services. The only line of copy on the card is a plain statement of what the company does, which is the same restraint the rest of the system runs on.",
          "Staff ID badges run the other way round: a full-bleed glass render, the mark small in the corner, and the engineer's name set in the brand typeface. On site that badge is often the first piece of the identity a client reads up close, so it was designed with the same care as anything that gets printed and posted.",
        ],
      },
      {
        type: "media",
        kind: "video",
        src: qi("qi-web.mp4"),
        width: "wide",
        bg: "#050505",
      },
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: qi("qi-tablet.jpg") },
          { kind: "image", src: qi("qi-social.jpg") },
        ],
      },
      {
        type: "text",
        title: "A website made of the same parts",
        body: [
          "The site opens on the 3D work rather than a stock header image, so the first thing a visitor sees is the brand's own geometry moving. The interface is kept dark throughout, which lets the blue carry the structure and leaves the lime free to mark the few things that matter: the enquiry button, an active state, a highlighted figure.",
          "Underneath that, the content is deliberately plain. Services are broken into named, scannable cards rather than paragraphs of jargon, photography shows real engineers in real server rooms, and the contact action stays pinned within reach on every screen. It reads the way the company describes itself: practical, and available when something breaks.",
          "The layout holds together down to tablet and phone, where the mark crops in rather than shrinking away, and the same system carries onto social. Profile artwork uses the glass renders as the banner and the mark alone as the avatar, so the account is recognisable at the size people actually see it, a 40 pixel circle in a feed.",
        ],
      },
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: qi("qi-server.jpg") },
          { kind: "image", src: qi("qi-tshirt.jpg") },
        ],
      },
      {
        type: "text",
        title: "The people who turn up",
        body: [
          "The last mile of this brand is a person in a server room at eight in the morning. Uniform, laptop and on-site presence were treated as part of the identity, so the same mark that appears in the 3D animation is the one on the polo shirt in a data centre.",
          "Photography direction follows the palette: deep blacks, hard blue light and a lime accent, so imagery of real environments still sits inside the brand world.",
        ],
      },
    ],

    process: [
      {
        title: "Positioning",
        body: "An IT partner judged on uptime and response, not on jargon: what the business needs to keep running.",
      },
      {
        title: "Mark & wordmark",
        body: "A Q built from interlocking planes, constructed on a geometric grid alongside a bespoke wordmark.",
      },
      {
        title: "Colour & system",
        body: "One dominant vibrant blue, structured with black and grey, sharpened by a rationed lime accent.",
      },
      {
        title: "3D & motion",
        body: "The mark rendered as glass and turned in light, giving the brand a motion asset built from its own geometry.",
      },
      {
        title: "Applied estate",
        body: "Vehicle livery across two van sizes, uniform, field kit, print and photography direction.",
      },
    ],

    decisions: [
      {
        title: "Build the mark as an object, not a shape",
        body: "Most IT logos are flat and stay flat. Constructing the Q from interlocking planes meant it could be rendered in three dimensions later without redrawing anything, which is where the 3D and motion work came from. The trade-off is a mark that demands care at small sizes, so the geometry was tuned until it still reads at favicon scale.",
      },
      {
        title: "One loud blue, one rationed accent",
        body: "The category is full of safe corporate blues. We pushed the blue well past that and then held the lime back to an edge or a single call to action. A second full colour would have diluted both; used sparingly, the lime does more work and the blue stays the thing people remember.",
      },
      {
        title: "Treat the van as a primary touchpoint",
        body: "For a field service business, more people see the fleet than the website. So the livery was designed first as a large-scale graphic application, with the mark cropped to read as pattern at distance and the details kept legible up close, rather than being a logo applied to a door at the end of the project.",
      },
    ],

    palette: [
      { name: "Vibrant Blue", hex: "#3200e8" },
      { name: "Black", hex: "#111111" },
      { name: "Grey", hex: "#d3d3d3" },
      { name: "Vibrant Lime", hex: "#cbf41c" },
    ],

    principles: [
      { name: "Geometry", body: "planes, not drawn letters" },
      { name: "Depth", body: "an object, rendered not redrawn" },
      { name: "Restraint", body: "one loud blue, one rationed accent" },
    ],
  },

  {
    slug: "gallagher-kitchens",
    name: "Gallagher Kitchens",
    tagline: "Elegance uncovered",
    year: "2020",
    client: "Gallagher Kitchens",
    sector: "Bespoke Joinery & Retail",
    tags: ["Brand Identity", "Digital Design", "Signage"],
    accent: "#022321",

    thumb: gk("gk-kitchen-1.jpg"),
    heroVideo: gk("gk-web.mp4"),
    heroPoster: gk("gk-web-poster.jpg"),

    summary:
      "For over thirty-two years, family-run Gallagher Kitchens has designed and built bespoke kitchens and wardrobes from its Dublin showrooms. To grow beyond its local base, the company needed a new identity and a digital presence that could carry its craftsmanship to Leinster and beyond.",

    scope: [
      "Brand Identity",
      "Web Design & Development",
      "Vehicle & Building Signage",
      "Digital Marketing",
      "Print Collateral",
    ],

    sections: [
      {
        type: "media",
        kind: "image",
        src: gk("gk-brand.jpg"),
      },
      {
        type: "media",
        kind: "video",
        src: gk("gk-3dlogo.mp4"),
        poster: gk("gk-3dlogo-poster.jpg"),
        bg: "#022321",
        caption: "The contemporised crest, rendered and turned in light.",
      },
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: gk("gk-cards-desk.jpg") },
          { kind: "image", src: gk("gk-cards-detail.jpg") },
        ],
      },
      {
        type: "text",
        title: "Tradition, contemporised",
        body: [
          "Research into why customers choose one kitchen maker over another shaped the direction: marry the company's history and expertise with a modern audience. We drew on the existing heraldic coat of arms and contemporised it, pairing the motif with a richer palette of black, gold and white for strength, tradition and contemporary elegance.",
          "The result keeps everything the family had earned over three decades and drops nothing that still worked. The crest is recognisably the same company, drawn with a lighter hand.",
        ],
      },
      {
        type: "media",
        kind: "image",
        src: gk("gk-guidelines.jpg"),
      },
      {
        type: "media",
        kind: "image",
        src: gk("gk-experience.jpg"),
      },
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: gk("gk-kitchen-1.jpg") },
          { kind: "image", src: gk("gk-kitchen-2.jpg") },
        ],
      },
      {
        type: "media",
        kind: "video",
        src: gk("gk-web.mp4"),
        poster: gk("gk-web-poster.jpg"),
        bg: "#96857b",
        caption: "The site in use.",
      },
      {
        type: "media",
        kind: "image",
        src: gk("gk-mobile.jpg"),
      },
      {
        type: "text",
        title: "A more engaging website",
        body: [
          "We designed a responsive platform with a custom theme, using the new palette to separate content from calls to action and make the site effortless to read and use on any device.",
          "Kitchens are bought slowly and visually, so the site is built the way people actually shop for them: large photography, room to compare, and an enquiry never more than a tap away.",
        ],
      },
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: gk("gk-kitchen-3.jpg") },
          { kind: "image", src: gk("gk-kitchen-4.jpg") },
        ],
      },
      {
        type: "media",
        kind: "image",
        src: gk("gk-vans.jpg"),
      },
      {
        type: "text",
        title: "Identity on the move",
        body: [
          "To embed the new look, we adapted the branding into eye-catching signage for the van fleet, building exteriors and showrooms: a comprehensive, uniform identity wherever the company appears.",
          "For a business that fits kitchens across Leinster, the fleet does more advertising than any campaign. The client's verdict was that the work linked their tradition to the modern customer, and that they were busier than ever.",
        ],
      },
      {
        type: "media-grid",
        cols: 2,
        items: [
          { kind: "image", src: gk("gk-stationery.jpg") },
          { kind: "image", src: gk("gk-survey-pad.jpg") },
        ],
      },
    ],

    process: [
      {
        title: "Research",
        body: "Understanding why customers pick one kitchen maker over another, and what thirty-two years of reputation was already worth.",
      },
      {
        title: "Identity",
        body: "The existing heraldic crest redrawn for a modern audience, paired with black, gold and white.",
      },
      {
        title: "Digital platform",
        body: "A responsive custom theme built around large photography and an enquiry that is always within reach.",
      },
      {
        title: "Applied estate",
        body: "Vehicle livery, building and showroom signage, print collateral and digital marketing.",
      },
    ],

    decisions: [
      {
        title: "Evolve the crest, do not replace it",
        body: "The easy move was a clean sans-serif wordmark and a fresh start. But three decades of local reputation sat in that coat of arms, and throwing it away would have discarded the one thing a new competitor cannot buy. Contemporising it kept the equity and still read as a change.",
      },
      {
        title: "Gold as structure, not decoration",
        body: "Black and white carry the layouts and gold marks the moments that matter, so the palette signals quality without tipping into the gloss the category usually reaches for. Used sparingly, it reads as craft rather than luxury pastiche.",
      },
      {
        title: "Treat the fleet as the main channel",
        body: "A kitchen company fits kitchens in the neighbourhoods it wants more work in, so the vans are seen far more often than any advert. Designing the livery as a primary application rather than an afterthought turned the existing fleet into the campaign.",
      },
    ],

    palette: [
      { name: "Company Green", hex: "#022321" },
      { name: "Company Ink", hex: "#072334" },
      { name: "Copper 01", hex: "#FDCB9D" },
      { name: "Copper 02", hex: "#FBBC8F" },
      { name: "Copper 03", hex: "#D88561" },
      { name: "Copper 04", hex: "#BF6849" },
    ],

    principles: [
      { name: "Heritage", body: "thirty-two years, redrawn not discarded" },
      { name: "Restraint", body: "gold for emphasis, never for show" },
      { name: "Presence", body: "the fleet is the campaign" },
    ],
  },
];
export const getProject = (slug) => projects.find((p) => p.slug === slug);

export const getAdjacent = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
};
