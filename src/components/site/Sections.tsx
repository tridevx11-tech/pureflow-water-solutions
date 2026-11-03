import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { SectionHeading, Waves } from "@/components/site/Layout";
import { useApp } from "@/hooks/useAppStore";
import { company, stats } from "@/data/company";
import heroBanner from "@/assets/hero-banner.jpg";
import bottleHero from "@/assets/bottle-hero.png";
import plantImg from "@/assets/gallery-plant.jpg";
import type { Product } from "@/data/types";
import { formatCurrency } from "@/utils/analytics";

const wrap = "mx-auto max-w-7xl px-4 md:px-6";

export function Hero() {
  const { state } = useApp();
  const banner = state.banners.find((b) => b.active);
  const lines = state.settings.heroTitle.split("\n");
  return (
    <section className="relative overflow-hidden">
      <img src={banner?.image ?? heroBanner} alt="UDVIJ mineral water manufacturing plant" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 hero-gradient opacity-90" />
      <div className={`${wrap} relative grid items-center gap-10 py-20 md:grid-cols-2 md:py-28`}>
        <div className="animate-rise text-primary-foreground">
          <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            <Icon name="drop" className="h-4 w-4 text-water" /> Since 2018 · Vijayapura
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] md:text-6xl">
            {lines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
            <span className="block text-water">Delivered Fresh Every Day.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-primary-foreground/85">{state.settings.heroSubtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/dealer-network" className="rounded-full px-7 py-3.5 font-bold btn-gradient">Become Dealer</Link>
            <Link to="/products" className="rounded-full glass-dark px-7 py-3.5 font-bold text-primary-foreground transition hover:-translate-y-0.5">Explore Products</Link>
          </div>
          <div className="mt-10 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl glass-dark p-3">
                <div className="font-display text-xl font-extrabold">{s.value}</div>
                <div className="text-[11px] leading-tight text-primary-foreground/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute h-80 w-80 rounded-full bg-water/40 blur-3xl" />
          <img src={bottleHero} alt="UDVIJ premium mineral water bottle" className="animate-float relative max-h-[520px] drop-shadow-2xl" />
        </div>
      </div>
      <Waves />
    </section>
  );
}

export function About() {
  return (
    <section className={`${wrap} grid items-center gap-12 py-24 md:grid-cols-2`}>
      <div className="relative">
        <img src={plantImg} alt="UDVIJ plant" className="h-[420px] w-full rounded-[2rem] object-cover shadow-xl" loading="lazy" />
        <div className="absolute -bottom-6 -right-2 rounded-3xl glass-card p-5 md:-right-6">
          <div className="font-display text-3xl font-extrabold text-brand">12,000 LPH</div>
          <div className="text-sm text-muted-foreground">Automated purification capacity</div>
        </div>
      </div>
      <div>
        <SectionHeading center={false} eyebrow="About Company" title="Purity engineered at Tidagundi, Vijayapura" />
        <p className="text-muted-foreground">
          {company.name} manufactures and distributes premium packaged drinking water from our fully automated plant on NH-52. Every drop passes a 9-stage process — from source collection and RO to UV sterilisation and mineral balancing — before it is sealed without human touch.
        </p>
        <p className="mt-4 text-muted-foreground">
          Our route-managed distribution network serves dealers across Maharashtra and Karnataka, with every city run as a dedicated delivery route, its own driver and its own tempo.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {["BIS & FSSAI compliant", "In-house testing lab", "Zero-touch bottling", "Daily route deliveries"].map((t) => (
            <li key={t} className="flex items-center gap-2 font-semibold text-foreground">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-success/15 text-success"><Icon name="check" className="h-4 w-4" /></span>{t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const steps = ["Water Collection", "Purification", "RO Treatment", "UV Treatment", "Mineral Balancing", "Quality Testing", "Automatic Bottling", "Packaging", "Dispatch"];
const stepIcons = ["drop", "flask", "shield", "sun", "drop", "flask", "factory", "box", "truck"];

export function Process() {
  return (
    <section className="bg-muted/60 py-24">
      <div className={wrap}>
        <SectionHeading eyebrow="Manufacturing Process" title="9 steps from source to your shelf" subtitle="Every bottle follows the same audited journey." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s} className="relative card-soft card-lift p-6">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl btn-gradient"><Icon name={stepIcons[i] ?? "drop"} /></span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-aqua">Step {i + 1}</div>
                  <div className="font-display text-lg font-bold text-brand-dark">{s}</div>
                </div>
              </div>
              {i < steps.length - 1 && <div className="absolute -bottom-4 left-1/2 hidden h-4 w-0.5 bg-water sm:block lg:hidden" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const reasons = [
  { icon: "shield", title: "Certified Purity", text: "BIS & FSSAI certified with hourly lab testing on every batch." },
  { icon: "route", title: "Route-Managed Delivery", text: "Each city is a dedicated route with its own tempo and driver." },
  { icon: "truck", title: "Daily Fresh Dispatch", text: "Smart demand analytics send tempos where orders peak." },
  { icon: "users", title: "Dealer-First Pricing", text: "Healthy margins and transparent slab pricing for partners." },
  { icon: "factory", title: "Automated Plant", text: "Zero-touch rinse-fill-cap lines eliminate contamination." },
  { icon: "drop", title: "Balanced Minerals", text: "Calcium & magnesium balanced for a crisp, fresh taste." },
];

export function WhyChoose() {
  return (
    <section className={`${wrap} py-24`}>
      <SectionHeading eyebrow="Why Choose Us" title="Trusted by 100+ dealers on 7 routes" />
      <div className="grid gap-6 md:grid-cols-3">
        {reasons.map((r) => (
          <div key={r.title} className="card-soft card-lift p-7">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-brand"><Icon name={r.icon} className="h-6 w-6" /></span>
            <h3 className="mt-5 text-xl font-bold text-brand-dark">{r.title}</h3>
            <p className="mt-2 text-muted-foreground">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function OrderModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { state, placeOrder } = useApp();
  const [dealer, setDealer] = useState(state.dealers[0]?.name ?? "");
  const [qty, setQty] = useState(10);
  const [done, setDone] = useState(false);
  const d = state.dealers.find((x) => x.name === dealer);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!d) return;
    placeOrder({ dealerName: d.name, routeId: d.routeId, productId: product.id, quantity: qty });
    setDone(true);
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl animate-rise" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success"><Icon name="check" className="h-7 w-7" /></span>
            <h3 className="mt-4 text-xl font-bold text-brand-dark">Order placed!</h3>
            <p className="mt-2 text-muted-foreground">{qty} × {product.name} added to {state.routes.find((r) => r.id === d?.routeId)?.name}.</p>
            <button onClick={onClose} className="mt-6 rounded-full px-6 py-2.5 font-bold btn-gradient">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <h3 className="text-xl font-bold text-brand-dark">Order {product.name}</h3>
            <label className="block text-sm font-semibold">Dealer
              <select className="input-field mt-1" value={dealer} onChange={(e) => setDealer(e.target.value)}>
                {state.dealers.map((x) => <option key={x.id}>{x.name}</option>)}
              </select>
            </label>
            <p className="text-sm text-muted-foreground">Route: <b>{state.routes.find((r) => r.id === d?.routeId)?.name ?? "—"}</b></p>
            <label className="block text-sm font-semibold">Quantity
              <input type="number" min={1} className="input-field mt-1" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
            </label>
            <p className="font-semibold">Total: {formatCurrency(qty * product.price)}</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5 font-semibold btn-outline-brand">Cancel</button>
              <button className="rounded-full px-5 py-2.5 font-bold btn-gradient">Place Order</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function ProductsGrid({ heading = true }: { heading?: boolean }) {
  const { state } = useApp();
  const [active, setActive] = useState<Product | null>(null);
  return (
    <section className={`${wrap} py-24`}>
      {heading && <SectionHeading eyebrow="Products" title="A size for every need" subtitle="From event bottles to bulk tanker supply." />}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {state.products.map((p) => (
          <div key={p.id} className="group card-soft card-lift overflow-hidden">
            <div className="relative grid h-60 place-items-center bg-gradient-to-b from-accent to-card">
              {p.tag && <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-bold text-primary-foreground">{p.tag}</span>}
              <img src={p.image} alt={p.name} className="h-52 object-contain transition duration-500 group-hover:scale-105" loading="lazy" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-brand-dark">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.capacity}</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-extrabold text-brand">{formatCurrency(p.price)}</div>
                  <div className="text-xs text-muted-foreground">{p.unit}</div>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
              <button onClick={() => setActive(p)} className="mt-5 w-full rounded-full py-3 font-bold btn-gradient">Order Now</button>
            </div>
          </div>
        ))}
      </div>
      {active && <OrderModal product={active} onClose={() => setActive(null)} />}
    </section>
  );
}

export function DemandBadge({ level }: { level: string }) {
  const cls = level === "High" ? "demand-high" : level === "Medium" ? "demand-medium" : "demand-low";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>{level}</span>;
}

export function RouteNetwork() {
  const { routeStats, highestDemandRoute } = useApp();
  const max = Math.max(1, ...routeStats.map((r) => r.totalOrders));
  return (
    <section className="bg-muted/60 py-24">
      <div className={wrap}>
        <SectionHeading eyebrow="Route Network" title="Every city is a dedicated delivery route" subtitle="Live order counts update as dealers place orders." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {routeStats.map(({ route, totalOrders, level }) => (
            <div key={route.id} className={`card-soft card-lift p-6 ${highestDemandRoute?.route.id === route.id ? "ring-2 ring-water" : ""}`}>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-brand-dark"><Icon name="route" className="h-5 w-5 text-aqua" />{route.name}</h3>
                <DemandBadge level={level} />
              </div>
              <p className="text-sm text-muted-foreground">{route.city}</p>
              <div className="mt-4 h-2.5 rounded-full bg-muted">
                <div className="h-2.5 rounded-full btn-gradient" style={{ width: `${(totalOrders / max) * 100}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div><div className="font-display text-xl font-bold text-brand">{totalOrders}</div><div className="text-muted-foreground">Orders</div></div>
                <div><div className="font-display text-xl font-bold text-brand">{route.dealerCount}</div><div className="text-muted-foreground">Dealers</div></div>
                <div><div className="text-xs font-bold text-foreground">{route.tempoNumber}</div><div className="text-muted-foreground">{route.deliveryStatus}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DealerBenefits() {
  const items = [
    ["Up to 30% margins", "Slab pricing that grows with your volume."],
    ["Guaranteed daily supply", "Your route tempo arrives on schedule, every day."],
    ["Marketing support", "Branded displays, signage and local promotions."],
    ["Exclusive territory", "Protected dealer zones on every route."],
  ];
  return (
    <section className={`${wrap} py-24`}>
      <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] hero-gradient p-10 text-primary-foreground md:grid-cols-2 md:p-14">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-water">Dealer Benefits</p>
          <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Grow your business with UDVIJ</h2>
          <p className="mt-4 text-primary-foreground/80">Join our dealer network and get a reliable, premium product with route-managed delivery.</p>
          <Link to="/dealer-network" className="mt-8 inline-flex rounded-full bg-background px-7 py-3.5 font-bold text-brand-dark transition hover:-translate-y-0.5">Register as Dealer</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(([t, d]) => (
            <div key={t} className="rounded-2xl glass-dark p-5">
              <Icon name="check" className="h-6 w-6 text-water" />
              <h3 className="mt-3 font-bold">{t}</h3>
              <p className="mt-1 text-sm text-primary-foreground/75">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { state } = useApp();
  return (
    <section className="bg-muted/60 py-24">
      <div className={wrap}>
        <SectionHeading eyebrow="Testimonials" title="What dealers & customers say" />
        <div className="grid gap-6 md:grid-cols-3">
          {state.testimonials.map((t) => (
            <figure key={t.id} className="card-soft card-lift p-7">
              <div className="flex gap-1 text-aqua">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" className={`h-4 w-4 ${i < t.rating ? "fill-current" : "opacity-30"}`} />
                ))}
              </div>
              <blockquote className="mt-4 text-foreground">“{t.text}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full btn-gradient font-bold">{t.name[0]}</span>
                <span>
                  <span className="block font-bold text-brand-dark">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.reviewerType} · {t.role}, {t.city}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GalleryGrid({ heading = true }: { heading?: boolean }) {
  const { state } = useApp();
  const cats = ["All", ...Array.from(new Set(state.gallery.map((g) => g.category)))];
  const [cat, setCat] = useState("All");
  const items = state.gallery.filter((g) => cat === "All" || g.category === cat);
  return (
    <section className={`${wrap} py-24`}>
      {heading && <SectionHeading eyebrow="Gallery" title="Inside UDVIJ" />}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${cat === c ? "btn-gradient" : "bg-muted text-muted-foreground hover:bg-accent"}`}>{c}</button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g) => (
          <div key={g.id} className="group relative h-72 overflow-hidden rounded-3xl">
            <img src={g.image} alt={g.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-x-3 bottom-3 rounded-2xl glass-card p-4">
              <h3 className="font-bold text-brand-dark">{g.title}</h3>
              <p className="line-clamp-1 text-xs text-muted-foreground">{g.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContactSection() {
  const { state, dispatch } = useApp();
  const s = state.settings;
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    dispatch({ type: "message/add", data: form });
    setForm({ name: "", email: "", phone: "", message: "" });
    setSent(true);
  };
  return (
    <section className={`${wrap} py-24`}>
      <SectionHeading eyebrow="Contact" title="Let's talk water" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="relative grid h-64 place-items-center overflow-hidden rounded-3xl bg-accent">
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="relative text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full btn-gradient animate-float"><Icon name="pin" className="h-7 w-7" /></span>
              <p className="mt-3 font-bold text-brand-dark">Map — Tidagundi, Vijayapura</p>
            </div>
          </div>
          {[["pin", s.address], ["phone", s.phone], ["mail", s.email]].map(([i, v]) => (
            <div key={i} className="flex items-center gap-4 card-soft p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-brand"><Icon name={i ?? "drop"} /></span>
              <span className="font-semibold text-foreground">{v}</span>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="card-soft space-y-4 p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Your name" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required type="tel" placeholder="Phone" className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <input required type="email" placeholder="Email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <textarea required rows={6} placeholder="How can we help?" className="input-field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button className="w-full rounded-full py-3.5 font-bold btn-gradient">Send Message</button>
          {sent && <p className="rounded-xl bg-success/10 p-3 text-center text-sm font-semibold text-success">Thank you! Our team will get back to you shortly.</p>}
        </form>
      </div>
    </section>
  );
}

export function DealerForm() {
  const { state, dispatch } = useApp();
  const empty = { dealerName: "", ownerName: "", mobile: "", email: "", gst: "", city: "", route: state.routes[0]?.name ?? "", address: "", expectedMonthlyOrder: "" };
  const [f, setF] = useState(empty);
  const [ok, setOk] = useState(false);
  const field = (k: keyof typeof empty, label: string, type = "text") => (
    <label className="block text-sm font-semibold text-foreground">{label}
      <input required={k !== "gst"} type={type} className="input-field mt-1" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
    </label>
  );
  const submit = (e: FormEvent) => {
    e.preventDefault();
    dispatch({ type: "registration/add", data: f });
    setF(empty);
    setOk(true);
  };
  return (
    <section className={`${wrap} py-20`}>
      <form onSubmit={submit} className="mx-auto max-w-3xl card-soft p-8 md:p-10">
        <h2 className="text-2xl font-extrabold text-brand-dark">Dealer Registration</h2>
        <p className="mt-1 text-muted-foreground">Fill in your details and our team will contact you within 24 hours.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {field("dealerName", "Dealer Name")}
          {field("ownerName", "Owner Name")}
          {field("mobile", "Mobile", "tel")}
          {field("email", "Email", "email")}
          {field("gst", "GST (optional)")}
          {field("city", "City")}
          <label className="block text-sm font-semibold text-foreground">Route
            <select className="input-field mt-1" value={f.route} onChange={(e) => setF({ ...f, route: e.target.value })}>
              {state.routes.map((r) => <option key={r.id}>{r.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-foreground">Expected Monthly Order
            <select required className="input-field mt-1" value={f.expectedMonthlyOrder} onChange={(e) => setF({ ...f, expectedMonthlyOrder: e.target.value })}>
              <option value="">Select</option>
              {["Under 100 jars", "100–300 jars", "300–500 jars", "500+ jars"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-foreground sm:col-span-2">Address
            <textarea required rows={3} className="input-field mt-1" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
          </label>
        </div>
        <button className="mt-6 w-full rounded-full py-3.5 font-bold btn-gradient">Submit Registration</button>
        {ok && <p className="mt-4 rounded-xl bg-success/10 p-3 text-center text-sm font-semibold text-success">Registration received! We'll call you soon.</p>}
      </form>
    </section>
  );
}
