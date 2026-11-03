import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useApp } from "@/hooks/useAppStore";
import {
  AddButton,
  EmptyState,
  EntityFormModal,
  FilterSelect,
  IconBtn,
  SectionToolbar,
  field,
  type EntityRecord,
} from "@/components/admin/shared";
import type { BannerSlide, GalleryItem, Testimonial } from "@/data/types";
import plantImg from "@/assets/gallery-plant.jpg";
import bottlingImg from "@/assets/gallery-bottling.jpg";
import testingImg from "@/assets/gallery-testing.jpg";
import warehouseImg from "@/assets/gallery-warehouse.jpg";
import deliveryImg from "@/assets/gallery-delivery.jpg";
import productsImg from "@/assets/gallery-products.jpg";
import heroBannerImg from "@/assets/hero-banner.jpg";

const galleryImageOptions = [
  { value: plantImg, label: "Manufacturing Plant" },
  { value: bottlingImg, label: "Bottling Line" },
  { value: testingImg, label: "Water Testing" },
  { value: warehouseImg, label: "Warehouse" },
  { value: deliveryImg, label: "Delivery Vehicles" },
  { value: productsImg, label: "Products" },
  { value: heroBannerImg, label: "Plant Wide Shot" },
];

/* ------------------------------ Notifications ------------------------------ */

const notifIcon: Record<string, string> = {
  "High Demand Alert": "trophy",
  "Dealer Registration": "users",
  "Order Received": "cart",
  "Order Dispatched": "truck",
  "Tempo Assigned": "truck",
  "Delivery Completed": "check",
};

export function NotificationsSection() {
  const { state, totals, dispatch } = useApp();
  const [typeFilter, setTypeFilter] = useState("all");
  const types = Array.from(new Set(state.notifications.map((n) => n.type)));
  const filtered = state.notifications.filter((n) => typeFilter === "all" || n.type === typeFilter);

  return (
    <div>
      <SectionToolbar title="Notifications" subtitle={`${totals.unreadNotifications} unread of ${state.notifications.length} alerts.`}>
        <FilterSelect
          label="Type"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[{ value: "all", label: "All Types" }, ...types.map((t) => ({ value: t, label: t }))]}
        />
        <button onClick={() => dispatch({ type: "notification/readAll" })} className="rounded-full px-5 py-2.5 text-sm font-bold btn-outline-brand">
          Mark All Read
        </button>
      </SectionToolbar>

      {filtered.length === 0 ? (
        <EmptyState text="No notifications here." />
      ) : (
        <div className="space-y-4">
          {filtered.map((n) => (
            <div key={n.id} className={`card-soft flex flex-wrap items-start justify-between gap-4 p-5 ${n.read ? "opacity-80" : "ring-2 ring-water/60"}`}>
              <div className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-brand">
                  <Icon name={notifIcon[n.type] ?? "bell"} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-brand-dark">{n.title}</h3>
                    {!n.read && <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">New</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">
                    {n.type} · {n.time}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {!n.read && (
                  <button onClick={() => dispatch({ type: "notification/read", id: n.id })} className="rounded-full px-4 py-2 text-xs font-bold btn-outline-brand">
                    Mark as Read
                  </button>
                )}
                <IconBtn icon="trash" label="Delete notification" danger onClick={() => dispatch({ type: "notification/delete", id: n.id })} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Gallery --------------------------------- */

export function GalleryAdminSection() {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState<EntityRecord | null>(null);

  const openNew = () => setEditing({ id: "", title: "", category: "Manufacturing Plant", image: galleryImageOptions[0]!.value, description: "" });

  const save = (record: EntityRecord) => {
    const item: GalleryItem = {
      id: (field(record, "id")) || `g${state.counter + 1}`,
      title: field(record, "title"),
      category: field(record, "category"),
      image: field(record, "image"),
      description: field(record, "description"),
    };
    dispatch({ type: "gallery/save", item });
    setEditing(null);
  };

  const fields = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category", type: "select" as const, options: Array.from(new Set(state.gallery.map((g) => g.category))).map((c) => ({ value: c, label: c })) },
    { key: "image", label: "Image", type: "select" as const, options: galleryImageOptions },
    { key: "description", label: "Description", type: "textarea" as const, full: true, required: false },
  ];

  return (
    <div>
      <SectionToolbar title="Gallery" subtitle="Photos shown in the public gallery.">
        <AddButton onClick={openNew} label="Add Photo" />
      </SectionToolbar>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {state.gallery.map((g) => (
          <div key={g.id} className="card-soft card-lift overflow-hidden">
            <img src={g.image} alt={g.title} className="h-44 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-brand-dark">{g.title}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-aqua">{g.category}</p>
                </div>
                <div className="flex gap-1">
                  <IconBtn icon="edit" label="Edit photo" onClick={() => setEditing({ ...g })} />
                  <IconBtn icon="trash" label="Delete photo" danger onClick={() => dispatch({ type: "gallery/delete", id: g.id })} />
                </div>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{g.description}</p>
            </div>
          </div>
        ))}
      </div>
      {editing && <EntityFormModal title={field(editing, "id") ? "Edit Photo" : "Add Photo"} fields={fields} value={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

/* ------------------------------- Testimonials ------------------------------ */

export function TestimonialsAdminSection() {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState<EntityRecord | null>(null);

  const openNew = () => setEditing({ id: "", name: "", role: "", city: "", rating: "5", text: "", reviewerType: "Dealer" });

  const save = (record: EntityRecord) => {
    const item: Testimonial = {
      id: (field(record, "id")) || `ts${state.counter + 1}`,
      name: field(record, "name"),
      role: field(record, "role"),
      city: field(record, "city"),
      rating: Number(field(record, "rating")),
      text: field(record, "text"),
      reviewerType: field(record, "reviewerType") as Testimonial["reviewerType"],
    };
    dispatch({ type: "testimonial/save", item });
    setEditing(null);
  };

  const fields = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role / Business" },
    { key: "city", label: "City" },
    { key: "rating", label: "Rating", type: "select" as const, options: [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} ★` })) },
    { key: "reviewerType", label: "Reviewer Type", type: "select" as const, options: ["Dealer", "Customer"].map((s) => ({ value: s, label: s })) },
    { key: "text", label: "Review", type: "textarea" as const, full: true },
  ];

  return (
    <div>
      <SectionToolbar title="Testimonials" subtitle="Dealer and customer reviews shown on the website.">
        <AddButton onClick={openNew} label="Add Review" />
      </SectionToolbar>
      <div className="grid gap-5 md:grid-cols-2">
        {state.testimonials.map((t) => (
          <div key={t.id} className="card-soft p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-brand-dark">{t.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.reviewerType} · {t.role}, {t.city}
                </p>
              </div>
              <div className="flex items-center gap-1 text-aqua">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" className={`h-4 w-4 ${i < t.rating ? "fill-current" : "opacity-30"}`} />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">“{t.text}”</p>
            <div className="mt-3 flex gap-1">
              <IconBtn icon="edit" label="Edit review" onClick={() => setEditing({ ...t, rating: String(t.rating) })} />
              <IconBtn icon="trash" label="Delete review" danger onClick={() => dispatch({ type: "testimonial/delete", id: t.id })} />
            </div>
          </div>
        ))}
      </div>
      {editing && <EntityFormModal title={field(editing, "id") ? "Edit Review" : "Add Review"} fields={fields} value={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

/* ------------------------------ Banner Manager ----------------------------- */

export function BannersSection() {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState<EntityRecord | null>(null);

  const openNew = () => setEditing({ id: "", title: "", subtitle: "", image: heroBannerImg, active: "false" });

  const save = (record: EntityRecord) => {
    const item: BannerSlide = {
      id: (field(record, "id")) || `b${state.counter + 1}`,
      title: field(record, "title"),
      subtitle: field(record, "subtitle"),
      image: field(record, "image"),
      active: field(record, "active") === "true",
    };
    dispatch({ type: "banner/save", item });
    if (item.active) {
      state.banners.filter((b) => b.id !== item.id && b.active).forEach((b) => dispatch({ type: "banner/save", item: { ...b, active: false } }));
    }
    setEditing(null);
  };

  const fields = [
    { key: "title", label: "Title" },
    { key: "subtitle", label: "Subtitle" },
    { key: "image", label: "Image", type: "select" as const, options: galleryImageOptions },
    { key: "active", label: "Active Slide", type: "select" as const, options: [{ value: "true", label: "Yes — show on homepage" }, { value: "false", label: "No" }] },
  ];

  return (
    <div>
      <SectionToolbar title="Banner Manager" subtitle="Hero banners for the homepage.">
        <AddButton onClick={openNew} label="Add Banner" />
      </SectionToolbar>
      <div className="grid gap-5 md:grid-cols-2">
        {state.banners.map((b) => (
          <div key={b.id} className={`card-soft overflow-hidden ${b.active ? "ring-2 ring-water" : ""}`}>
            <img src={b.image} alt={b.title} className="h-40 w-full object-cover" />
            <div className="flex items-center justify-between p-5">
              <div>
                <h3 className="font-bold text-brand-dark">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.subtitle}</p>
                {b.active && <span className="mt-2 inline-block rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-primary-foreground">Live on homepage</span>}
              </div>
              <div className="flex gap-1">
                <IconBtn icon="edit" label="Edit banner" onClick={() => setEditing({ ...b, active: b.active ? "true" : "false" })} />
                <IconBtn icon="trash" label="Delete banner" danger onClick={() => dispatch({ type: "banner/delete", id: b.id })} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing && <EntityFormModal title={field(editing, "id") ? "Edit Banner" : "Add Banner"} fields={fields} value={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

/* ------------------------------- Messages ---------------------------------- */

export function MessagesSection() {
  const { state, dispatch } = useApp();
  const unread = state.messages.filter((m) => !m.read).length;

  return (
    <div>
      <SectionToolbar title="Contact Messages" subtitle={`${unread} unread of ${state.messages.length} messages.`} />
      {state.messages.length === 0 ? (
        <EmptyState text="No contact messages yet." />
      ) : (
        <div className="space-y-4">
          {state.messages.map((m) => (
            <div key={m.id} className={`card-soft flex flex-wrap items-start justify-between gap-4 p-5 ${m.read ? "opacity-80" : "ring-2 ring-water/60"}`}>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-brand-dark">{m.name}</h3>
                  {!m.read && <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">New</span>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {m.email} · {m.phone} · {m.date}
                </p>
                <p className="mt-2 text-sm text-foreground">{m.message}</p>
              </div>
              <div className="flex gap-1">
                {!m.read && (
                  <button onClick={() => dispatch({ type: "message/read", id: m.id })} className="rounded-full px-4 py-2 text-xs font-bold btn-outline-brand">
                    Mark as Read
                  </button>
                )}
                <IconBtn icon="trash" label="Delete message" danger onClick={() => dispatch({ type: "message/delete", id: m.id })} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- Settings --------------------------------- */

export function SettingsSection() {
  const { state, dispatch } = useApp();
  const s = state.settings;
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    siteTitle: s.siteTitle,
    tagline: s.tagline,
    phone: s.phone,
    email: s.email,
    address: s.address,
    heroTitle: s.heroTitle,
    heroSubtitle: s.heroSubtitle,
  });
  const set = (k: keyof typeof form, v: string) => {
    setForm({ ...form, [k]: v });
    setSaved(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "settings/update", patch: form });
    setSaved(true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={submit} className="card-soft space-y-4 p-6 lg:col-span-2">
        <h3 className="font-display text-lg font-bold text-brand-dark">Website Settings</h3>
        {(
          [
            ["siteTitle", "Site Title"],
            ["tagline", "Tagline"],
            ["phone", "Phone"],
            ["email", "Email", "email"],
            ["address", "Address"],
          ] as const
        ).map(([k, label, type]) => (
          <label key={k} className="block text-sm font-semibold">
            {label}
            <input type={type ?? "text"} className="input-field mt-1" value={form[k]} onChange={(e) => set(k, e.target.value)} />
          </label>
        ))}
        <label className="block text-sm font-semibold">
          Hero Title (one line per headline row)
          <textarea rows={2} className="input-field mt-1" value={form.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
        </label>
        <label className="block text-sm font-semibold">
          Hero Subtitle
          <textarea rows={3} className="input-field mt-1" value={form.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} />
        </label>
        <div className="flex items-center gap-4">
          <button className="rounded-full px-7 py-3 font-bold btn-gradient">Save Settings</button>
          {saved && <span className="text-sm font-semibold text-success">Settings saved.</span>}
        </div>
      </form>

      <div className="card-soft space-y-4 p-6">
        <h3 className="font-display text-lg font-bold text-brand-dark">Maintenance Mode</h3>
        <p className="text-sm text-muted-foreground">Simulated switch — stores the flag in site settings.</p>
        <button
          onClick={() => dispatch({ type: "settings/update", patch: { maintenanceMode: !s.maintenanceMode } })}
          className={`w-full rounded-full py-3 font-bold ${s.maintenanceMode ? "btn-gradient" : "btn-outline-brand"}`}
        >
          {s.maintenanceMode ? "Maintenance Mode: ON" : "Maintenance Mode: OFF"}
        </button>
      </div>
    </div>
  );
}
