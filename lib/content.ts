/**
 * All repeated landing-page copy lives here so sections stay structural.
 *
 * PROTOTYPE DATA WARNING
 * `HERO_METRICS` and `TESTIMONIALS` are placeholder values invented
 * for this prototype. They are not verified business claims or real customers.
 * Replace them with substantiated figures and released quotes before this page
 * is published anywhere a visitor could act on them.
 */

export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#top" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Products", href: "#brands" },
  { label: "Inspiration", href: "#styles" },
  { label: "Pricing", href: "#metrics" },
  { label: "About", href: "#about" },
];

export const VALUE_PROPS = [
  {
    title: "Visualize before you build",
    body: "See your bathroom in 2D & 3D",
  },
  {
    title: "Get accurate estimates",
    body: "No surprise costs",
  },
  {
    title: "Find the right products",
    body: "Trusted brands & local stores",
  },
  {
    title: "Plan with confidence",
    body: "Save time, money and effort",
  },
];

/** Prototype placeholders — see the warning at the top of this file. */
export const HERO_METRICS = [
  { value: "10K+", label: "Happy homeowners" },
  { value: "4.8/5", label: "Average rating" },
  { value: "50+", label: "Trusted brands" },
];

export const STEPS = [
  {
    n: 1,
    title: "Add your measurements",
    body: "Enter your bathroom size and existing elements.",
    visual: "phone" as const,
  },
  {
    n: 2,
    title: "Get a smart plan",
    body: "See 2D layouts and optimized suggestions.",
    visual: "floorplan" as const,
  },
  {
    n: 3,
    title: "Choose your style",
    body: "Explore designs, tiles and fittings that match your taste.",
    visual: "moodboard" as const,
  },
  {
    n: 4,
    title: "Get material list",
    body: "Exact quantities, estimated cost and brand recommendations.",
    visual: "materials" as const,
  },
];

export const MEASUREMENTS = [
  { label: "Length", value: "8.0 ft" },
  { label: "Width", value: "6.0 ft" },
  { label: "Height", value: "9.0 ft" },
];

export const MATERIALS = [
  { icon: "tile" as const, label: "Tiles", qty: "48 pcs" },
  { icon: "pipe" as const, label: "PVC Pipe", qty: "22 ft" },
  { icon: "valve" as const, label: "Angle Valve", qty: "3 pcs" },
  { icon: "bag" as const, label: "Cement", qty: "2 bags" },
];

export const PLANNER_TOOLS = [
  { id: "toilet", label: "Toilet" },
  { id: "sink", label: "Sink" },
  { id: "shower", label: "Shower" },
  { id: "cabinet", label: "Cabinet" },
  { id: "bathtub", label: "Bathtub" },
];

export const STYLES = [
  { label: "Modern", src: "/photos/style-modern.jpg", alt: "Modern bathroom with a walk-in shower, warm stone walls and a timber vanity" },
  { label: "Traditional", src: "/photos/style-traditional.jpg", alt: "Traditional bathroom with a roll-top bath and panelled cabinetry" },
  { label: "Minimal", src: "/photos/style-minimal.jpg", alt: "Minimal bathroom in white with a freestanding tub and pale timber" },
  { label: "Luxury", src: "/photos/style-luxury.jpg", alt: "Luxury bathroom with a sculptural stone bath and full-height stone walls" },
];

/** Text only: inventing brand logo artwork would misrepresent these companies. */
export const BRANDS = ["Jaquar", "CERA", "Hindware", "KOHLER", "GROHE"];

export const TILE_SWATCHES = [
  { id: "marble", label: "White marble" },
  { id: "cream", label: "Cream stone" },
  { id: "slate", label: "Dark slate" },
  { id: "blue", label: "Glazed blue" },
  { id: "terracotta", label: "Terracotta" },
  { id: "wood", label: "Warm wood" },
];


/** Prototype placeholders — not real customers. See the warning above. */
export const TESTIMONIALS = [
  {
    quote:
      "Milagro Universe made the whole process so much easier. I could finally visualize my bathroom and choose the right products.",
    name: "Priya S.",
    role: "Homeowner, Bengaluru",
    src: "/photos/testimonial-1.jpg",
    alt: "Bathroom with a walnut vanity, round backlit mirror and brass tapware",
  },
  {
    quote: "The material list was spot on. No more multiple trips to the store!",
    name: "Rahul M.",
    role: "Homeowner, Mumbai",
    src: "/photos/testimonial-2.jpg",
    alt: "Bright bathroom with a glass shower screen and a white freestanding bath",
  },
  {
    quote:
      "Beautiful designs, easy to use and super helpful for someone like me with no technical background.",
    name: "Ananya K.",
    role: "Homeowner, Pune",
    src: "/photos/testimonial-3.jpg",
    alt: "Bathroom with a dark marble wall, timber vanity and a round mirror",
  },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Home", href: "#top" },
  { label: "Features", href: "#value" },
  { label: "Inspiration", href: "#styles" },
  { label: "Pricing", href: "#metrics" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "#about" },
  { label: "Help", href: "#about" },
];

export const SOCIALS = [
  { label: "Instagram", href: "#", icon: "instagram" as const },
  { label: "YouTube", href: "#", icon: "youtube" as const },
  { label: "LinkedIn", href: "#", icon: "linkedin" as const },
];
