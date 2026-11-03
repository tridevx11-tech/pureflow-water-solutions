import { useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";

export type Tone = "success" | "warn" | "danger" | "neutral" | "brand";

const toneClass: Record<Tone, string> = {
  success: "demand-low",
  warn: "demand-medium",
  danger: "demand-high",
  neutral: "bg-muted text-muted-foreground",
  brand: "bg-brand text-primary-foreground",
};

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${toneClass[tone]}`}>
      {children}
    </span>
  );
}

const statusTone: Record<string, Tone> = {
  Delivered: "success", Active: "success", Approved: "success", Available: "success",
  Completed: "success", "On Schedule": "success", "On Duty": "success", Contacted: "success",
  Rejected: "danger", Delayed: "danger",
  Pending: "warn", "In Transit": "warn", Maintenance: "warn", New: "warn",
  Neutral: "neutral", "Off Duty": "neutral", "On Leave": "neutral", Inactive: "neutral",
};

export function StatusPill({ status }: { status: string }) {
  return <Pill tone={statusTone[status] ?? "neutral"}>{status}</Pill>;
}

export function StatCard({ icon, label, value, hint, highlight = false }: { icon: string; label: string; value: ReactNode; hint?: string; highlight?: boolean }) {
  return (
    <div className={`card-soft card-lift p-5 ${highlight ? "ring-2 ring-water" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-brand">
          <Icon name={icon} />
        </span>
        {hint && <span className="text-xs font-semibold text-muted-foreground">{hint}</span>}
      </div>
      <div className="mt-3 font-display text-2xl font-extrabold text-brand-dark">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-card p-6 shadow-2xl animate-rise ${wide ? "max-w-2xl" : "max-w-lg"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-brand-dark">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-muted-foreground transition hover:bg-accent">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "number" | "email" | "tel" | "date" | "textarea" | "select";
  options?: SelectOption[];
  required?: boolean;
  full?: boolean;
}

export type EntityRecord = Record<string, string | number | boolean>;

/** Typed accessor for EntityRecord — satisfies noPropertyAccessFromIndexSignature. */
export function field(record: EntityRecord, key: string): string {
  const v = record[key];
  return v === undefined || v === null ? "" : String(v);
}

export function EntityFormModal({
  title,
  fields,
  value,
  onClose,
  onSave,
}: {
  title: string;
  fields: FieldDef[];
  value: EntityRecord;
  onClose: () => void;
  onSave: (record: EntityRecord) => void;
}) {
  const [v, setV] = useState<EntityRecord>(value);
  const set = (key: string, val: string | number | boolean) => setV((prev) => ({ ...prev, [key]: val }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      Object.fromEntries(
        Object.entries(v).map(([k, val]) => [k, typeof val === "string" && fields.find((f) => f.key === k)?.type === "number" ? Number(val) : val]),
      ),
    );
  };
  return (
    <Modal title={title} onClose={onClose} wide>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className={`block text-sm font-semibold text-foreground ${f.full ? "sm:col-span-2" : ""}`}>
            {f.label}
            {f.type === "textarea" ? (
              <textarea required={f.required !== false} rows={3} className="input-field mt-1" value={String(v[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)} />
            ) : f.type === "select" ? (
              <select required={f.required !== false} className="input-field mt-1" value={String(v[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)}>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                required={f.required !== false}
                type={f.type ?? "text"}
                className="input-field mt-1"
                value={String(v[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value)}
              />
            )}
          </label>
        ))}
        <div className="flex justify-end gap-2 sm:col-span-2">
          <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5 font-semibold btn-outline-brand">
            Cancel
          </button>
          <button className="rounded-full px-6 py-2.5 font-bold btn-gradient">Save</button>
        </div>
      </form>
    </Modal>
  );
}

export function IconBtn({ icon, label, onClick, danger = false }: { icon: string; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded-xl p-2 transition ${danger ? "text-destructive hover:bg-destructive/10" : "text-brand hover:bg-accent"}`}
    >
      <Icon name={icon} className="h-4 w-4" />
    </button>
  );
}

export function AddButton({ onClick, label = "Add New" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold btn-gradient">
      <Icon name="plus" className="h-4 w-4" />
      {label}
    </button>
  );
}

export function SectionToolbar({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-extrabold text-brand-dark">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export function FilterSelect({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: SelectOption[]; label: string }) {
  return (
    <label className="text-xs font-semibold text-muted-foreground">
      {label}
      <select className="input-field mt-1 w-auto min-w-40" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <div className="card-soft grid place-items-center p-10 text-center text-sm font-semibold text-muted-foreground">{text}</div>;
}
