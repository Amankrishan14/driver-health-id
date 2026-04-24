import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, HeartPulse } from "lucide-react";
import { format } from "date-fns";
import type { DriverData } from "@/lib/driver-schema";

interface DriverCardProps {
  data: DriverData;
  uid: string;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export function DriverCard({ data, uid }: DriverCardProps) {
  const qrUrl = `https://example.com/driver/${uid}`;
  const dobFormatted = data.dob ? format(new Date(data.dob), "dd MMM yyyy") : "—";

  return (
    <div
      id="driver-card"
      className="relative mx-auto w-full max-w-[480px] overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-smooth"
    >
      {/* Top accent */}
      <div className="h-2 bg-gradient-to-r from-primary via-gold to-primary" />

      {/* Header */}
      <div className="relative bg-gradient-primary px-5 py-4 text-primary-foreground">
        <div className="absolute inset-0 opacity-20 card-pattern" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">
              Government Transport Health Scheme
            </p>
            <h2 className="font-serif text-lg font-semibold">
              Driver Health Insurance Card
            </h2>
          </div>
          <HeartPulse className="ml-auto h-6 w-6 opacity-70" />
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-[auto_1fr] gap-4 px-5 py-5">
        <div className="flex flex-col items-center gap-2">
          <div className="h-28 w-24 overflow-hidden rounded-md border-2 border-primary/20 bg-secondary shadow-elegant">
            {data.photo ? (
              <img src={data.photo} alt={data.fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
                No Photo
              </div>
            )}
          </div>
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
            {data.bloodGroup}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Name
            </p>
            <p className="font-serif text-lg font-semibold text-primary">
              {data.fullName}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date of Birth" value={dobFormatted} />
            <Field label="Mobile" value={`+91 ${data.mobile}`} />
            <Field label="License No." value={data.licenseNumber.toUpperCase()} />
            <Field label="Insurance ID" value={data.insuranceId.toUpperCase()} />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="mx-5 rounded-md bg-secondary/60 px-3 py-2">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Address
        </p>
        <p className="text-xs leading-relaxed text-foreground">{data.address}</p>
      </div>

      {/* Footer with QR */}
      <div className="mt-4 flex items-end justify-between gap-3 border-t border-dashed border-border bg-secondary/30 px-5 py-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Unique ID
          </p>
          <p className="font-mono text-xs font-semibold text-foreground">{uid}</p>
          <p className="pt-1 text-[9px] text-muted-foreground">
            Issued: {format(new Date(), "dd MMM yyyy")}
          </p>
          <p className="text-[9px] text-muted-foreground">
            Valid for 5 years from issue
          </p>
        </div>
        <div className="rounded-md bg-card p-1.5 shadow-elegant ring-1 ring-border">
          <QRCodeSVG
            value={qrUrl}
            size={72}
            bgColor="transparent"
            fgColor="oklch(0.36 0.13 18)"
            level="M"
          />
        </div>
      </div>
    </div>
  );
}