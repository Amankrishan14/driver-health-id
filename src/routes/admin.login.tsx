import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/driver-store";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — DHIC" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const { admin, login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@dhic.gov.in");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (admin) navigate({ to: "/admin/dashboard" });
  }, [admin, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email");
    if (password.length < 4) return setError("Password too short");
    setBusy(true);
    const ok = await login(email, password);
    setBusy(false);
    if (ok) navigate({ to: "/admin/dashboard" });
    else setError("Invalid credentials");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-secondary via-background to-accent/30 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-md bg-gradient-primary text-primary-foreground shadow-elegant">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">DHIC</p>
            <h1 className="font-serif text-xl font-semibold text-foreground">Admin Console</h1>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary" />
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button type="submit" disabled={busy}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant disabled:opacity-60">
            Sign in <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            Demo: any email + password (4+ chars)
          </p>
        </form>
        <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-foreground">
          ← Back to public site
        </Link>
      </div>
    </div>
  );
}