import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, UserPlus, LogOut, ShieldCheck, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useStore } from "@/lib/driver-store";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/drivers", label: "Drivers", icon: Users },
  { to: "/admin/add-driver", label: "Add Driver", icon: UserPlus },
] as const;

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const { admin, logout } = useStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!admin) navigate({ to: "/admin/login" });
  }, [admin, navigate]);

  if (!admin) return null;

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Admin</p>
            <p className="font-serif text-sm font-semibold">DHIC Console</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-smooth ${
                  active ? "bg-gradient-primary text-primary-foreground shadow-elegant" : "text-foreground hover:bg-secondary"
                }`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-3">
          <Link to="/" className="block rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-secondary">
            ← Back to public site
          </Link>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Top navbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-serif text-lg font-semibold text-foreground sm:text-xl">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-foreground">{admin.name}</p>
              <p className="text-[11px] text-muted-foreground">{admin.email}</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
              {admin.name[0]?.toUpperCase()}
            </div>
            <button
              onClick={() => { logout(); navigate({ to: "/admin/login" }); }}
              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-smooth hover:bg-secondary"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

// Avoid unused import warning for X
export const _IconShim = X;