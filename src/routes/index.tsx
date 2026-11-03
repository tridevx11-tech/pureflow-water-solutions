import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, seo } from "@/components/site/Layout";
import { Hero, About, Process, WhyChoose, ProductsGrid, RouteNetwork, DealerBenefits, Testimonials, GalleryGrid, ContactSection } from "@/components/site/Sections";

export const Route = createFileRoute("/")({
  head: () => seo("UDVIJ Mineral Water — Pure Water. Pure Trust.", "Premium mineral water manufacturer & distributor in Vijayapura supplying dealers across 7 city routes."),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      
      <Hero /><About /><Process /><WhyChoose /><ProductsGrid /><RouteNetwork /><DealerBenefits /><Testimonials /><GalleryGrid /><ContactSection />
    </SiteLayout>
  );
}
