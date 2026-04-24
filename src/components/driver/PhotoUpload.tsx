import { useRef, useState } from "react";
import { Camera, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  error?: string;
}

export function PhotoUpload({ value, onChange, error }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(typeof reader.result === "string" ? reader.result : "");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Driver Photo
      </label>
      <div
        className={cn(
          "relative flex items-center gap-4 rounded-md border border-dashed border-input bg-secondary/30 p-4 transition-smooth",
          error && "border-destructive",
        )}
      >
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-background shadow-elegant">
          {value ? (
            <img src={value} alt="Driver" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Camera className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-foreground">
            {value ? "Photo uploaded" : "Upload passport-size photo"}
          </p>
          <p className="text-xs text-muted-foreground">JPG or PNG, max 5MB</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-smooth hover:bg-primary-glow"
            >
              <Upload className="h-3.5 w-3.5" />
              {value ? "Replace" : "Choose file"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-smooth hover:bg-secondary"
              >
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {loading && (
          <div className="absolute inset-0 grid place-items-center rounded-md bg-background/60 text-xs text-muted-foreground">
            Loading…
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}