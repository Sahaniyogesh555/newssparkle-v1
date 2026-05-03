import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CATEGORIES, SITE, formatDate } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="border-b border-rule bg-background sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container-wide">
        <div className="flex items-center justify-between py-2 text-xs text-byline border-b border-border">
          <span className="hidden sm:inline">{formatDate(new Date().toISOString())}</span>
          <span className="font-medium">Independent. Fact-based. Daily.</span>
          <span className="hidden sm:inline">EN</span>
        </div>
        <div className="flex items-center justify-between py-4 sm:py-5">
          <button className="md:hidden -ml-1 p-1.5" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <Link to="/" className="flex-1 md:flex-none text-center md:text-left">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-headline">
              {SITE.name}
            </h1>
          </Link>
          <button className="p-1.5" aria-label="Search"><Search className="size-5" /></button>
        </div>
        <nav className={cn("md:flex items-center justify-center gap-7 pb-3 border-t border-border pt-3", open ? "flex flex-col gap-3 md:flex-row md:gap-7" : "hidden")}>
          <NavLink to="/" end className={({isActive}) => cn("text-[13px] font-semibold uppercase tracking-wider transition-colors", isActive ? "text-primary" : "text-headline hover:text-primary")}>
            Home
          </NavLink>
          {CATEGORIES.map(c => (
            <NavLink key={c.slug} to={`/category/${c.slug}`} className={({isActive}) => cn("text-[13px] font-semibold uppercase tracking-wider transition-colors", isActive ? "text-primary" : "text-headline hover:text-primary")}>
              {c.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
