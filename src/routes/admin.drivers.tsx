import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Eye, Pencil, Trash2, UserPlus, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useStore, type DriverRecord } from "@/lib/driver-store";

export const Route = createFileRoute("/admin/drivers")({
  head: () => ({ meta: [{ title: "Drivers — DHIC Admin" }] }),
  component: DriversPage,
});

const PAGE_SIZE = 5;

function DriversPage() {
  const { drivers, deleteDriver } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Expired">("All");
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      if (filter !== "All" && d.status !== filter) return false;
      if (!q.trim()) return true;
      const s = q.toLowerCase();
      return (
        d.fullName.toLowerCase().includes(s) ||
        d.licenseNumber.toLowerCase().includes(s) ||
        d.insuranceId.toLowerCase().includes(s) ||
        d.mobile.includes(s)
      );
    });
  }, [drivers, q, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const slice = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const target = confirmId ? drivers.find((d) => d.id === confirmId) : null;

  return (
    <AdminShell title="Driver Management">
      <div className="rounded-xl border border-border bg-card shadow-elegant">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by name, license, mobile…"
                className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary" />
            </div>
            <select value={filter} onChange={(e) => { setFilter(e.target.value as typeof filter); setPage(1); }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary">
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <Link to="/admin/add-driver"
            className="inline-flex items-center gap-1.5 rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant">
            <UserPlus className="h-4 w-4" /> Add Driver
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Photo</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">License</th>
                <th className="px-4 py-3 font-medium">Insurance ID</th>
                <th className="px-4 py-3 font-medium">Mobile</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No drivers match your filters</td></tr>
              ) : slice.map((d) => (
                <DriverRow key={d.id} d={d}
                  onView={() => navigate({ to: "/admin/driver/$id", params: { id: d.id } })}
                  onEdit={() => navigate({ to: "/admin/edit/$id", params: { id: d.id } })}
                  onDelete={() => setConfirmId(d.id)} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border p-4 text-xs text-muted-foreground">
          <p>Showing {slice.length} of {filtered.length}</p>
          <div className="flex items-center gap-2">
            <button disabled={current === 1} onClick={() => setPage(current - 1)}
              className="rounded-md border border-input bg-background px-3 py-1.5 disabled:opacity-50">Prev</button>
            <span>Page {current} / {totalPages}</span>
            <button disabled={current === totalPages} onClick={() => setPage(current + 1)}
              className="rounded-md border border-input bg-background px-3 py-1.5 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {target && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setConfirmId(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground">Delete driver?</h3>
                <p className="mt-1 text-sm text-muted-foreground">This will permanently remove <span className="font-medium text-foreground">{target.fullName}</span>.</p>
              </div>
              <button onClick={() => setConfirmId(null)}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setConfirmId(null)} className="rounded-md border border-input bg-background px-3 py-1.5 text-sm">Cancel</button>
              <button onClick={() => { deleteDriver(target.id); setConfirmId(null); }}
                className="rounded-md bg-destructive px-3 py-1.5 text-sm font-semibold text-destructive-foreground">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function DriverRow({ d, onView, onEdit, onDelete }: { d: DriverRecord; onView: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-secondary">
          {d.photo ? <img src={d.photo} alt={d.fullName} className="h-full w-full object-cover" /> :
            <div className="grid h-full w-full place-items-center text-[10px] text-muted-foreground">N/A</div>}
        </div>
      </td>
      <td className="px-4 py-3 font-medium text-foreground">{d.fullName}</td>
      <td className="px-4 py-3 text-muted-foreground">{d.licenseNumber}</td>
      <td className="px-4 py-3 text-muted-foreground">{d.insuranceId}</td>
      <td className="px-4 py-3 text-muted-foreground">+91 {d.mobile}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
          d.status === "Active" ? "bg-emerald-500/10 text-emerald-700" : "bg-destructive/10 text-destructive"
        }`}>{d.status}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-1">
          <button onClick={onView} title="View" className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary"><Eye className="h-4 w-4" /></button>
          <button onClick={onEdit} title="Edit" className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary"><Pencil className="h-4 w-4" /></button>
          <button onClick={onDelete} title="Delete" className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
        </div>
      </td>
    </tr>
  );
}