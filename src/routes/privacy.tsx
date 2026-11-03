import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, seo, PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/privacy")({
  head: () => seo("Privacy Policy — UDVIJ Industries", "How UDVIJ Industries collects and uses dealer and customer information."),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="card-soft space-y-4 p-8 text-muted-foreground">
          <p>We collect only the details you share through our dealer registration and contact forms — name, phone, email, GST and address.</p>
          <p>This information is used solely to process dealership enquiries, orders and deliveries.</p>
          <p>We never sell your data. Information is shared only with our delivery staff when required to fulfil an order.</p>
          <p>To update or delete your information, email us at miniralwater@gmail.com.</p>
        </div>
      </section>
    </SiteLayout>
  );
}
