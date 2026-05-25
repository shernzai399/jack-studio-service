import Link from "next/link";
import { SiteShell, PageHero, SectionTitle } from "@/components/site-shell";

const options = ["Engraving", "Embossing", "Initials", "Custom tag", "Custom accessories"];

export default function CustomizationPage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Customization / Engraving" title="Make everyday pieces more personal" text="Add initials, names, tags and selected custom finishing for gifts, travel goods and leather accessories." />
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <SectionTitle eyebrow="Personalization" title="Customization options" text="Tell us your idea and send a photo of the item. Our team will advise what can be done." />
        <div className="grid gap-4 md:grid-cols-5">
          {options.map((item) => <div key={item} className="rounded-md border border-espresso/10 bg-white p-5 text-sm font-semibold text-coffee shadow-soft">{item}</div>)}
        </div>
        <Link href="/inquiry" className="mt-8 inline-flex min-h-11 items-center rounded-md bg-espresso px-5 text-sm font-semibold text-cream">Submit Customization Inquiry</Link>
      </section>
    </SiteShell>
  );
}
