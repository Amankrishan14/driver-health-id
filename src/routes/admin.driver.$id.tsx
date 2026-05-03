import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { DriverCard } from "@/components/driver/DriverCard";
import { useStore } from "@/lib/driver-store";

export const Route = createFileRoute("/admin/driver/$id")({
  head: () => ({ meta: [{ title: "Driver Detail — DHIC Admin" }] }),
  component: DriverDetail,
});

function DriverDetail() {
  const { id } = Route.useParams();
  const { getDriver, deleteDriver } = useStore();
  const navigate = useNavigate();
  const driver = getDriver(id);
  const [confirm, setConfirm] = useState(false);

  if (!driver) {
    return (
      <AdminShell title="Driver Detail">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Driver not found.</p>
          <Link to="/admin/drivers" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">← Back to drivers</Link>
        </div>
      </AdminShell>
    );
  }

  const rows: [string, string][] = [
    ["Full Name", driver.fullName],
    ["Date of Birth", driver.dob ? format(new Date(driver.dob), "dd MMM yyyy") : "—"],
    ["Mobile", `+91 ${driver.mobile}`],
    ["License Number", driver.licenseNumber],
    ["Insurance ID", driver.insuranceId],
    ["Blood Group", driver.bloodGroup],
    ["Address", driver.address],
    ["Created", format(new Date(driver.createdAt), "dd MMM yyyy")],
    ["Expires", format(new Date(driver.expiresAt), "dd MMM yyyy")],
    ["Status", driver.status],
    ["Unique ID", driver.uid],
  ];

  return (
    <AdminShell title="Driver Detail">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/drivers" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Drivers
        </Link>
        <div className="flex gap-2">
          <Link to="/admin/edit/$id" params={{ id }}
            className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-secondary">
            <Pencil className="h-4 w-4" /> Edit
          </Link>
          <button onClick={() => setConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-1.5 text-sm font-semibold text-destructive-foreground">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
        <div className="rounded-xl border border-border bg-card shadow-elegant">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-serif text-base font-semibold text-foreground">Driver Information</h2>
          </div>
          <dl className="divide-y divide-border text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[140px_1fr] gap-4 px-5 py-3">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k}</dt>
                <dd className="text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <DriverCard data={driver} uid={driver.uid} />
        </div>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setConfirm(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-serif text-lg font-semibold text-foreground">Delete driver?</h3>
            <p className="mt-1 text-sm text-muted-foreground">This permanently removes <span className="font-medium text-foreground">{driver.fullName}</span>.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setConfirm(false)} className="rounded-md border border-input bg-background px-3 py-1.5 text-sm">Cancel</button>
              <button onClick={() => { deleteDriver(driver.id); navigate({ to: "/admin/drivers" }); }}
                className="rounded-md bg-destructive px-3 py-1.5 text-sm font-semibold text-destructive-foreground">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
