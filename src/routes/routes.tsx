import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, seo, PageHeader } from "@/components/site/Layout";
import { RouteNetwork } from "@/components/site/Sections";

export const Route = createFileRoute("/routes")({
  head: () => seo("UDVIJ Delivery Routes — City Route Network", "See UDVIJ's city delivery routes — Pune, Nagpur, Mumbai, Solapur, Vijayapura, Belagavi and Hubli."),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Routes" title="Our city route network" subtitle="Each city is one route with its own driver and tempo." />
      <RouteNetwork />
    </SiteLayout>
  );
}
