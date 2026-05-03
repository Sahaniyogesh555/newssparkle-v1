export const SITE = {
  name: "PulseDaily",
  tagline: "Independent reporting on the world right now.",
  description: "PulseDaily delivers fact-based, deeply researched coverage of world affairs, politics, business, technology, sports and entertainment — updated multiple times a day.",
  url: typeof window !== "undefined" ? window.location.origin : "https://pulsedaily.app",
  twitter: "@pulsedaily",
  publisher: "PulseDaily Editorial Desk",
  logo: "/logo.svg",
};

export const CATEGORIES = [
  { slug: "world", name: "World", color: "cat-world" },
  { slug: "politics", name: "Politics", color: "cat-politics" },
  { slug: "business", name: "Business", color: "cat-business" },
  { slug: "technology", name: "Technology", color: "cat-technology" },
  { slug: "sports", name: "Sports", color: "cat-sports" },
  { slug: "entertainment", name: "Entertainment", color: "cat-entertainment" },
] as const;

export type CategorySlug = typeof CATEGORIES[number]["slug"];

export function categoryColor(slug: string): string {
  const c = CATEGORIES.find(c => c.slug === slug);
  return c ? `hsl(var(--${c.color}))` : "hsl(var(--primary))";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
