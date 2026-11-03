import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, seo, PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/terms")({
  head: () => seo("Terms & Conditions — UDVIJ Industries", "Terms governing orders, dealership and deliveries with UDVIJ Industries."),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Legal" title="Terms & Conditions" />
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="card-soft space-y-4 p-8 text-muted-foreground">
          <p>Prices are subject to change; the price on the order confirmation applies.</p>
          <p>Dealers belong to one assigned delivery route and receive deliveries per that route's schedule.</p>
          <p>Jars remain property of UDVIJ and must be returned in good condition; security deposits may apply.</p>
          <p>Disputes are subject to Vijayapura, Karnataka jurisdiction.</p>
        </div>
      </section>
    </SiteLayout>
  );
}
