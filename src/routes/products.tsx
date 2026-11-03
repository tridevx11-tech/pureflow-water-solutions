import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, seo, PageHeader } from "@/components/site/Layout";
import { ProductsGrid } from "@/components/site/Sections";

export const Route = createFileRoute("/products")({
  head: () => seo("UDVIJ Products — 20L Jars, Bottles & Bulk Supply", "Explore UDVIJ mineral water: 20L jars, 2L, 1L, 500ml, 250ml bottles and bulk supply with dealer pricing."),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Products" title="Our mineral water range" subtitle="Sealed, tested and delivered fresh every day." />
      <ProductsGrid heading={false} />
    </SiteLayout>
  );
}
