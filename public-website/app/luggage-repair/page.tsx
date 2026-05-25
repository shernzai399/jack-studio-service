import Link from "next/link";
import { SiteShell, PageHero, SectionTitle } from "@/components/site-shell";

const repairs = ["Wheel replacement", "Zip repair", "Handle repair", "Lock repair", "Shell repair"];

export default function LuggageRepairPage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Luggage Repair" title="Bring your travel companion back to work" text="From broken wheels to tired zips, JACK STUDIO HUB helps assess practical repair options for your luggage." />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div className="rounded-md bg-[url('https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
        <div>
          <SectionTitle eyebrow="Repair menu" title="Common luggage repair requests" text="Submit photos of the damaged area so our team can review the condition and advise the next step." />
          <div className="grid gap-3">
            {repairs.map((repair) => <div key={repair} className="rounded-md border border-espresso/10 bg-white p-4 font-medium text-coffee shadow-soft">{repair}</div>)}
          </div>
          <Link href="/inquiry" className="mt-7 inline-flex min-h-11 items-center rounded-md bg-espresso px-5 text-sm font-semibold text-cream">Submit Repair Inquiry</Link>
        </div>
      </section>
    </SiteShell>
  );
}
