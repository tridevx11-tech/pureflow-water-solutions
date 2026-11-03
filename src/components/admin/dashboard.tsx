import { useState } from "react";
import { Icon } from "@/components/Icon";
import { DemandBadge } from "@/components/site/Sections";
import { useApp } from "@/hooks/useAppStore";
import { classifyDemand, formatCurrency } from "@/utils/analytics";
import { EmptyState, SectionToolbar, StatCard, StatusPill } from "@/components/admin/shared";

const wrap = "space-y-6";

export function DashboardSection({ onNavigate }: { onNavigate: (section: string) => void }) {
  const { state, totals, highestDemandRoute, routeStats, demandGroups, dispatch } = useApp();
  const [dispatched, setDispatched] = useState(false);

  const dispatchTempo = () => {
    if (!highestDemandRoute) return;
    const tempo = state.tempos.find((t) => t.number === highestDemandRoute.route.tempoNumber);
    if (tempo && tempo.status !== "In Transit") {
      dispatch({ type: "tempo/save", item: { ...tempo, status: "In Transit", currentRoute: highestDemandRoute.route.name } });
    }
    setDispatched(true);
  };

  const recent = [...state.orders].slice(0, 6);

  return (
    <div className={wrap}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="users" label="Total Dealers" value={totals.dealers} />
        <StatCard icon="cart" label="Total Orders" value={totals.orders} />
        <StatCard icon="route" label="Total Routes" value={totals.routes} />
        <StatCard
          icon="trophy"
          label="Highest Demand Route"
          value={highestDemandRoute ? highestDemandRoute.route.name.replace(" Route", "") : "—"}
          hint={highestDemandRoute ? `${highestDemandRoute.totalOrders} orders` : undefined}
          highlight
        />
        <StatCard icon="truck" label="Tempo Ready" value={totals.temposReady} />
        <StatCard icon="check" label="Completed Deliveries" value={totals.completedDeliveries} />
        <StatCard icon="bell" label="Pending Deliveries" value={totals.pendingDeliveries} />
        <StatCard icon="chart" label="Today's Revenue" value={formatCurrency(totals.todayRevenue)} />
      </div>

      {highestDemandRoute && (
        <div className="rounded-3xl hero-gradient p-6 text-primary-foreground md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                <Icon name="trophy" className="h-4 w-4 text-water" /> Highest Demand Today
              </p>
              <h3 className="mt-4 font-display text-3xl font-extrabold">{highestDemandRoute.route.name}</h3>
              <p className="mt-1 text-lg font-semibold text-water">{highestDemandRoute.totalOrders} orders today · Priority HIGH</p>
              <p className="mt-3 text-sm text-primary-foreground/80">
                Recommended Dispatch — Send Tempo <b>{highestDemandRoute.route.tempoNumber}</b> to <b>{highestDemandRoute.route.name}</b> immediately. Load capacity{" "}
                {highestDemandRoute.route.totalCapacity}.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-3">
              <button onClick={dispatchTempo} disabled={dispatched} className="rounded-full bg-background px-7 py-3.5 font-bold text-brand-dark transition hover:-translate-y-0.5 disabled:opacity-70">
                {dispatched ? "Tempo Dispatched ✓" : "Dispatch Tempo Now"}
              </button>
              <span className="text-center text-xs text-primary-foreground/70">Tempo {highestDemandRoute.route.tempoNumber} · {highestDemandRoute.route.driver}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-soft p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-bold text-brand-dark">Route Analytics — Orders by Route</h3>
          <p className="text-sm text-muted-foreground">Sorted by highest demand. Low &lt; 10 · Medium 10–17 · High 18+.</p>
          <div className="mt-5 space-y-4">
            {routeStats.map((r) => {
              const max = Math.max(1, ...routeStats.map((x) => x.totalOrders));
              return (
                <div key={r.route.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-foreground">
                      {r.route.name} <span className="font-normal text-muted-foreground">· {r.route.tempoNumber}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <DemandBadge level={r.level} />
                      <b className="font-display text-brand">{r.totalOrders}</b>
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted">
                    <div className={`h-2.5 rounded-full ${r.level === "High" ? "hero-gradient" : "btn-gradient"}`} style={{ width: `${(r.totalOrders / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full demand-high px-3 py-1 font-bold">High demand: {demandGroups.high.length} routes</span>
            <span className="rounded-full demand-medium px-3 py-1 font-bold">Medium demand: {demandGroups.medium.length} routes</span>
            <span className="rounded-full demand-low px-3 py-1 font-bold">Low demand: {demandGroups.low.length} routes</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-soft p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-brand-dark">Notifications</h3>
              <button onClick={() => onNavigate("notifications")} className="text-sm font-bold text-brand hover:underline">
                View all
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{totals.unreadNotifications} unread alerts</p>
            <div className="mt-4 space-y-3">
              {state.notifications.slice(0, 3).map((n) => (
                <div key={n.id} className={`rounded-2xl p-3 text-sm ${n.read ? "bg-muted/70" : "bg-accent"}`}>
                  <b className="text-brand-dark">🔔 {n.title}</b>
                  <p className="mt-1 line-clamp-2 text-muted-foreground">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card-soft p-6">
            <h3 className="font-display text-lg font-bold text-brand-dark">Weekly & Monthly Orders</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="rounded-2xl bg-accent p-4">
                <div className="font-display text-2xl font-extrabold text-brand">{totals.weeklyOrders}</div>
                <div className="text-xs text-muted-foreground">Weekly Orders</div>
              </div>
              <div className="rounded-2xl bg-accent p-4">
                <div className="font-display text-2xl font-extrabold text-brand">{totals.monthlyOrders}</div>
                <div className="text-xs text-muted-foreground">Monthly Orders</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-soft p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-brand-dark">Recent Orders</h3>
          <button onClick={() => onNavigate("orders")} className="text-sm font-bold text-brand hover:underline">
            Manage orders
          </button>
        </div>
        <div className="mt-4 divide-y divide-border">
          {recent.length === 0 && <EmptyState text="No orders yet." />}
          {recent.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <span className="font-semibold text-foreground">{o.id}</span>
              <span className="text-muted-foreground">{o.dealerName}</span>
              <span className="text-muted-foreground">{o.routeName}</span>
              <span className="text-muted-foreground">
                {o.quantity} × {o.product}
              </span>
              <StatusPill status={o.status} />
            </div>
          ))}
        </div>
      </div>

      <div className="card-soft p-6">
        <h3 className="font-display text-lg font-bold text-brand-dark">Demand Groups</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {(["High", "Medium", "Low"] as const).map((lvl) => {
            const list = demandGroups[lvl === "High" ? "high" : lvl === "Medium" ? "medium" : "low"];
            return (
              <div key={lvl} className="rounded-2xl border border-border p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{lvl} Demand</p>
                {list.length === 0 && <p className="mt-2 text-sm text-muted-foreground">None right now.</p>}
                <ul className="mt-2 space-y-1.5 text-sm">
                  {list.map((s) => (
                    <li key={s.route.id} className="flex items-center justify-between font-semibold text-foreground">
                      {s.route.name}
                      <span className="font-display text-brand">{s.totalOrders}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ReportsSection() {
  const { state, routeStats, totals } = useApp();

  const revenueByProduct = state.products.map((p) => {
    const orders = state.orders.filter((o) => o.productId === p.id);
    const qty = orders.reduce((s, o) => s + o.quantity, 0);
    return { product: p, orders: orders.length, qty, revenue: qty * p.price };
  });
  const maxRevenue = Math.max(1, ...revenueByProduct.map((r) => r.revenue));

  const statusCounts = (["Pending", "Approved", "Dispatched", "Delivered", "Rejected"] as const).map((s) => ({
    status: s,
    count: state.orders.filter((o) => o.status === s).length,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="chart" label="Today's Revenue" value={formatCurrency(totals.todayRevenue)} />
        <StatCard icon="cart" label="Total Orders" value={totals.orders} />
        <StatCard icon="chart" label="Weekly Orders" value={totals.weeklyOrders} />
        <StatCard icon="chart" label="Monthly Orders" value={totals.monthlyOrders} />
      </div>

      <div className="card-soft p-6">
        <h3 className="font-display text-lg font-bold text-brand-dark">Revenue by Product</h3>
        <div className="mt-5 space-y-4">
          {revenueByProduct.map((r) => (
            <div key={r.product.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-semibold text-foreground">
                  {r.product.name} <span className="font-normal text-muted-foreground">· {r.orders} orders · {r.qty} units</span>
                </span>
                <b className="font-display text-brand">{formatCurrency(r.revenue)}</b>
              </div>
              <div className="h-2.5 rounded-full bg-muted">
                <div className="h-2.5 rounded-full btn-gradient" style={{ width: `${(r.revenue / maxRevenue) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-soft p-6">
          <h3 className="font-display text-lg font-bold text-brand-dark">Orders by Status</h3>
          <div className="mt-5 space-y-3">
            {statusCounts.map((s) => (
              <div key={s.status} className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3 text-sm">
                <StatusPill status={s.status} />
                <b className="font-display text-brand-dark">{s.count}</b>
              </div>
            ))}
          </div>
        </div>
        <div className="card-soft p-6">
          <h3 className="font-display text-lg font-bold text-brand-dark">Route Performance</h3>
          <div className="mt-5 space-y-3">
            {routeStats.map((r) => (
              <div key={r.route.id} className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3 text-sm">
                <span className="font-semibold text-foreground">{r.route.name}</span>
                <span className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{classifyDemand(r.totalOrders)} demand</span>
                  <b className="font-display text-brand">{r.totalOrders} orders</b>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
