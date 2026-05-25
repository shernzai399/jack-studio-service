import { InquiryForm } from "@/components/inquiry-form";
import { SiteShell, PageHero } from "@/components/site-shell";

export default function InquiryPage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Inquiry" title="Send us your item photo" text="Submit your service request and our team will contact you through WhatsApp soon." />
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-8">
        <InquiryForm />
      </section>
    </SiteShell>
  );
}
