import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { DriverForm } from "@/components/driver/DriverForm";
import { useStore } from "@/lib/driver-store";

export const Route = createFileRoute("/admin/edit/$id")({
  head: () => ({ meta: [{ title: "Edit Driver — DHIC Admin" }] }),
  component: EditDriverPage,
});

function EditDriverPage() {
  const { id } = Route.useParams();
  const { getDriver, updateDriver } = useStore();
  const navigate = useNavigate();
  const driver = getDriver(id);

  return (
    <AdminShell title="Edit Driver">
      <div className="mx-auto max-w-3xl">
        {!driver ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Driver not found.</p>
            <Link to="/admin/drivers" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">← Back to drivers</Link>
          </div>
        ) : (
          <DriverForm
            defaultValues={driver}
            submitLabel="Save Changes"
            onSubmit={(data) => {
              updateDriver(id, data);
              navigate({ to: "/admin/driver/$id", params: { id } });
            }}
            onCancel={() => navigate({ to: "/admin/drivers" })}
          />
        )}
      </div>
    </AdminShell>
  );
}
