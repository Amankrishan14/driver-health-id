import { createFileRoute, Link } from "@tanstack/react-router";
import { GovHeader } from "@/components/driver/GovHeader";

export const Route = createFileRoute("/card")({
  component: CardPage,
});

function CardPage() {
  return (
    <div className="min-h-screen bg-background">
      <GovHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Card Preview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Apply on the home page to generate and preview your card.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant">
          Go to application
        </Link>
      </main>
    </div>
  );
}