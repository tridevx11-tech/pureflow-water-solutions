import { useState } from "react";
import { useApp } from "@/hooks/useAppStore";
import { formatCurrency } from "@/utils/analytics";
import { DemandBadge } from "@/components/site/Sections";
import {
  AddButton,
  EntityFormModal,
  EmptyState,
  FilterSelect,
  IconBtn,
  Modal,
  SectionToolbar,
  StatusPill,
  field,
  type EntityRecord,
} from "@/components/admin/shared";
import type { Dealer, DeliveryRoute, Driver, Order, OrderStatus, Product, Tempo } from "@/data/types";
import jarImg from "@/assets/product-jar-20l.png";
import bottle1lImg from "@/assets/product-1l.png";
import bottle500mlImg from "@/assets/product-500ml.png";
import bottle250mlImg from "@/assets/product-250ml.png";
import bottle2lImg from "@/assets/product-2l.png";
import bulkImg from "@/assets/product-bulk.png";

const productImageOptions = [
  { value: jarImg, label: "20L Jar" },
  { value: bottle1lImg, label: "1L Bottle" },
  { value: bottle500mlImg, label: "500ml Bottle" },
  { value: bottle250mlImg, label: "250ml Bottle" },
  { value: bottle2lImg, label: "2L Bottle" },
  { value: bulkImg, label: "Bulk Supply" },
];

/* ---------------------------------- Orders --------------------------------- */

export function OrdersSection() {
  const { state, placeOrder, dispatch } = useApp();
  const [routeFilter, setRouteFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [adding, setAdding] = useState(false);
  const [newOrder, setNewOrder] = useState({ dealerId: state.dealers[0]?.id ?? "", productId: state.products[0]?.id ?? "", quantity: "10", date: "" });

  const filtered = state.orders.filter(
    (o) =>
      (routeFilter === "all" || o.routeId === routeFilter) &&
      (statusFilter === "all" || o.status === statusFilter) &&
      (!dateFilter || o.date === dateFilter),
  );

  const advance: Partial<Record<OrderStatus, OrderStatus[]>> = {
    Pending: ["Approved", "Rejected"],
    Approved: ["Dispatched"],
    Dispatched: ["Delivered"],
  };

  const submitNew = (e: React.FormEvent) => {
    e.preventDefault();
    const dealer = state.dealers.find((d) => d.id === newOrder.dealerId);
    if (!dealer) return;
    placeOrder({
      dealerName: dealer.name,
      routeId: dealer.routeId,
      productId: newOrder.productId,
      quantity: Math.max(1, Number(newOrder.quantity)),
      ...(newOrder.date ? { date: newOrder.date } : {}),
    });
    setAdding(false);
  };

  const actions = (o: Order) => (
    <span className="flex items-center gap-1">
      {advance[o.status]?.map((next) => (
        <button
          key={next}
          onClick={() => dispatch({ type: "order/status", id: o.id, status: next })}
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${next === "Rejected" ? "btn-outline-brand" : "btn-gradient"}`}
        >
          {next}
        </button>
      ))}
      <IconBtn icon="trash" label="Delete order" danger onClick={() => dispatch({ type: "order/delete", id: o.id })} />
    </span>
  );

  return (
    <div>
      <SectionToolbar title="Manage Orders" subtitle="Approve, dispatch and track dealer orders.">
        <AddButton onClick={() => setAdding(true)} label="Add Order" />
      </SectionToolbar>

      <div className="mb-5 flex flex-wrap items-end gap-3 card-soft p-4">
        <FilterSelect
          label="Route"
          value={routeFilter}
          onChange={setRouteFilter}
          options={[{ value: "all", label: "All Routes" }, ...state.routes.map((r) => ({ value: r.id, label: r.name }))]}
        />
        <FilterSelect
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Statuses" },
            ...(["Pending", "Approved", "Dispatched", "Delivered", "Rejected"] as const).map((s) => ({ value: s, label: s })),
          ]}
        />
        <FilterSelect label="Date" value={dateFilter} onChange={setDateFilter} options={[{ value: "", label: "Any Date" }, ...Array.from(new Set(state.orders.map((o) => o.date))).map((d) => ({ value: d, label: d }))]} />
        <span className="ml-auto text-sm font-semibold text-muted-foreground">{filtered.length} orders</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState text="No orders match these filters." />
      ) : (
        <div className="card-soft overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Dealer</th>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Qty</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => (
                <tr key={o.id} className="transition hover:bg-accent/40">
                  <td className="px-5 py-3 font-semibold text-brand-dark">{o.id}</td>
                  <td className="px-5 py-3">{o.dealerName}</td>
                  <td className="px-5 py-3">{o.routeName}</td>
                  <td className="px-5 py-3">{o.product}</td>
                  <td className="px-5 py-3">{o.quantity}</td>
                  <td className="px-5 py-3 text-muted-foreground">{o.date}</td>
                  <td className="px-5 py-3">
                    <StatusPill status={o.status} />
                  </td>
                  <td className="px-5 py-3">{actions(o)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {adding && (
        <Modal title="Add Order" onClose={() => setAdding(false)}>
          <form onSubmit={submitNew} className="space-y-4">
            <label className="block text-sm font-semibold">
              Dealer
              <select className="input-field mt-1" value={newOrder.dealerId} onChange={(e) => setNewOrder({ ...newOrder, dealerId: e.target.value })}>
                {state.dealers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {state.routes.find((r) => r.id === d.routeId)?.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Product
              <select className="input-field mt-1" value={newOrder.productId} onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })}>
                {state.products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {formatCurrency(p.price)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Quantity
              <input type="number" min={1} required className="input-field mt-1" value={newOrder.quantity} onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })} />
            </label>
            <label className="block text-sm font-semibold">
              Date (optional)
              <input type="date" className="input-field mt-1" value={newOrder.date} onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })} />
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setAdding(false)} className="rounded-full px-5 py-2.5 font-semibold btn-outline-brand">
                Cancel
              </button>
              <button className="rounded-full px-6 py-2.5 font-bold btn-gradient">Place Order</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ---------------------------------- Routes --------------------------------- */

export function RoutesSection() {
  const { state, routeStats, dispatch } = useApp();
  const [editing, setEditing] = useState<EntityRecord | null>(null);
  const max = Math.max(1, ...routeStats.map((r) => r.totalOrders));

  const openNew = () =>
    setEditing({
      id: "",
      name: "",
      city: "",
      driver: state.drivers[0]?.name ?? "",
      tempoNumber: state.tempos[0]?.number ?? "",
      dealerCount: 0,
      pendingOrders: 0,
      todaysOrders: 0,
      totalCapacity: "3,000 L/day",
      deliveryStatus: "On Schedule",
    });

  const save = (record: EntityRecord) => {
    const item: DeliveryRoute = {
      id: (field(record, "id")) || `r${state.counter + 1}`,
      name: field(record, "name"),
      city: field(record, "city"),
      driver: field(record, "driver"),
      tempoNumber: field(record, "tempoNumber"),
      dealerCount: Number(field(record, "dealerCount")),
      pendingOrders: Number(field(record, "pendingOrders")),
      todaysOrders: Number(field(record, "todaysOrders")),
      totalCapacity: field(record, "totalCapacity"),
      deliveryStatus: field(record, "deliveryStatus") as DeliveryRoute["deliveryStatus"],
    };
    dispatch({ type: "route/save", item });
    setEditing(null);
  };

  const fields = [
    { key: "name", label: "Route Name" },
    { key: "city", label: "City" },
    { key: "driver", label: "Assigned Driver", type: "select" as const, options: state.drivers.map((d) => ({ value: d.name, label: d.name })) },
    { key: "tempoNumber", label: "Assigned Tempo", type: "select" as const, options: state.tempos.map((t) => ({ value: t.number, label: t.number })) },
    { key: "dealerCount", label: "Dealer Count", type: "number" as const },
    { key: "pendingOrders", label: "Pending Orders", type: "number" as const },
    { key: "todaysOrders", label: "Today's Orders", type: "number" as const },
    { key: "totalCapacity", label: "Total Capacity" },
    { key: "deliveryStatus", label: "Delivery Status", type: "select" as const, options: ["On Schedule", "In Transit", "Completed", "Delayed"].map((s) => ({ value: s, label: s })) },
  ];

  return (
    <div>
      <SectionToolbar title="Manage Routes" subtitle="Add routes, assign drivers and tempos, and watch performance.">
        <AddButton onClick={openNew} label="Add Route" />
      </SectionToolbar>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {routeStats.map(({ route, totalOrders, level }) => (
          <div key={route.id} className="card-soft card-lift p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-brand-dark">{route.name}</h3>
                <p className="text-sm text-muted-foreground">{route.city}</p>
              </div>
              <DemandBadge level={level} />
            </div>
            <div className="mt-4 h-2.5 rounded-full bg-muted">
              <div className="h-2.5 rounded-full btn-gradient" style={{ width: `${(totalOrders / max) * 100}%` }} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {[
                ["Driver", route.driver],
                ["Tempo", route.tempoNumber],
                ["Dealers", String(route.dealerCount)],
                ["Pending", String(route.pendingOrders)],
                ["Today's Orders", String(totalOrders)],
                ["Capacity", route.totalCapacity],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-muted/60 px-3 py-2">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="font-semibold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-center justify-between">
              <StatusPill status={route.deliveryStatus} />
              <div className="flex gap-1">
                <IconBtn icon="edit" label="Edit route" onClick={() => setEditing({ ...route })} />
                <IconBtn icon="trash" label="Delete route" danger onClick={() => dispatch({ type: "route/delete", id: route.id })} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <EntityFormModal
          title={field(editing, "id") ? "Edit Route" : "Add Route"}
          fields={fields}
          value={editing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

/* --------------------------------- Dealers --------------------------------- */

export function DealersSection() {
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState<"dealers" | "registrations">("dealers");
  const [editing, setEditing] = useState<EntityRecord | null>(null);

  const openNew = () =>
    setEditing({
      id: "",
      name: "",
      owner: "",
      mobile: "",
      email: "",
      gst: "",
      city: "",
      routeId: state.routes[0]?.id ?? "",
      monthlyOrders: 0,
      status: "Active",
      lastOrder: "",
    });

  const save = (record: EntityRecord) => {
    const item: Dealer = {
      id: (field(record, "id")) || `d${state.counter + 1}`,
      name: field(record, "name"),
      owner: field(record, "owner"),
      mobile: field(record, "mobile"),
      email: field(record, "email"),
      gst: field(record, "gst"),
      city: field(record, "city"),
      routeId: field(record, "routeId"),
      monthlyOrders: Number(field(record, "monthlyOrders")),
      status: field(record, "status") as Dealer["status"],
      lastOrder: field(record, "lastOrder"),
    };
    dispatch({ type: "dealer/save", item });
    setEditing(null);
  };

  const fields = [
    { key: "name", label: "Dealer Name" },
    { key: "owner", label: "Owner Name" },
    { key: "mobile", label: "Mobile", type: "tel" as const },
    { key: "email", label: "Email", type: "email" as const },
    { key: "gst", label: "GST" },
    { key: "city", label: "City" },
    { key: "routeId", label: "Assigned Route", type: "select" as const, options: state.routes.map((r) => ({ value: r.id, label: r.name })) },
    { key: "monthlyOrders", label: "Monthly Orders", type: "number" as const },
    { key: "status", label: "Status", type: "select" as const, options: ["Active", "Inactive"].map((s) => ({ value: s, label: s })) },
    { key: "lastOrder", label: "Last Order (YYYY-MM-DD)" },
  ];

  return (
    <div>
      <SectionToolbar title="Manage Dealers" subtitle="Dealer directory and incoming registration requests.">
        <div className="flex rounded-full bg-muted p-1 text-sm font-bold">
          {(["dealers", "registrations"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 capitalize transition ${tab === t ? "btn-gradient" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t}
              {t === "registrations" && state.registrations.length > 0 && ` (${state.registrations.filter((r) => r.status === "New").length})`}
            </button>
          ))}
        </div>
        {tab === "dealers" && <AddButton onClick={openNew} label="Add Dealer" />}
      </SectionToolbar>

      {tab === "dealers" ? (
        <div className="card-soft overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Dealer</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Monthly Orders</th>
                <th className="px-5 py-3">Last Order</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {state.dealers.map((d) => (
                <tr key={d.id} className="transition hover:bg-accent/40">
                  <td className="px-5 py-3 font-semibold text-brand-dark">{d.name}</td>
                  <td className="px-5 py-3">{d.owner}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {d.mobile}
                    <br />
                    {d.email}
                  </td>
                  <td className="px-5 py-3">{state.routes.find((r) => r.id === d.routeId)?.name ?? "—"}</td>
                  <td className="px-5 py-3">{d.monthlyOrders}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.lastOrder || "—"}</td>
                  <td className="px-5 py-3">
                    <StatusPill status={d.status} />
                  </td>
                  <td className="px-5 py-3">
                    <IconBtn icon="edit" label="Edit dealer" onClick={() => setEditing({ ...d })} />
                    <IconBtn icon="trash" label="Delete dealer" danger onClick={() => dispatch({ type: "dealer/delete", id: d.id })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          {state.registrations.length === 0 && <EmptyState text="No dealer registrations yet." />}
          {state.registrations.map((r) => (
            <div key={r.id} className="card-soft flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <h3 className="font-bold text-brand-dark">{r.dealerName}</h3>
                <p className="text-sm text-muted-foreground">
                  {r.ownerName} · {r.city} · {r.route} · {r.expectedMonthlyOrder}
                </p>
                <p className="text-sm text-muted-foreground">
                  {r.mobile} · {r.email} {r.gst && `· GST ${r.gst}`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{r.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={r.status} />
                <select className="input-field w-auto" value={r.status} onChange={(e) => dispatch({ type: "registration/status", id: r.id, status: e.target.value as "New" | "Contacted" | "Approved" })}>
                  {["New", "Contacted", "Approved"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <EntityFormModal title={field(editing, "id") ? "Edit Dealer" : "Add Dealer"} fields={fields} value={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

/* --------------------------------- Products -------------------------------- */

export function ProductsSection() {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState<EntityRecord | null>(null);

  const openNew = () => setEditing({ id: "", name: "", capacity: "", price: 20, unit: "per bottle", description: "", tag: "", image: productImageOptions[0]!.value });

  const save = (record: EntityRecord) => {
    const item: Product = {
      id: field(record, "id") || `p${state.counter + 1}`,
      name: field(record, "name"),
      capacity: field(record, "capacity"),
      price: Number(field(record, "price")),
      unit: field(record, "unit"),
      description: field(record, "description"),
      image: field(record, "image"),
      ...(field(record, "tag") ? { tag: field(record, "tag") } : {}),
    };
    dispatch({ type: "product/save", item });
    setEditing(null);
  };

  const fields = [
    { key: "name", label: "Product Name" },
    { key: "capacity", label: "Capacity" },
    { key: "price", label: "Price (₹)", type: "number" as const },
    { key: "unit", label: "Unit" },
    { key: "tag", label: "Tag (optional)", required: false },
    { key: "image", label: "Image", type: "select" as const, options: productImageOptions },
    { key: "description", label: "Description", type: "textarea" as const, full: true, required: false },
  ];

  return (
    <div>
      <SectionToolbar title="Manage Products" subtitle="Pricing and catalogue shown on the website.">
        <AddButton onClick={openNew} label="Add Product" />
      </SectionToolbar>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {state.products.map((p) => (
          <div key={p.id} className="card-soft card-lift p-5">
            <div className="grid h-40 place-items-center rounded-2xl bg-accent/60">
              <img src={p.image} alt={p.name} className="h-32 object-contain" />
            </div>
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h3 className="font-bold text-brand-dark">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.capacity}</p>
              </div>
              <div className="text-right">
                <div className="font-display text-xl font-extrabold text-brand">{formatCurrency(p.price)}</div>
                <div className="text-xs text-muted-foreground">{p.unit}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              {p.tag ? <StatusPill status={p.tag} /> : <span />}
              <div className="flex gap-1">
                <IconBtn icon="edit" label="Edit product" onClick={() => setEditing({ ...p, tag: p.tag ?? "" })} />
                <IconBtn icon="trash" label="Delete product" danger onClick={() => dispatch({ type: "product/delete", id: p.id })} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing && <EntityFormModal title={field(editing, "id") ? "Edit Product" : "Add Product"} fields={fields} value={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

/* ----------------------------- Drivers & Tempos ---------------------------- */

const driverStatuses = ["On Duty", "Off Duty", "On Leave"];
const tempoStatuses = ["Available", "In Transit", "Maintenance"];

export function DriversSection() {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState<EntityRecord | null>(null);

  const openNew = () => setEditing({ id: "", name: "", phone: "", license: "", routeName: "Unassigned", status: "On Duty" });

  const save = (record: EntityRecord) => {
    const item: Driver = {
      id: (field(record, "id")) || `dr${state.counter + 1}`,
      name: field(record, "name"),
      phone: field(record, "phone"),
      license: field(record, "license"),
      routeName: field(record, "routeName"),
      status: field(record, "status") as Driver["status"],
    };
    dispatch({ type: "driver/save", item });
    setEditing(null);
  };

  const fields = [
    { key: "name", label: "Driver Name" },
    { key: "phone", label: "Phone", type: "tel" as const },
    { key: "license", label: "License No." },
    { key: "routeName", label: "Assigned Route", type: "select" as const, options: [...state.routes.map((r) => ({ value: r.name, label: r.name })), { value: "Unassigned", label: "Unassigned" }] },
    { key: "status", label: "Status", type: "select" as const, options: driverStatuses.map((s) => ({ value: s, label: s })) },
  ];

  return (
    <div>
      <SectionToolbar title="Manage Drivers" subtitle="Driver roster and duty status.">
        <AddButton onClick={openNew} label="Add Driver" />
      </SectionToolbar>
      <div className="card-soft overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Driver</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">License</th>
              <th className="px-5 py-3">Route</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {state.drivers.map((d) => (
              <tr key={d.id} className="transition hover:bg-accent/40">
                <td className="px-5 py-3 font-semibold text-brand-dark">{d.name}</td>
                <td className="px-5 py-3">{d.phone}</td>
                <td className="px-5 py-3 text-muted-foreground">{d.license}</td>
                <td className="px-5 py-3">{d.routeName}</td>
                <td className="px-5 py-3">
                  <StatusPill status={d.status} />
                </td>
                <td className="px-5 py-3">
                  <IconBtn icon="edit" label="Edit driver" onClick={() => setEditing({ ...d })} />
                  <IconBtn icon="trash" label="Delete driver" danger onClick={() => dispatch({ type: "driver/delete", id: d.id })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <EntityFormModal title={field(editing, "id") ? "Edit Driver" : "Add Driver"} fields={fields} value={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

export function TemposSection() {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState<EntityRecord | null>(null);

  const openNew = () => setEditing({ id: "", number: "", driver: state.drivers[0]?.name ?? "", capacity: "3,000 L", currentRoute: "", status: "Available" });

  const save = (record: EntityRecord) => {
    const item: Tempo = {
      id: (field(record, "id")) || `t${state.counter + 1}`,
      number: field(record, "number"),
      driver: field(record, "driver"),
      capacity: field(record, "capacity"),
      currentRoute: field(record, "currentRoute"),
      status: field(record, "status") as Tempo["status"],
    };
    dispatch({ type: "tempo/save", item });
    setEditing(null);
  };

  const fields = [
    { key: "number", label: "Tempo Number" },
    { key: "driver", label: "Driver", type: "select" as const, options: state.drivers.map((d) => ({ value: d.name, label: d.name })) },
    { key: "capacity", label: "Capacity" },
    { key: "currentRoute", label: "Current Route", type: "select" as const, options: [{ value: "", label: "— None —" }, ...state.routes.map((r) => ({ value: r.name, label: r.name }))], required: false },
    { key: "status", label: "Status", type: "select" as const, options: tempoStatuses.map((s) => ({ value: s, label: s })) },
  ];

  return (
    <div>
      <SectionToolbar title="Manage Tempo" subtitle="Vehicle fleet, current routes and availability.">
        <AddButton onClick={openNew} label="Add Tempo" />
      </SectionToolbar>
      <div className="card-soft overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Tempo</th>
              <th className="px-5 py-3">Driver</th>
              <th className="px-5 py-3">Capacity</th>
              <th className="px-5 py-3">Current Route</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {state.tempos.map((t) => (
              <tr key={t.id} className="transition hover:bg-accent/40">
                <td className="px-5 py-3 font-semibold text-brand-dark">{t.number}</td>
                <td className="px-5 py-3">{t.driver}</td>
                <td className="px-5 py-3">{t.capacity}</td>
                <td className="px-5 py-3">{t.currentRoute || "—"}</td>
                <td className="px-5 py-3">
                  <StatusPill status={t.status} />
                </td>
                <td className="px-5 py-3">
                  <IconBtn icon="edit" label="Edit tempo" onClick={() => setEditing({ ...t })} />
                  <IconBtn icon="trash" label="Delete tempo" danger onClick={() => dispatch({ type: "tempo/delete", id: t.id })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <EntityFormModal title={field(editing, "id") ? "Edit Tempo" : "Add Tempo"} fields={fields} value={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}
