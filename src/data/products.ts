import type { Product } from "./types";

import jarImg from "@/assets/product-jar-20l.png";
import bottle1lImg from "@/assets/product-1l.png";
import bottle500mlImg from "@/assets/product-500ml.png";
import bottle250mlImg from "@/assets/product-250ml.png";
import bottle2lImg from "@/assets/product-2l.png";
import bulkImg from "@/assets/product-bulk.png";

export const products: Product[] = [
  {
    id: "p1",
    name: "20L Jar",
    capacity: "20 Litres",
    price: 80,
    unit: "per jar",
    description:
      "Our flagship bubble-top jar for homes, offices and tea stalls. Sealed, tamper-proof and refill-ready.",
    image: jarImg,
    tag: "Best Seller",
  },
  {
    id: "p2",
    name: "1L Bottle",
    capacity: "1 Litre",
    price: 20,
    unit: "per bottle",
    description:
      "Premium mineral water for retail counters, hotels and travel packs. BIS-certified packaging.",
    image: bottle1lImg,
  },
  {
    id: "p3",
    name: "500ml Bottle",
    capacity: "500 ml",
    price: 15,
    unit: "per bottle",
    description:
      "The everyday carry bottle — ideal for events, offices, institutions and on-the-go hydration.",
    image: bottle500mlImg,
  },
  {
    id: "p4",
    name: "250ml Bottle",
    capacity: "250 ml",
    price: 10,
    unit: "per bottle",
    description:
      "Compact serving bottle for restaurants, catering, airlines and large-scale event supply.",
    image: bottle250mlImg,
  },
  {
    id: "p5",
    name: "2L Bottle",
    capacity: "2 Litres",
    price: 35,
    unit: "per bottle",
    description:
      "Family-size bottle with triple-layer purity seal, perfect for kitchens and small gatherings.",
    image: bottle2lImg,
  },
  {
    id: "p6",
    name: "Bulk Supply",
    capacity: "1,000 Litres",
    price: 1100,
    unit: "per 1000 L",
    description:
      "Food-grade tanker supply for industries, construction sites, hostels and large campuses.",
    image: bulkImg,
    tag: "Dealer Only",
  },
];
