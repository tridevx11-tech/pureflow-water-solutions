import type { Notification, Testimonial, GalleryItem, ContactMessage, BannerSlide, User, DealerRegistration } from "./types";

import plantImg from "@/assets/gallery-plant.jpg";
import bottlingImg from "@/assets/gallery-bottling.jpg";
import testingImg from "@/assets/gallery-testing.jpg";
import warehouseImg from "@/assets/gallery-warehouse.jpg";
import deliveryImg from "@/assets/gallery-delivery.jpg";
import productsImg from "@/assets/gallery-products.jpg";
import heroBannerImg from "@/assets/hero-banner.jpg";
import galleryPlantImg from "@/assets/gallery-plant.jpg";

export const notifications: Notification[] = [
  {
    id: "n1",
    type: "High Demand Alert",
    title: "New High Demand Alert",
    message:
      "Nagpur Route has received the highest number of orders today (22 orders). Recommended to dispatch the delivery tempo immediately.",
    time: "Today, 09:40 AM",
    read: false,
  },
  {
    id: "n2",
    type: "Order Received",
    title: "Bulk order from Andheri Beverage Hub",
    message: "Andheri Beverage Hub (Mumbai Route) placed 10 × 20L Jar. Order ORD-301 is awaiting approval.",
    time: "Today, 09:05 AM",
    read: false,
  },
  {
    id: "n3",
    type: "Tempo Assigned",
    title: "Tempo MH01 EF 9012 loaded",
    message: "Tempo MH01 EF 9012 has been loaded for the Mumbai Route with 18 orders scheduled.",
    time: "Today, 08:15 AM",
    read: true,
  },
  {
    id: "n4",
    type: "Delivery Completed",
    title: "Hubli Route delivery completed",
    message: "All 6 orders on the Hubli Route were delivered successfully before 11:00 AM.",
    time: "Today, 11:02 AM",
    read: true,
  },
];

export const testimonials: Testimonial[] = [
  { id: "ts1", name: "Mahesh Bhosale", role: "Dealer — Shree Ganesh Water Point", city: "Pune", rating: 5, text: "UDVIJ has never missed a delivery on our route in two years. The jar sealing and quality are consistently excellent, and the dealer support team answers on the first ring.", reviewerType: "Dealer" },
  { id: "ts2", name: "Pooja Raut", role: "Dealer — Sitabuldi Aqua Mart", city: "Nagpur", rating: 5, text: "Daily route delivery is on the dot. On high-demand days the dispatch team sends extra stock before we even ask for it.", reviewerType: "Dealer" },
  { id: "ts3", name: "Ramesh Naik", role: "Dealer — Thane Water World", city: "Mumbai", rating: 4, text: "Transparent pricing and proper GST billing. Monthly settlements are clean and always on time.", reviewerType: "Dealer" },
  { id: "ts4", name: "Basavaraj Itagi", role: "Dealer — Vijayapura City Water", city: "Vijayapura", rating: 5, text: "Their plant testing reports are shared openly with dealers. My customers trust the brand because I can show them the purity data.", reviewerType: "Dealer" },
  { id: "ts5", name: "Anita Deshpande", role: "Customer", city: "Pune", rating: 5, text: "The 20L jars are always sealed and the water tastes genuinely fresh. Delivery arrives the same day I order.", reviewerType: "Customer" },
  { id: "ts6", name: "Karthik Gowda", role: "Customer", city: "Belagavi", rating: 4, text: "We use UDVIJ bottles at our office every day. Clean, crisp and reliably cool — the bottles never leak.", reviewerType: "Customer" },
];

export const gallery: GalleryItem[] = [
  { id: "g1", title: "Manufacturing Plant", category: "Plant", image: plantImg, description: "Fully automated 12,000 LPH plant at Tidagundi, Vijayapura with stainless-steel contact surfaces." },
  { id: "g2", title: "Bottling Line", category: "Bottling", image: bottlingImg, description: "Automatic rinse-fill-cap line producing sealed bottles with zero human contact." },
  { id: "g3", title: "Water Testing Lab", category: "Quality", image: testingImg, description: "In-house lab running hourly physical, chemical and microbiological tests on every batch." },
  { id: "g4", title: "Warehouse", category: "Logistics", image: warehouseImg, description: "Dust-free finished-goods warehouse with batch-wise stock rotation (FIFO)." },
  { id: "g5", title: "Delivery Vehicles", category: "Logistics", image: deliveryImg, description: "Dedicated route tempos covering 7 city routes with trained delivery crews." },
  { id: "g6", title: "Our Products", category: "Products", image: productsImg, description: "The full UDVIJ family — from 250 ml event bottles to 20 L bubble-top jars." },
];

export const messages: ContactMessage[] = [
  { id: "m1", name: "Rohit Sharma", email: "rohit.sharma@example.com", phone: "9812345670", message: "We need a recurring monthly supply of 400 x 20L jars for our hostel. Please share dealer terms.", date: "2026-11-02", read: false },
  { id: "m2", name: "Sneha Kulkarni", email: "sneha.k@example.com", phone: "9876501234", message: "Interested in the Belagavi dealership route. What is the minimum monthly volume?", date: "2026-11-01", read: false },
  { id: "m3", name: "Event Planners Hub", email: "hello@ephub.example.com", phone: "9900112233", message: "Need 5,000 x 250ml bottles for a wedding expo in Pune on 20 Nov. Can you deliver in bulk?", date: "2026-10-30", read: true },
];

export const bannerSlides: BannerSlide[] = [
  { id: "b1", title: "Pure Water. Pure Trust.", subtitle: "Delivered Fresh Every Day — India's Trusted Mineral Water Manufacturer & Distributor.", image: heroBannerImg, active: true },
  { id: "b2", title: "7 City Routes. One Promise.", subtitle: "Pune to Hubli — route-managed delivery that never misses a day.", image: galleryPlantImg, active: false },
  { id: "b3", title: "Become a UDVIJ Dealer", subtitle: "Join 100+ dealers earning with the fastest-growing water brand on NH-52.", image: warehouseImg, active: false },
];

export const users: User[] = [
  { username: "admin", password: "admin123", name: "UDVIJ Admin", role: "Administrator" },
];

export const registrations: DealerRegistration[] = [
  { id: "reg1", dealerName: "Latur Fresh Water Point", ownerName: "Amit Kale", mobile: "9021012345", email: "latur.fw@example.com", gst: "27SSCDE1234F1Z9", city: "Latur", route: "Solapur Route", address: "Main Road, Latur, Maharashtra", expectedMonthlyOrder: "500+ jars", date: "2026-11-01", status: "New" },
];
