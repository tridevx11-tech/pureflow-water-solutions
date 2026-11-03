export type OrderStatus =
  | "Pending"
  | "Approved"
  | "Dispatched"
  | "Delivered"
  | "Rejected";

export type DeliveryStatus = "On Schedule" | "In Transit" | "Completed" | "Delayed";

export type TempoStatus = "Available" | "In Transit" | "Maintenance";

export type DemandLevel = "Low" | "Medium" | "High";

export interface Product {
  id: string;
  name: string;
  capacity: string;
  price: number;
  unit: string;
  description: string;
  image: string;
  tag?: string;
}

export interface DeliveryRoute {
  id: string;
  name: string;
  city: string;
  driver: string;
  tempoNumber: string;
  dealerCount: number;
  pendingOrders: number;
  todaysOrders: number;
  totalCapacity: string;
  deliveryStatus: DeliveryStatus;
}

export interface Dealer {
  id: string;
  name: string;
  owner: string;
  mobile: string;
  email: string;
  gst: string;
  city: string;
  routeId: string;
  monthlyOrders: number;
  status: "Active" | "Inactive";
  lastOrder: string;
}

export interface Order {
  id: string;
  dealerName: string;
  routeId: string;
  routeName: string;
  product: string;
  productId: string;
  quantity: number;
  date: string;
  status: OrderStatus;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  license: string;
  routeName: string;
  status: "On Duty" | "Off Duty" | "On Leave";
}

export interface Tempo {
  id: string;
  number: string;
  driver: string;
  capacity: string;
  currentRoute: string;
  status: TempoStatus;
}

export type NotificationType =
  | "High Demand Alert"
  | "Dealer Registration"
  | "Order Received"
  | "Order Dispatched"
  | "Tempo Assigned"
  | "Delivery Completed";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  rating: number;
  text: string;
  reviewerType: "Dealer" | "Customer";
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  read: boolean;
}

export interface User {
  username: string;
  password: string;
  name: string;
  role: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  active: boolean;
}

export interface DealerRegistration {
  id: string;
  dealerName: string;
  ownerName: string;
  mobile: string;
  email: string;
  gst: string;
  city: string;
  route: string;
  address: string;
  expectedMonthlyOrder: string;
  date: string;
  status: "New" | "Contacted" | "Approved";
}

export interface RouteStat {
  route: DeliveryRoute;
  totalOrders: number;
  level: DemandLevel;
}
