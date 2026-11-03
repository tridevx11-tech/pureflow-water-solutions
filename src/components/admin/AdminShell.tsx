import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/site/Layout";
import { useApp } from "@/hooks/useAppStore";
import { DashboardSection, ReportsSection } from "@/components/admin/dashboard";
import { DealersSection, DriversSection, OrdersSection, ProductsSection, RoutesSection, TemposSection } from "@/components/admin/manage";
import { BannersSection, GalleryAdminSection, MessagesSection, NotificationsSection, SettingsSection, TestimonialsAdminSection } from "@/components/admin/content";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "orders", label: "Manage Orders", icon: "file" },
  { id: "routes", label: "Manage Routes", icon: "route" },
  { id: "dealers", label: "Manage Dealers", icon: "cart" },
  { id: "products", label: "Manage Products", icon: "box" },
  { id: "drivers", label: "Manage Drivers", icon: "users" },
  { id: "tempo", label: "Manage Tempo", icon: "truck" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "gallery", label: "Gallery", icon: "image" },
  { id: "testimonials", label: "Testimonials", icon: "star" },
  { id: "banners", label: "Banner Manager", icon: "sun" },
  { id: "messages", label: "Contact Messages", icon: "msg" },
  { id: "settings", label: "Website Settings", icon: "gear" },
  { id: "reports", label: "Reports", icon: "chart" },
] as const;

const TITLES: Record<string, string> = Object.fromEntries(NAV.map((n) => [n.id, n.label]));

function Sidebar({ section, onNavigate }: { section: string; onNavigate: (id: string) => void }) {
  const { totals } = useApp();
  return (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto p-4">
      {NAV.map((n) => (
        <button
          key={n.id}
          onClick={() => onNavigate(n.id)}
          className={`flex items-center justify-between rounded-2xl px-4 py-2.5 text-left text-sm font-semibold transition ${
            section === n.id ? "btn-gradient" : "text-muted-foreground hover:bg-accent hover:text-brand-dark"
          }`}
        >
          <span className="flex items-center gap-3">
            <Icon name={n.icon} className="h-4 w-4" />
            {n.label}
          </span>
          {n.id === "notifications" && totals.unreadNotifications > 0 && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${section === n.id ? "bg-background text-brand-dark" : "bg-brand text-primary-foreground"}`}>
              {totals.unreadNotifications}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}

function SectionBody({ section, onNavigate }: { section: string; onNavigate: (id: string) => void }) {
  const map: Record<string, ReactNode> = {
    dashboard: <DashboardSection onNavigate={onNavigate} />,
    orders: <OrdersSection />,
    routes: <RoutesSection />,
    dealers: <DealersSection />,
    products: <ProductsSection />,
    drivers: <DriversSection />,
    tempo: <TemposSection />,
    notifications: <NotificationsSection />,
    gallery: <GalleryAdminSection />,
    testimonials: <TestimonialsAdminSection />,
    banners: <BannersSection />,
    messages: <MessagesSection />,
    settings: <SettingsSection />,
    reports: <ReportsSection />,
  };
  return map[section] ?? <DashboardSection onNavigate={onNavigate} />;
}

export function AdminShell() {
  const { logout } = useApp();
  const [section, setSection] = useState<string>("dashboard");
  const [open, setOpen] = useState(false);

  const navigate = (id: string) => {
    setSection(id);
    setOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-muted/60">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="p-4">
          <Logo />
          <p className="mt-1 pl-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Distribution Admin</p>
        </div>
        <Sidebar section={section} onNavigate={navigate} />
        <div className="mt-auto border-t border-border p-4">
          <Link to="/" className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-brand-dark">
            <Icon name="eye" className="h-4 w-4" /> View Website
          </Link>
          <button onClick={logout} className="mt-1 flex w-full items-center gap-2 rounded-2xl px-4 py-2.5 text-left text-sm font-semibold text-destructive transition hover:bg-destructive/10">
            <Icon name="logout" className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-card shadow-2xl">
            <div className="flex items-center justify-between p-4">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-xl p-2 text-muted-foreground hover:bg-accent">
                <Icon name="x" />
              </button>
            </div>
            <Sidebar section={section} onNavigate={navigate} />
            <div className="mt-auto border-t border-border p-4">
              <button onClick={logout} className="flex w-full items-center gap-2 rounded-2xl px-4 py-2.5 text-left text-sm font-semibold text-destructive transition hover:bg-destructive/10">
                <Icon name="logout" className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-xl p-2 text-brand-dark lg:hidden">
              <Icon name="menu" className="h-6 w-6" />
            </button>
            <h1 className="font-display text-lg font-extrabold text-brand-dark md:text-xl">{TITLES[section] ?? "Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("notifications")} aria-label="Notifications" className="relative rounded-2xl p-2 text-brand-dark transition hover:bg-accent">
              <Icon name="bell" className="h-5 w-5" />
              <NotificationBadge />
            </button>
            <span className="hidden rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-brand-dark sm:inline-flex">admin</span>
            <button onClick={logout} className="rounded-full px-5 py-2 text-sm font-bold btn-outline-brand lg:hidden">
              Logout
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 md:p-6">
          <SectionBody section={section} onNavigate={navigate} />
        </main>
      </div>
    </div>
  );
}

function NotificationBadge() {
  const { totals } = useApp();
  if (totals.unreadNotifications === 0) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground animate-pulse-ring">
      {totals.unreadNotifications}
    </span>
  );
}
