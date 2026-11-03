import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, seo, PageHeader } from "@/components/site/Layout";
import { ContactSection } from "@/components/site/Sections";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact UDVIJ Industries", "Contact UDVIJ Industries in Vijayapura for dealer enquiries, bulk orders and support."),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Contact" title="Get in touch" subtitle="Dealer enquiries, bulk orders and support." />
      <ContactSection />
    </SiteLayout>
  );
}
