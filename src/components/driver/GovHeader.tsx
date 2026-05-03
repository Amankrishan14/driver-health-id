import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function GovHeader() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-gradient-primary text-primary-foreground shadow-elegant">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Ministry of Transport
            </p>
            <p className="font-serif text-base font-semibold text-foreground">
              Driver Health Insurance
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 text-sm sm:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-secondary text-primary" }}
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-smooth hover:text-foreground"
          >
            Apply
          </Link>
          <a
            href="https://example.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-smooth hover:text-foreground"
          >
            Verify Card
          </a>
          <Link
            to="/admin/login"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-smooth hover:text-foreground"
          >
            Admin
          </Link>
        </nav>
      </div>
      <div className="h-1 bg-gradient-to-r from-primary via-gold to-primary" />
    </header>
  );
}