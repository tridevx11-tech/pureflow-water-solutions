import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, seo, PageHeader } from "@/components/site/Layout";
import { About, Process } from "@/components/site/Sections";

export const Route = createFileRoute("/about")({
  head: () => seo("About UDVIJ Industries — Mineral Water Manufacturer", "Learn about UDVIJ Industries, our automated plant at Tidagundi and our 9-step purification process."),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="About Us" title="Pure water, engineered with care" subtitle="A Vijayapura manufacturer trusted by dealers across Maharashtra and Karnataka." />
      <About /><Process />
    </SiteLayout>
  );
}
