import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, seo, PageHeader } from "@/components/site/Layout";
import { WhyChoose, Testimonials } from "@/components/site/Sections";

export const Route = createFileRoute("/why-choose-us")({
  head: () => seo("Why Choose UDVIJ Mineral Water", "Certified purity, automated bottling and dependable daily route delivery — why dealers choose UDVIJ."),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Why Choose Us" title="Purity you can trust" subtitle="Quality, reliability and partnership on every route." />
      <WhyChoose /><Testimonials />
    </SiteLayout>
  );
}
