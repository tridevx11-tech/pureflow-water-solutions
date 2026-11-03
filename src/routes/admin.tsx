import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Logo, seo } from "@/components/site/Layout";
import { useApp } from "@/hooks/useAppStore";
import { formatCurrency } from "@/utils/analytics";

export const Route = createFileRoute("/admin")({
  head: () => seo("Admin — UDVIJ Distribution", "UDVIJ admin dashboard for routes, orders and dispatch."),
  component: Admin,
});

function Admin() {
  const { state, login, logout, totals, highestDemandRoute, routeStats } = useApp();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); setErr(!login(u, p)); };
  if (!state.isAdmin)
    return (
      <div className="grid min-h-screen place-items-center hero-gradient p-4">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl bg-card p-8">
          <Logo />
          <input className="input-field" placeholder="Username" value={u} onChange={(e) => setU(e.target.value)} />
          <input className="input-field" type="password" placeholder="Password" value={p} onChange={(e) => setP(e.target.value)} />
          {err && <p className="text-sm text-destructive">Invalid credentials</p>}
          <button className="w-full rounded-full py-3 font-bold btn-gradient">Login</button>
        </form>
      </div>
    );
  const cards = [["Total Dealers", totals.dealers], ["Total Orders", totals.orders], ["Total Routes", totals.routes], ["Tempo Ready", totals.temposReady], ["Completed", totals.completedDeliveries], ["Pending", totals.pendingDeliveries], ["Today's Revenue", formatCurrency(totals.todayRevenue)], ["Unread Alerts", totals.unreadNotifications]];
  const max = Math.max(1, ...routeStats.map((r) => r.totalOrders));
  return (
    <div className="min-h-screen bg-muted/60 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between"><Logo /><button onClick={logout} className="rounded-full px-5 py-2 btn-outline-brand">Logout</button></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([l, v]) => <div key={l} className="card-soft p-5"><div className="text-sm text-muted-foreground">{l}</div><div className="font-display text-2xl font-bold text-brand-dark">{v}</div></div>)}
        </div>
        {highestDemandRoute && (
          <div className="rounded-3xl hero-gradient p-6 text-primary-foreground">
            <p className="font-bold">🏆 Highest Demand Today — {highestDemandRoute.route.name} ({highestDemandRoute.totalOrders} orders)</p>
            <p className="mt-2">Recommended Dispatch: Send Tempo {highestDemandRoute.route.tempoNumber} to {highestDemandRoute.route.name} · Priority HIGH</p>
          </div>
        )}
        <div className="card-soft space-y-3 p-6">
          {routeStats.map((r) => (
            <div key={r.route.id}><div className="flex justify-between text-sm"><span>{r.route.name} ({r.level})</span><span>{r.totalOrders}</span></div>
              <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full btn-gradient" style={{ width: `${(r.totalOrders / max) * 100}%` }} /></div></div>
          ))}
        </div>
        <div className="card-soft space-y-2 p-6">
          {state.notifications.slice(0, 6).map((n) => <div key={n.id} className="rounded-xl bg-accent p-3 text-sm"><b>🔔 {n.title}</b> — {n.message}</div>)}
        </div>
      </div>
    </div>
  );
}
