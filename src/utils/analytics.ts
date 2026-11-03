import type { DeliveryRoute, DemandLevel, Order, Product, RouteStat } from "@/data/types";

export function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function countOrdersByRoute(orders: Order[]): Record<string, number> {
  return orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.routeId] = (acc[o.routeId] ?? 0) + 1;
    return acc;
  }, {});
}

/** Low < 10 orders · Medium 10–17 · High 18+ */
export function classifyDemand(totalOrders: number): DemandLevel {
  if (totalOrders < 10) return "Low";
  if (totalOrders < 18) return "Medium";
  return "High";
}

export function getRouteStats(routes: DeliveryRoute[], orders: Order[]): RouteStat[] {
  const counts = countOrdersByRoute(orders);
  return routes
    .map((route) => {
      const totalOrders = counts[route.id] ?? 0;
      return { route, totalOrders, level: classifyDemand(totalOrders) };
    })
    .sort((a, b) => b.totalOrders - a.totalOrders);
}

export function getHighestDemandRoute(stats: RouteStat[]): RouteStat | null {
  const first = stats[0];
  if (!first || first.totalOrders === 0) return null;
  return first;
}

export function groupByDemandLevel(stats: RouteStat[]) {
  return {
    high: stats.filter((s) => s.level === "High"),
    medium: stats.filter((s) => s.level === "Medium"),
    low: stats.filter((s) => s.level === "Low"),
  };
}

export function getRevenue(orders: Order[], products: Product[]) {
  const priceOf = new Map(products.map((p) => [p.id, p.price]));
  return orders.reduce((sum, o) => sum + (priceOf.get(o.productId) ?? 0) * o.quantity, 0);
}
