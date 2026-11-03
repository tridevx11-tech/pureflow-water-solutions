import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { useApp } from "@/hooks/useAppStore";
import { company } from "@/data/company";

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/dealer-network", label: "Dealer Network" },
  { to: "/routes", label: "Routes" },
  { to: "/why-choose-us", label: "Why Choose Us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-10 w-10 place-items-center rounded-2xl btn-gradient">
        <Icon name="drop" className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        <span className={`block font-display text-xl font-extrabold tracking-tight ${light ? "text-primary-foreground" : "text-brand-dark"}`}>UDVIJ</span>
        <span className={`block text-[10px] font-semibold uppercase tracking-[0.2em] ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>Mineral Water</span>
      </span>
    </Link>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-brand-dark"
              activeProps={{ className: "bg-accent text-brand-dark" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link to="/dealer-network" className="hidden rounded-full px-5 py-2.5 text-sm font-bold lg:inline-flex btn-gradient">
          Become Dealer
        </Link>
        <button onClick={() => setOpen(!open)} className="rounded-xl p-2 text-brand-dark lg:hidden" aria-label="Toggle menu">
          <Icon name={open ? "x" : "menu"} className="h-6 w-6" />
        </button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-4 py-3 lg:hidden">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 font-semibold text-foreground hover:bg-accent">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const { state } = useApp();
  const s = state.settings;
  return (
    <footer className="relative mt-24 overflow-hidden hero-gradient text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4 md:px-6">
        <div className="md:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm text-primary-foreground/75">{company.business}. Supplying dealers across 7 city routes with route-managed delivery.</p>
        </div>
        <div>
          <h4 className="mb-4 font-bold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {navLinks.slice(0, 5).map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-primary-foreground">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-bold">Company</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/dealer-network" className="hover:text-primary-foreground">Dealer Registration</Link></li>
            <li><Link to="/privacy" className="hover:text-primary-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary-foreground">Terms</Link></li>
            <li><Link to="/contact" className="hover:text-primary-foreground">Contact</Link></li>
            <li><Link to="/admin" className="inline-flex items-center gap-1 rounded-full glass-dark px-3 py-1 font-semibold">Admin Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-bold">{s.siteTitle}</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2"><Icon name="pin" className="h-5 w-5 shrink-0" />{s.address}</li>
            <li className="flex gap-2"><Icon name="phone" className="h-5 w-5 shrink-0" /><a href={`tel:${s.phone}`}>{s.phone}</a></li>
            <li className="flex gap-2"><Icon name="mail" className="h-5 w-5 shrink-0" /><a href={`mailto:${s.email}`}>{s.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-sm text-primary-foreground/70">{company.copyright}</div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden hero-gradient text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-water">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">{subtitle}</p>}
      </div>
      <Waves />
    </section>
  );
}

export function Waves() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden">
      <svg className="wave-track absolute bottom-0 h-16 w-[200%] text-background" viewBox="0 0 1440 64" preserveAspectRatio="none">
        <path fill="currentColor" d="M0 32 C120 0 240 64 360 32 S600 0 720 32 960 64 1080 32 1320 0 1440 32 V64 H0Z" />
      </svg>
      <svg className="wave-track absolute bottom-0 h-12 w-[200%] text-background opacity-50 [animation-duration:18s]" viewBox="0 0 1440 64" preserveAspectRatio="none">
        <path fill="currentColor" d="M0 40 C180 10 300 60 480 36 S780 8 960 36 1260 60 1440 30 V64 H0Z" />
      </svg>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, center = true }: { eyebrow: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={`mb-12 ${center ? "mx-auto max-w-2xl text-center" : ""}`}>
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-aqua">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold text-brand-dark md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function seo(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
