import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import { products as productData } from "@/data/products";
import { routes as routeData } from "@/data/routes";
import { dealers as dealerData } from "@/data/dealers";
import { orders as orderData, formatOrderNo, todayStr } from "@/data/orders";
import { drivers as driverData, tempos as tempoData } from "@/data/fleet";
import {
  notifications as notificationData,
  testimonials as testimonialData,
  gallery as galleryData,
  messages as messageData,
  bannerSlides,
  users,
  registrations as registrationData,
} from "@/data/misc";
import { company } from "@/data/company";
import {
  countOrdersByRoute,
  getHighestDemandRoute,
  getRevenue,
  getRouteStats,
  groupByDemandLevel,
} from "@/utils/analytics";
import type {
  BannerSlide,
  ContactMessage,
  Dealer,
  DealerRegistration,
  DeliveryRoute,
  Driver,
  GalleryItem,
  Notification,
  NotificationType,
  Order,
  OrderStatus,
  Product,
  RouteStat,
  Tempo,
  Testimonial,
} from "@/data/types";

export interface SiteSettings {
  siteTitle: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  maintenanceMode: boolean;
}

interface AppState {
  products: Product[];
  routes: DeliveryRoute[];
  dealers: Dealer[];
  orders: Order[];
  drivers: Driver[];
  tempos: Tempo[];
  notifications: Notification[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  messages: ContactMessage[];
  registrations: DealerRegistration[];
  banners: BannerSlide[];
  settings: SiteSettings;
  isAdmin: boolean;
  counter: number;
}

type Action =
  | { type: "order/add"; dealerName: string; routeId: string; productId: string; quantity: number; date?: string }
  | { type: "order/status"; id: string; status: OrderStatus }
  | { type: "order/delete"; id: string }
  | { type: "registration/add"; data: Omit<DealerRegistration, "id" | "date" | "status"> }
  | { type: "registration/status"; id: string; status: DealerRegistration["status"] }
  | { type: "dealer/save"; item: Dealer }
  | { type: "dealer/delete"; id: string }
  | { type: "product/save"; item: Product }
  | { type: "product/delete"; id: string }
  | { type: "route/save"; item: DeliveryRoute }
  | { type: "route/delete"; id: string }
  | { type: "driver/save"; item: Driver }
  | { type: "driver/delete"; id: string }
  | { type: "tempo/save"; item: Tempo }
  | { type: "tempo/delete"; id: string }
  | { type: "notification/read"; id: string }
  | { type: "notification/readAll" }
  | { type: "notification/delete"; id: string }
  | { type: "gallery/save"; item: GalleryItem }
  | { type: "gallery/delete"; id: string }
  | { type: "testimonial/save"; item: Testimonial }
  | { type: "testimonial/delete"; id: string }
  | { type: "message/add"; data: Omit<ContactMessage, "id" | "date" | "read"> }
  | { type: "message/read"; id: string }
  | { type: "message/delete"; id: string }
  | { type: "banner/save"; item: BannerSlide }
  | { type: "banner/delete"; id: string }
  | { type: "settings/update"; patch: Partial<SiteSettings> }
  | { type: "auth/set"; isAdmin: boolean };

const initialState: AppState = {
  products: productData,
  routes: routeData,
  dealers: dealerData,
  orders: orderData,
  drivers: driverData,
  tempos: tempoData,
  notifications: notificationData,
  testimonials: testimonialData,
  gallery: galleryData,
  messages: messageData,
  registrations: registrationData,
  banners: bannerSlides,
  settings: {
    siteTitle: company.name,
    tagline: company.tagline,
    phone: company.phone,
    email: company.email,
    address: company.address,
    heroTitle: "Pure Water.\nPure Trust.",
    heroSubtitle:
      "India's Trusted Mineral Water Manufacturer & Distributor supplying dealers across multiple city routes with efficient delivery management.",
    maintenanceMode: false,
  },
  isAdmin: false,
  counter: 100,
};

function computeTotals(state: AppState): AppStore["totals"] {
  const completedDeliveries = state.orders.filter((o) => o.status === "Delivered").length;
  const pendingDeliveries = state.orders.filter(
    (o) => o.status === "Pending" || o.status === "Approved" || o.status === "Dispatched",
  ).length;
  const weeklyOrders = state.routes.reduce((s, r) => s + r.todaysOrders, 0) * 6;
  const monthlyOrders = state.routes.reduce((s, r) => s + r.todaysOrders, 0) * 26;
  return {
    dealers: state.dealers.length,
    orders: state.orders.length,
    routes: state.routes.length,
    temposReady: state.tempos.filter((t) => t.status === "Available").length,
    completedDeliveries,
    pendingDeliveries,
    todayRevenue: getRevenue(state.orders, state.products),
    weeklyOrders,
    monthlyOrders,
    unreadNotifications: state.notifications.filter((n) => !n.read).length,
  };
}

function pushNotification(
  state: AppState,
  type: NotificationType,
  title: string,
  message: string,
): { notifications: Notification[]; counter: number } {
  const notification: Notification = {
    id: `n${state.counter + 1}`,
    type,
    title,
    message,
    time: "Just now",
    read: false,
  };
  return { notifications: [notification, ...state.notifications], counter: state.counter + 1 };
}

function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx === -1) return [item, ...list];
  return list.map((x) => (x.id === item.id ? item : x));
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "order/add": {
      const product = state.products.find((p) => p.id === action.productId);
      const route = state.routes.find((r) => r.id === action.routeId);
      if (!product || !route) return state;
      const order: Order = {
        id: formatOrderNo(state.counter + 1),
        dealerName: action.dealerName,
        routeId: action.routeId,
        routeName: route.name,
        product: product.name,
        productId: product.id,
        quantity: action.quantity,
        date: action.date ?? todayStr(),
        status: "Pending",
      };
      const orders = [order, ...state.orders];
      const routes = state.routes.map((r) =>
        r.id === action.routeId
          ? { ...r, todaysOrders: r.todaysOrders + 1, pendingOrders: r.pendingOrders + 1 }
          : r,
      );
      const prevHighest = getHighestDemandRoute(getRouteStats(state.routes, state.orders));
      const newHighest = getHighestDemandRoute(getRouteStats(state.routes, orders));
      let counter = state.counter + 1;
      let notifications = state.notifications;
      if (newHighest && (!prevHighest || prevHighest.route.id !== newHighest.route.id)) {
        const pushed = pushNotification(
          { ...state, counter },
          "High Demand Alert",
          "New High Demand Alert",
          `${newHighest.route.name} has received the highest number of orders today (${newHighest.totalOrders} orders). Recommended to dispatch the delivery tempo immediately.`,
        );
        notifications = pushed.notifications;
        counter = pushed.counter;
      }
      return { ...state, orders, routes, notifications, counter };
    }
    case "order/status": {
      const target = state.orders.find((o) => o.id === action.id);
      if (!target) return state;
      const orders = state.orders.map((o) =>
        o.id === action.id ? { ...o, status: action.status } : o,
      );
      if (action.status === "Dispatched" || action.status === "Delivered") {
        const pushed = pushNotification(
          state,
          action.status === "Dispatched" ? "Order Dispatched" : "Delivery Completed",
          action.status === "Dispatched" ? "Order Dispatched" : "Delivery Completed",
          `Order ${target.id} for ${target.dealerName} (${target.routeName}) is now ${action.status.toLowerCase()}.`,
        );
        return { ...state, orders, notifications: pushed.notifications, counter: pushed.counter };
      }
      return { ...state, orders };
    }
    case "order/delete":
      return { ...state, orders: state.orders.filter((o) => o.id !== action.id) };
    case "registration/add": {
      const registration: DealerRegistration = {
        ...action.data,
        id: `reg${state.counter + 1}`,
        date: todayStr(),
        status: "New",
      };
      const pushed = pushNotification(
        state,
        "Dealer Registration",
        "New Dealer Registration",
        `${registration.dealerName} (${registration.city}) registered interest for the ${registration.route}. Contact ${registration.mobile}.`,
      );
      return {
        ...state,
        registrations: [registration, ...state.registrations],
        notifications: pushed.notifications,
        counter: pushed.counter,
      };
    }
    case "registration/status":
      return {
        ...state,
        registrations: state.registrations.map((r) =>
          r.id === action.id ? { ...r, status: action.status } : r,
        ),
      };
    case "dealer/save":
      return { ...state, dealers: upsert(state.dealers, action.item), counter: state.counter + 1 };
    case "dealer/delete":
      return { ...state, dealers: state.dealers.filter((d) => d.id !== action.id) };
    case "product/save":
      return { ...state, products: upsert(state.products, action.item), counter: state.counter + 1 };
    case "product/delete":
      return { ...state, products: state.products.filter((p) => p.id !== action.id) };
    case "route/save": {
      const routes = upsert(state.routes, action.item);
      const isNew = !state.routes.some((r) => r.id === action.item.id);
      return { ...state, routes, counter: isNew ? state.counter + 1 : state.counter };
    }
    case "route/delete":
      return { ...state, routes: state.routes.filter((r) => r.id !== action.id) };
    case "driver/save":
      return { ...state, drivers: upsert(state.drivers, action.item), counter: state.counter + 1 };
    case "driver/delete":
      return { ...state, drivers: state.drivers.filter((d) => d.id !== action.id) };
    case "tempo/save": {
      const prev = state.tempos.find((t) => t.id === action.item.id);
      const tempos = upsert(state.tempos, action.item);
      if (action.item.currentRoute && prev?.currentRoute !== action.item.currentRoute) {
        const pushed = pushNotification(
          state,
          "Tempo Assigned",
          "Tempo Assigned",
          `Tempo ${action.item.number} (${action.item.driver}) assigned to ${action.item.currentRoute}.`,
        );
        return { ...state, tempos, notifications: pushed.notifications, counter: pushed.counter };
      }
      return { ...state, tempos, counter: state.counter + 1 };
    }
    case "tempo/delete":
      return { ...state, tempos: state.tempos.filter((t) => t.id !== action.id) };
    case "notification/read":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, read: true } : n,
        ),
      };
    case "notification/readAll":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    case "notification/delete":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };
    case "gallery/save":
      return { ...state, gallery: upsert(state.gallery, action.item), counter: state.counter + 1 };
    case "gallery/delete":
      return { ...state, gallery: state.gallery.filter((g) => g.id !== action.id) };
    case "testimonial/save":
      return {
        ...state,
        testimonials: upsert(state.testimonials, action.item),
        counter: state.counter + 1,
      };
    case "testimonial/delete":
      return { ...state, testimonials: state.testimonials.filter((t) => t.id !== action.id) };
    case "message/add": {
      const message: ContactMessage = {
        ...action.data,
        id: `m${state.counter + 1}`,
        date: todayStr(),
        read: false,
      };
      return { ...state, messages: [message, ...state.messages], counter: state.counter + 1 };
    }
    case "message/read":
      return {
        ...state,
        messages: state.messages.map((m) => (m.id === action.id ? { ...m, read: true } : m)),
      };
    case "message/delete":
      return { ...state, messages: state.messages.filter((m) => m.id !== action.id) };
    case "banner/save":
      return { ...state, banners: upsert(state.banners, action.item), counter: state.counter + 1 };
    case "banner/delete":
      return { ...state, banners: state.banners.filter((b) => b.id !== action.id) };
    case "settings/update":
      return { ...state, settings: { ...state.settings, ...action.patch } };
    case "auth/set":
      return { ...state, isAdmin: action.isAdmin };
    default:
      return state;
  }
}

interface AppStore {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  placeOrder: (input: { dealerName: string; routeId: string; productId: string; quantity: number; date?: string }) => void;
  routeStats: RouteStat[];
  highestDemandRoute: RouteStat | null;
  demandGroups: ReturnType<typeof groupByDemandLevel>;
  totals: {
    dealers: number;
    orders: number;
    routes: number;
    temposReady: number;
    completedDeliveries: number;
    pendingDeliveries: number;
    todayRevenue: number;
    weeklyOrders: number;
    monthlyOrders: number;
    unreadNotifications: number;
  };
}

const AppContext = createContext<AppStore | null>(null);

const AUTH_KEY = "udvij-admin-auth";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (window.localStorage.getItem(AUTH_KEY) === "1") {
      dispatch({ type: "auth/set", isAdmin: true });
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(AUTH_KEY, state.isAdmin ? "1" : "0");
  }, [state.isAdmin]);

  const routeStats = useMemo(() => getRouteStats(state.routes, state.orders), [state.routes, state.orders]);
  const highestDemandRoute = useMemo(() => getHighestDemandRoute(routeStats), [routeStats]);
  const demandGroups = useMemo(() => groupByDemandLevel(routeStats), [routeStats]);

  const totals = useMemo(() => computeTotals(state), [state]);

  const value = useMemo<AppStore>(
    () => ({
      state,
      dispatch,
      login: (username, password) => {
        const ok = users.some((u) => u.username === username && u.password === password);
        if (ok) dispatch({ type: "auth/set", isAdmin: true });
        return ok;
      },
      logout: () => dispatch({ type: "auth/set", isAdmin: false }),
      placeOrder: (input) => dispatch({ type: "order/add", ...input }),
      routeStats,
      highestDemandRoute,
      demandGroups,
      totals,
    }),
    [state, routeStats, highestDemandRoute, demandGroups, totals],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Fallback store for transient render passes that run outside AppProvider —
 * e.g. a hot module reload replacing this module (new context identity) while
 * already-mounted components re-render. Rendering the mock seed data keeps the
 * site alive instead of blanking the screen with an error boundary.
 */
let fallbackStore: AppStore | null = null;
function getFallbackStore(): AppStore {
  if (!fallbackStore) {
    const stats = getRouteStats(initialState.routes, initialState.orders);
    fallbackStore = {
      state: initialState,
      dispatch: () => {},
      login: () => false,
      logout: () => {},
      placeOrder: () => {},
      routeStats: stats,
      highestDemandRoute: getHighestDemandRoute(stats),
      demandGroups: groupByDemandLevel(stats),
      totals: computeTotals(initialState),
    };
  }
  return fallbackStore;
}

export function useApp(): AppStore {
  return useContext(AppContext) ?? getFallbackStore();
}

export function countOrdersByRouteId(orders: Order[]) {
  return countOrdersByRoute(orders);
}
