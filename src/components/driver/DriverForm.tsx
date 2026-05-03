import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, User, Phone, IdCard } from "lucide-react";
import { InputField } from "./InputField";
import { PhotoUpload } from "./PhotoUpload";
import { bloodGroups, driverSchema, type DriverData } from "@/lib/driver-schema";

interface Props {
  defaultValues?: Partial<DriverData>;
  submitLabel?: string;
  onSubmit: (data: DriverData) => void;
  onCancel?: () => void;
}

export function DriverForm({ defaultValues, submitLabel = "Save", onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DriverData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      fullName: "",
      dob: "",
      licenseNumber: "",
      insuranceId: "",
      bloodGroup: undefined as unknown as DriverData["bloodGroup"],
      mobile: "",
      address: "",
      photo: "",
      ...defaultValues,
    },
    mode: "onBlur",
  });

  const photo = watch("photo");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-xl border border-border bg-card p-5 shadow-elegant sm:p-7"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <InputField label="Full Name" placeholder="As per official documents"
            icon={<User className="h-4 w-4" />} error={errors.fullName?.message} {...register("fullName")} />
        </div>
        <InputField label="Date of Birth" type="date" max={new Date().toISOString().split("T")[0]}
          error={errors.dob?.message} {...register("dob")} />
        <InputField label="Mobile Number" type="tel" inputMode="numeric" maxLength={10}
          placeholder="10-digit number" icon={<Phone className="h-4 w-4" />}
          error={errors.mobile?.message} {...register("mobile")} />
        <InputField label="License Number" placeholder="DL-1420110012345"
          icon={<IdCard className="h-4 w-4" />} error={errors.licenseNumber?.message}
          {...register("licenseNumber")} />
        <InputField label="Insurance ID" placeholder="INS-XXXXXX"
          error={errors.insuranceId?.message} {...register("insuranceId")} />
        <div className="space-y-1.5">
          <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Blood Group</label>
          <Controller control={control} name="bloodGroup" render={({ field }) => (
            <select {...field} value={field.value ?? ""}
              className={`w-full rounded-md border bg-background px-3 py-2.5 text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary ${errors.bloodGroup ? "border-destructive" : "border-input"}`}>
              <option value="" disabled>Select blood group</option>
              {bloodGroups.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          )} />
          {errors.bloodGroup && <p className="text-xs text-destructive">{errors.bloodGroup.message}</p>}
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <label htmlFor="address" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Address</label>
          <textarea id="address" rows={3} placeholder="House no, street, city, state, PIN code"
            className={`w-full resize-none rounded-md border bg-background px-3 py-2.5 text-sm transition-smooth placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary ${errors.address ? "border-destructive" : "border-input"}`}
            {...register("address")} />
          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <PhotoUpload value={photo} onChange={(url) => setValue("photo", url, { shouldValidate: true, shouldDirty: true })} error={errors.photo?.message} />
        </div>
      </div>
      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-smooth hover:bg-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={isSubmitting}
          className="group inline-flex items-center justify-center gap-2 rounded-md bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:shadow-card disabled:opacity-60">
          {submitLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}