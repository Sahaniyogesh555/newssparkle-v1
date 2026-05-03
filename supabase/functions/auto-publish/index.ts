// Auto-publishing edge function: generates one fully SEO-optimized blog post and inserts it.
// Triggered by pg_cron every 4 hours OR manually via POST.
// Body: { topic?: string, category?: string, count?: number }  -- all optional

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CATEGORIES = ["world", "politics", "business", "technology", "sports", "entertainment"] as const;
type Cat = (typeof CATEGORIES)[number];

const TOPIC_HINTS: Record<Cat, string[]> = {
  world: ["UN climate negotiations", "EU policy shifts", "Middle East diplomacy", "humanitarian crises", "Asia-Pacific tensions", "Latin America elections"],
  politics: ["legislation debates", "election analysis", "supreme court rulings", "cabinet reshuffles", "policy reform impact"],
  business: ["central bank decisions", "earnings season highlights", "tech IPOs", "energy markets", "supply chain trends", "crypto regulation"],
  technology: ["frontier AI models", "cybersecurity breaches", "consumer hardware launches", "space industry milestones", "quantum computing progress", "regulation of big tech"],
  sports: ["transfer window analysis", "championship results", "athlete contracts", "doping investigations", "sport business deals", "Olympic preparations"],
  entertainment: ["streaming wars", "box office trends", "music chart shifts", "festival highlights", "celebrity industry moves", "awards season analysis"],
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 70) + "-" + Math.random().toString(36).slice(2, 7);

interface GeneratedPost {
  title: string;
  meta_title: string;
  meta_description: string;
  excerpt: string;
  content_markdown: string;
  keywords: string[];
  key_takeaways: string[];
  faq: Array<{ q: string; a: string }>;
  featured_image_alt: string;
  reading_minutes: number;
}

async function generatePost(topic: string, category: Cat): Promise<GeneratedPost> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  const systemPrompt = `You are a senior journalist, SEO expert and content strategist for a daily news website.
Write a detailed, engaging, fact-based news/current-affairs article in a neutral, journalistic tone.
Output ONLY valid JSON matching the provided schema — no markdown wrapping, no commentary.
Article requirements:
- Headline: clickable, emotional, SEO-optimized, under 70 chars.
- Meta title: 50-60 chars. Meta description: 150-160 chars.
- Body in markdown: introduction with hook, ## H2 + ### H3 sections covering background, latest developments, key facts/data, expert insights, real-world impact, future outlook. End with conclusion.
- Use short paragraphs, bullet points and bold key terms for skimmability.
- 800-1100 words.
- Provide 4 key takeaways and 3 FAQs.
- 6 SEO keywords (mix primary + long-tail).
- The article must read as an authentic, original news analysis (not a press release).`;

  const userPrompt = `Write today's article about: "${topic}" for the ${category.toUpperCase()} section.`;

  const tool = {
    type: "function",
    function: {
      name: "publish_article",
      description: "Submit the finished SEO-optimized article",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          meta_title: { type: "string" },
          meta_description: { type: "string" },
          excerpt: { type: "string", description: "1-2 sentence summary, ~200 chars" },
          content_markdown: { type: "string" },
          keywords: { type: "array", items: { type: "string" }, minItems: 5, maxItems: 8 },
          key_takeaways: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
          faq: {
            type: "array",
            items: { type: "object", properties: { q: { type: "string" }, a: { type: "string" } }, required: ["q", "a"] },
            minItems: 2, maxItems: 4,
          },
          featured_image_alt: { type: "string" },
          reading_minutes: { type: "integer" },
        },
        required: ["title", "meta_title", "meta_description", "excerpt", "content_markdown", "keywords", "key_takeaways", "faq", "featured_image_alt", "reading_minutes"],
        additionalProperties: false,
      },
    },
  };

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      tools: [tool],
      tool_choice: { type: "function", function: { name: "publish_article" } },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429) throw new Error("AI rate limit hit");
    if (res.status === 402) throw new Error("AI credits exhausted — top up Lovable AI");
    throw new Error(`AI gateway error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const call = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!call) throw new Error("AI returned no tool call");
  return JSON.parse(call.function.arguments) as GeneratedPost;
}

function pickTopic(category: Cat, providedTopic?: string): string {
  if (providedTopic) return providedTopic;
  const hints = TOPIC_HINTS[category];
  const base = hints[Math.floor(Math.random() * hints.length)];
  // Add timeliness phrasing
  const angles = ["latest developments in", "what's next for", "this week in", "the new reality of", "inside the global story of"];
  return `${angles[Math.floor(Math.random() * angles.length)]} ${base}`;
}

function pickFeaturedImage(category: Cat, keywords: string[]): string {
  // Use Unsplash Source as a license-friendly placeholder featured image generator.
  // Falls back to category keyword if none provided.
  const kw = encodeURIComponent((keywords[0] || category).replace(/[^a-z0-9 ]/gi, ""));
  return `https://source.unsplash.com/1600x900/?${kw},${category}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    let body: { topic?: string; category?: string; count?: number } = {};
    try { body = await req.json(); } catch { /* GET / cron */ }

    const count = Math.min(Math.max(body.count ?? 1, 1), 5);
    const results: Array<{ slug?: string; error?: string; category: string }> = [];

    for (let i = 0; i < count; i++) {
      // Rotate categories for variety
      const category = (body.category && CATEGORIES.includes(body.category as Cat))
        ? (body.category as Cat)
        : CATEGORIES[(Math.floor(Date.now() / 1000) + i) % CATEGORIES.length];

      const topic = pickTopic(category, i === 0 ? body.topic : undefined);

      try {
        const article = await generatePost(topic, category);
        const slug = slugify(article.title);
        const featured_image_url = pickFeaturedImage(category, article.keywords);

        const { error } = await supabase.from("posts").insert({
          title: article.title,
          slug,
          excerpt: article.excerpt,
          content: article.content_markdown,
          meta_title: article.meta_title.slice(0, 60),
          meta_description: article.meta_description.slice(0, 160),
          keywords: article.keywords,
          featured_image_url,
          featured_image_alt: article.featured_image_alt,
          category_slug: category,
          reading_minutes: article.reading_minutes,
          key_takeaways: article.key_takeaways,
          faq: article.faq,
          status: "published",
          published_at: new Date().toISOString(),
        });

        if (error) results.push({ category, error: error.message });
        else results.push({ category, slug });
      } catch (e) {
        results.push({ category, error: (e as Error).message });
      }

      // Brief delay between posts to be polite to AI gateway
      if (i < count - 1) await new Promise(r => setTimeout(r, 1500));
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("auto-publish fatal:", e);
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
