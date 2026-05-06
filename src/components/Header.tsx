import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CATEGORIES, SITE, formatDate } from "@/lib/site";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

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
        <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-2 py-3 sm:py-4">
          <button className="md:hidden p-1.5 -ml-1.5 justify-self-start" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="hidden md:block" aria-hidden="true" />
          <Link
            to="/"
            aria-label={`${SITE.name} — home`}
            className="justify-self-center flex items-center"
          >
            <img
              src={logo}
              alt={`${SITE.name} logo`}
              width="640"
              height="640"
              decoding="async"
              fetchPriority="high"
              className="block h-10 sm:h-12 md:h-14 w-auto select-none [image-rendering:auto]"
              draggable={false}
            />
            <span className="sr-only">{SITE.name}</span>
          </Link>
          <button className="p-1.5 -mr-1.5 justify-self-end" aria-label="Search"><Search className="size-5" /></button>
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
