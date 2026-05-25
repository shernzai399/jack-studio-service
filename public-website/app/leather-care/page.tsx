import Link from "next/link";
import { SiteShell, PageHero, SectionTitle } from "@/components/site-shell";

const care = ["Leather cleaning", "Leather polishing", "Conditioning", "Recolor", "Protection"];

export default function LeatherCarePage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Leather Care" title="Warm, careful care for leather goods" text="Clean, polish, condition and refresh selected leather items with a service approach built around material care." />
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <SectionTitle eyebrow="Care options" title="Leather care services" text="Share photos of your item and tell us the condition. Our team will advise based on the leather surface and service suitability." />
        <div className="grid gap-4 md:grid-cols-5">
          {care.map((item) => <div key={item} className="rounded-md border border-espresso/10 bg-white p-5 text-sm font-semibold text-coffee shadow-soft">{item}</div>)}
        </div>
        <Link href="/inquiry" className="mt-8 inline-flex min-h-11 items-center rounded-md bg-espresso px-5 text-sm font-semibold text-cream">Ask About Leather Care</Link>
      </section>
    </SiteShell>
  );
}
