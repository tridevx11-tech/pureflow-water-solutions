import { describe, expect, it } from "vitest";
import { classifyDemand, getHighestDemandRoute, getRevenue, getRouteStats } from "@/utils/analytics";
import type { DeliveryRoute, Order, Product } from "@/data/types";

const route = (id: string, name: string): DeliveryRoute => ({
  id,
  name,
  city: name,
  driver: "Driver",
  tempoNumber: "MH12 AB 1234",
  dealerCount: 1,
  pendingOrders: 0,
  todaysOrders: 0,
  totalCapacity: "1,000 L/day",
  deliveryStatus: "On Schedule",
});

const order = (id: string, routeId: string, productId = "p1", quantity = 1): Order => ({
  id,
  dealerName: "Dealer",
  routeId,
  routeName: routeId,
  product: "20L Jar",
  productId,
  quantity,
  date: "2026-11-03",
  status: "Pending",
});

describe("route demand classification", () => {
  it("classifies routes with fewer than 10 orders as Low", () => {
    expect(classifyDemand(9)).toBe("Low");
  });

  it("classifies routes with 10-17 orders as Medium", () => {
    expect(classifyDemand(10)).toBe("Medium");
    expect(classifyDemand(17)).toBe("Medium");
  });

  it("classifies routes with 18+ orders as High", () => {
    expect(classifyDemand(18)).toBe("High");
    expect(classifyDemand(22)).toBe("High");
  });

  it("ranks routes by highest order count and highlights the top route", () => {
    const routes = [route("r1", "Pune Route"), route("r2", "Nagpur Route"), route("r4", "Solapur Route")];
    const orders = [
      ...Array.from({ length: 15 }, (_, i) => order(`o${i}`, "r1")),
      ...Array.from({ length: 22 }, (_, i) => order(`n${i}`, "r2")),
      ...Array.from({ length: 7 }, (_, i) => order(`s${i}`, "r4")),
    ];
    const stats = getRouteStats(routes, orders);
    expect(stats[0]?.route.id).toBe("r2");
    expect(stats[0]?.totalOrders).toBe(22);
    expect(stats[0]?.level).toBe("High");
    expect(getHighestDemandRoute(stats)?.route.name).toBe("Nagpur Route");
  });

  it("returns no recommended route when there are no orders", () => {
    expect(getHighestDemandRoute(getRouteStats([route("r1", "Pune Route")], []))).toBeNull();
  });

  it("computes revenue from order quantities and product prices", () => {
    const products: Product[] = [{ id: "p1", name: "20L Jar", capacity: "20 Litres", price: 80, unit: "per jar", description: "", image: "" }];
    expect(getRevenue([order("o1", "r1", "p1", 10), order("o2", "r1", "p1", 5)], products)).toBe(1200);
  });
});
