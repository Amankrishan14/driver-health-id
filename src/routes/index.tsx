import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Pencil,
  User,
  Phone,
  IdCard,
  FileBadge,
} from "lucide-react";
import { GovHeader } from "@/components/driver/GovHeader";
import { InputField } from "@/components/driver/InputField";
import { PhotoUpload } from "@/components/driver/PhotoUpload";
import { DriverCard } from "@/components/driver/DriverCard";
import {
  bloodGroups,
  driverSchema,
  generateUID,
  type DriverData,
} from "@/lib/driver-schema";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Driver Health Insurance Card — Apply Online" },
      {
        name: "description",
        content:
          "Apply for your official Driver Health Insurance Card under the Government Transport Health Scheme. Quick, secure, paperless.",
      },
      { property: "og:title", content: "Driver Health Insurance Card" },
      {
        property: "og:description",
        content:
          "Generate your Driver Health Insurance Card with QR verification.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [submitted, setSubmitted] = useState<DriverData | null>(null);
  const [uid, setUid] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    reset,
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
    },
    mode: "onBlur",
  });

  const photo = watch("photo");

  const onSubmit = (data: DriverData) => {
    setUid(generateUID());
    setSubmitted(data);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleEdit = () => {
    setSubmitted(null);
  };

  const handleNew = () => {
    reset();
    setSubmitted(null);
    setUid("");
  };

  return (
    <div className="min-h-screen bg-background">
      <GovHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        {!submitted ? (
          <FormView
            register={register}
            handleSubmit={handleSubmit(onSubmit)}
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
            photo={photo}
            setPhoto={(url) =>
              setValue("photo", url, { shouldValidate: true, shouldDirty: true })
            }
          />
        ) : (
          <SuccessView
            data={submitted}
            uid={uid}
            onEdit={handleEdit}
            onNew={handleNew}
          />
        )}
      </main>

      <footer className="mt-12 border-t border-border bg-card/60 py-6 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Government Transport Health Scheme · For
          demonstration purposes only
        </p>
      </footer>
    </div>
  );
}

type FormViewProps = {
  register: ReturnType<typeof useForm<DriverData>>["register"];
  handleSubmit: () => void;
  control: ReturnType<typeof useForm<DriverData>>["control"];
  errors: ReturnType<typeof useForm<DriverData>>["formState"]["errors"];
  isSubmitting: boolean;
  photo: string;
  setPhoto: (url: string) => void;
};

function FormView({
  register,
  handleSubmit,
  control,
  errors,
  isSubmitting,
  photo,
  setPhoto,
}: FormViewProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <section>
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <FileBadge className="h-3 w-3" /> New Application
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            Apply for your{" "}
            <span className="text-primary">Health Insurance Card</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Fill in your details below to instantly generate your official Driver
            Health Insurance Card with QR verification.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          noValidate
          className="rounded-xl border border-border bg-card p-5 shadow-elegant sm:p-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <InputField
                label="Full Name"
                placeholder="As per official documents"
                icon={<User className="h-4 w-4" />}
                error={errors.fullName?.message}
                {...register("fullName")}
              />
            </div>

            <InputField
              label="Date of Birth"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              error={errors.dob?.message}
              {...register("dob")}
            />

            <InputField
              label="Mobile Number"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit number"
              icon={<Phone className="h-4 w-4" />}
              error={errors.mobile?.message}
              {...register("mobile")}
            />

            <InputField
              label="License Number"
              placeholder="DL-1420110012345"
              icon={<IdCard className="h-4 w-4" />}
              error={errors.licenseNumber?.message}
              {...register("licenseNumber")}
            />

            <InputField
              label="Insurance ID"
              placeholder="INS-XXXXXX"
              error={errors.insuranceId?.message}
              {...register("insuranceId")}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Blood Group
              </label>
              <Controller
                control={control}
                name="bloodGroup"
                render={({ field }) => (
                  <select
                    {...field}
                    value={field.value ?? ""}
                    className={`w-full rounded-md border bg-background px-3 py-2.5 text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary ${
                      errors.bloodGroup
                        ? "border-destructive"
                        : "border-input"
                    }`}
                  >
                    <option value="" disabled>
                      Select blood group
                    </option>
                    {bloodGroups.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.bloodGroup && (
                <p className="text-xs text-destructive">
                  {errors.bloodGroup.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label
                htmlFor="address"
                className="block text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Address
              </label>
              <textarea
                id="address"
                rows={3}
                placeholder="House no, street, city, state, PIN code"
                className={`w-full resize-none rounded-md border bg-background px-3 py-2.5 text-sm transition-smooth placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary ${
                  errors.address ? "border-destructive" : "border-input"
                }`}
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <PhotoUpload
                value={photo}
                onChange={setPhoto}
                error={errors.photo?.message}
              />
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              By submitting, you confirm the details are accurate.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:shadow-card disabled:opacity-60"
            >
              Generate Card
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </form>
      </section>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-xl border border-border bg-gradient-card p-5 shadow-elegant">
          <h3 className="font-serif text-lg font-semibold text-primary">
            What you get
          </h3>
          <ul className="mt-3 space-y-2.5 text-sm text-foreground">
            {[
              "Instant digital card with QR verification",
              "Recognised by all government hospitals",
              "Cashless emergency treatment cover",
              "Linked to your driving license",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Helpline
          </p>
          <p className="mt-1 font-serif text-2xl font-semibold text-primary">
            1800-123-4567
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Mon–Sat, 9 AM to 6 PM
          </p>
        </div>
      </aside>
    </div>
  );
}

function SuccessView({
  data,
  uid,
  onEdit,
  onNew,
}: {
  data: DriverData;
  uid: string;
  onEdit: () => void;
  onNew: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-primary/20 bg-gradient-card p-5 shadow-elegant">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Card generated successfully
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Your Driver Health Insurance Card is ready. Save or download it
              for future use.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="order-2 lg:order-1 space-y-4">
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Next steps
          </h3>
          <ol className="space-y-3 text-sm text-muted-foreground">
            {[
              "Download or screenshot your card.",
              "Carry the digital card on your phone at all times.",
              "Scan the QR to verify the card from any device.",
            ].map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-foreground">{step}</span>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:shadow-card"
            >
              <Download className="h-4 w-4" /> Download Card
            </button>
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-secondary"
            >
              <Pencil className="h-4 w-4" /> Edit Details
            </button>
            <button
              onClick={onNew}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
            >
              Start new application
            </button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <DriverCard data={data} uid={uid} />
        </div>
      </div>
    </div>
  );
}
