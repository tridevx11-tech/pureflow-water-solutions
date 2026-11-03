import type { Order } from "./types";

import { routes } from "./routes";
import { products } from "./products";

/**
 * Deterministic mock order book — one entry per "today's order" on each route,
 * so route analytics (order counts per route) always match the route cards.
 * Generated from fixed patterns (no randomness) to keep SSR and client identical.
 */
const dealerNamesByRoute: Record<string, string[]> = {
  r1: ["Shree Ganesh Water Point", "Kothrud Aqua Agencies", "Hadapsar Fresh Water", "Gokul Shirgaon Enterprises"],
  r2: ["Dharampeth Water House", "Sitabuldi Aqua Mart", "Manish Coca Service"],
  r3: ["Andheri Beverage Hub", "Dadar Pure Drops", "Thane Water World"],
  r4: ["Solapur Zilla Supply", "Hotgi Road Aqua"],
  r5: ["Vijayapura City Water", "Bagalkot Onyx Traders"],
  r6: ["Belagavi Blue Springs", "Khanapur Water Point"],
  r7: ["Hubli Aqua Center", "Dharwad Fresh Supply"],
};

const statusPattern: Order["status"][] = [
  "Delivered",
  "Delivered",
  "Dispatched",
  "Approved",
  "Pending",
  "Delivered",
  "Approved",
  "Pending",
  "Delivered",
  "Dispatched",
];

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export const orders: Order[] = routes.flatMap((route) => {
  const names = dealerNamesByRoute[route.id] ?? [route.city];
  return Array.from({ length: route.todaysOrders }, (_, i) => {
    const product = products[i % products.length] ?? products[0]!;
    const seq = (routes.indexOf(route) + 1) * 100 + i;
    return {
      id: `ORD-${seq}`,
      dealerName: names[i % names.length] ?? route.city,
      routeId: route.id,
      routeName: route.name,
      product: product.name,
      productId: product.id,
      quantity: [2, 5, 10, 3, 8, 1, 4][(seq + i) % 7] ?? 1,
      date: `2026-11-03`,
      status: statusPattern[(seq + i) % statusPattern.length] ?? "Pending",
    };
  });
});

export const orderDates = ["2026-11-03", "2026-11-02", "2026-11-01", "2026-10-31"];

export function formatOrderNo(n: number) {
  return `ORD-${1000 + n}`;
}

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
