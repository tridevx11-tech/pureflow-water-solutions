import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, seo, PageHeader } from "@/components/site/Layout";
import { DealerBenefits, DealerForm } from "@/components/site/Sections";

export const Route = createFileRoute("/dealer-network")({
  head: () => seo("Become a UDVIJ Dealer — Dealer Network", "Register as a UDVIJ mineral water dealer and get daily route-managed supply with healthy margins."),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Dealer Network" title="Become a UDVIJ dealer" subtitle="Join 100+ partners across 7 city routes." />
      <DealerBenefits /><DealerForm />
    </SiteLayout>
  );
}
