import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Logo, seo } from "@/components/site/Layout";
import { useApp } from "@/hooks/useAppStore";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => seo("Admin — UDVIJ Distribution", "UDVIJ admin panel for routes, orders, fleet and dispatch analytics."),
  component: Admin,
});

function Admin() {
  const { state, login } = useApp();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setErr(!login(u, p));
  };

  if (!state.isAdmin)
    return (
      <div className="grid min-h-screen place-items-center hero-gradient p-4">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl bg-card p-8 shadow-2xl animate-rise">
          <div className="flex justify-center">
            <Logo />
          </div>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Distribution Admin</p>
          <input className="input-field" placeholder="Username" value={u} onChange={(e) => setU(e.target.value)} autoComplete="username" />
          <input className="input-field" type="password" placeholder="Password" value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password" />
          {err && <p className="text-sm font-semibold text-destructive">Invalid username or password</p>}
          <button className="w-full rounded-full py-3 font-bold btn-gradient">Login</button>
          <p className="text-center text-xs text-muted-foreground">
            Demo credentials: admin / admin123 · <Link to="/" className="font-bold text-brand hover:underline">Back to website</Link>
          </p>
        </form>
      </div>
    );

  return <AdminShell />;
}
