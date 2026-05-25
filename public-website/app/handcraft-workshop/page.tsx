import Link from "next/link";
import { SiteShell, PageHero, SectionTitle } from "@/components/site-shell";

const workshops = ["DIY leather keychain", "DIY cardholder", "Corporate workshop", "Team building"];

export default function HandcraftWorkshopPage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Handcraft Workshop" title="Experience leather craft by hand" text="Hands-on sessions for personal projects, corporate groups and team building moments with a leather craft focus." />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1fr_1fr] md:px-8">
        <div>
          <SectionTitle eyebrow="Workshop menu" title="Craft sessions for individuals and teams" />
          <div className="grid gap-3">
            {workshops.map((workshop) => <div key={workshop} className="rounded-md border border-espresso/10 bg-white p-4 font-medium text-coffee shadow-soft">{workshop}</div>)}
          </div>
          <Link href="/inquiry" className="mt-7 inline-flex min-h-11 items-center rounded-md bg-espresso px-5 text-sm font-semibold text-cream">Plan a Workshop</Link>
        </div>
        <div className="workshop-image min-h-[420px] rounded-md" />
      </section>
    </SiteShell>
  );
}
