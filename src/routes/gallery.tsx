import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, seo, PageHeader } from "@/components/site/Layout";
import { GalleryGrid } from "@/components/site/Sections";

export const Route = createFileRoute("/gallery")({
  head: () => seo("UDVIJ Gallery — Plant, Bottling & Delivery", "Photos from the UDVIJ plant, bottling line, testing lab, warehouse and delivery fleet."),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Gallery" title="Inside UDVIJ" subtitle="Plant, bottling, testing, warehouse and delivery." />
      <GalleryGrid heading={false} />
    </SiteLayout>
  );
}
