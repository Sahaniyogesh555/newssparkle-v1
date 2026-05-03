import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/lib/types";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { SEO } from "@/components/SEO";
import { CATEGORIES, SITE } from "@/lib/site";
import { Link } from "react-router-dom";

export default function Index() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("posts").select("*").eq("status", "published")
      .order("published_at", { ascending: false }).limit(30)
      .then(({ data }) => { setPosts((data as Post[]) || []); setLoading(false); });
  }, []);

  const hero = posts[0];
  const secondary = posts.slice(1, 4);
  const grid = posts.slice(4, 13);
  const sidebar = posts.slice(0, 5);

  return (
    <Layout>
      <SEO title={`${SITE.name} — ${SITE.tagline}`} description={SITE.description} path="/" />

      <section className="bg-gradient-hero border-b border-rule">
        <div className="container-wide py-10 sm:py-14">
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-72 bg-muted rounded" />
              <div className="h-8 bg-muted w-3/4 rounded" />
            </div>
          ) : hero ? (
            <PostCard post={hero} variant="hero" />
          ) : (
            <div className="text-center py-20">
              <h2 className="font-serif text-3xl font-bold">Stories arriving shortly</h2>
              <p className="mt-3 text-byline">Our editorial desk publishes fresh reporting every four hours.</p>
            </div>
          )}
        </div>
      </section>

      {secondary.length > 0 && (
        <section className="border-b border-border">
          <div className="container-wide py-10 grid gap-8 md:grid-cols-3">
            {secondary.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      )}

      <div className="container-wide py-12 grid gap-12 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="rule-top mb-6 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl font-bold">Latest</h2>
            <span className="kicker text-byline">Updated continuously</span>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        </section>

        <aside className="space-y-10">
          <div className="ad-slot" data-ad-slot="sidebar-1">Advertisement</div>

          <div>
            <div className="rule-top mb-3"><h2 className="font-serif text-xl font-bold">Most Read</h2></div>
            {sidebar.map(p => <PostCard key={p.id} post={p} variant="compact" />)}
          </div>

          <div>
            <div className="rule-top mb-3"><h2 className="font-serif text-xl font-bold">Sections</h2></div>
            <ul className="space-y-2">
              {CATEGORIES.map(c => (
                <li key={c.slug}>
                  <Link to={`/category/${c.slug}`} className="flex items-center justify-between py-2 border-b border-border text-sm font-semibold hover:text-primary">
                    {c.name}
                    <span className="kicker" style={{ color: `hsl(var(--${c.color}))` }}>›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
