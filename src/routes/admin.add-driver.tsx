import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { DriverForm } from "@/components/driver/DriverForm";
import { useStore } from "@/lib/driver-store";

export const Route = createFileRoute("/admin/add-driver")({
  head: () => ({ meta: [{ title: "Add Driver — DHIC Admin" }] }),
  component: AddDriverPage,
});

function AddDriverPage() {
  const { addDriver } = useStore();
  const navigate = useNavigate();
  return (
    <AdminShell title="Add Driver">
      <div className="mx-auto max-w-3xl">
        <DriverForm
          submitLabel="Create Driver"
          onSubmit={(data) => {
            const rec = addDriver(data);
            navigate({ to: "/admin/driver/$id", params: { id: rec.id } });
          }}
          onCancel={() => navigate({ to: "/admin/drivers" })}
        />
      </div>
    </AdminShell>
  );
}