import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/lib/types";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { SEO } from "@/components/SEO";
import { CATEGORIES, SITE } from "@/lib/site";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const cat = CATEGORIES.find(c => c.slug === slug);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase.from("posts").select("*").eq("category_slug", slug).eq("status", "published")
      .order("published_at", { ascending: false }).limit(60)
      .then(({ data }) => { setPosts((data as Post[]) || []); setLoading(false); });
  }, [slug]);

  if (!cat) return <Navigate to="/404" replace />;

  return (
    <Layout>
      <SEO
        title={`${cat.name} News & Analysis`}
        description={`The latest ${cat.name.toLowerCase()} news, in-depth analysis and breaking stories from the ${SITE.name} editorial desk.`}
        path={`/category/${cat.slug}`}
      />
      <section className="border-b border-rule bg-secondary/30">
        <div className="container-wide py-12">
          <span className="kicker" style={{ color: `hsl(var(--${cat.color}))` }}>Section</span>
          <h1 className="headline-hero mt-2">{cat.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-foreground/80">
            In-depth {cat.name.toLowerCase()} reporting, analysis and live updates from around the world.
          </p>
        </div>
      </section>

      <div className="container-wide py-12">
        {loading ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
            {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-muted" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-byline">
            <p>No stories published in this section yet. Check back shortly.</p>
          </div>
        ) : (
          <>
            {posts[0] && <div className="mb-12 pb-12 border-b border-border"><PostCard post={posts[0]} variant="hero" /></div>}
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(1).map(p => <PostCard key={p.id} post={p} />)}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
