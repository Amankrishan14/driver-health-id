import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, ShieldCheck, AlertTriangle, ArrowRight } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useStore } from "@/lib/driver-store";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — DHIC Admin" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { drivers } = useStore();
  const total = drivers.length;
  const active = drivers.filter((d) => d.status === "Active").length;
  const expired = drivers.filter((d) => d.status === "Expired").length;
  const recent = [...drivers].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5);

  const stats = [
    { label: "Total Drivers", value: total, icon: Users, tint: "bg-primary/10 text-primary" },
    { label: "Active Insurance", value: active, icon: ShieldCheck, tint: "bg-emerald-500/10 text-emerald-700" },
    { label: "Expired Insurance", value: expired, icon: AlertTriangle, tint: "bg-destructive/10 text-destructive" },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-elegant">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-2 font-serif text-3xl font-semibold text-foreground">{s.value}</p>
              </div>
              <div className={`grid h-10 w-10 place-items-center rounded-md ${s.tint}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card shadow-elegant">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-serif text-base font-semibold text-foreground">Recent Drivers</h2>
          <Link to="/admin/drivers" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">License</th>
                <th className="px-5 py-3 font-medium">Mobile</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">No drivers yet</td></tr>
              ) : recent.map((d) => (
                <tr key={d.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium text-foreground">{d.fullName}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.licenseNumber}</td>
                  <td className="px-5 py-3 text-muted-foreground">+91 {d.mobile}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function StatusBadge({ status }: { status: "Active" | "Expired" }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
      status === "Active" ? "bg-emerald-500/10 text-emerald-700" : "bg-destructive/10 text-destructive"
    }`}>
      {status}
    </span>
  );
}