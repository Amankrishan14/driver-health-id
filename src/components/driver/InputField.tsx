import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, icon, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground transition-smooth",
              "placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error && "border-destructive focus:ring-destructive/30 focus:border-destructive",
              className,
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : hint ? (
          <p className="text-xs text-muted-foreground/80">{hint}</p>
        ) : null}
      </div>
    );
  },
);
InputField.displayName = "InputField";