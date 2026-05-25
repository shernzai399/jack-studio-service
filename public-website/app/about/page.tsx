import { SiteShell, PageHero, SectionTitle } from "@/components/site-shell";
import { stores } from "@/lib/site-data";

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="About"
        title="A modern hub for leather, luggage and craft service"
        text="JACK STUDIO HUB connects service expertise, retail outlet support and customer care into one warm, professional repair experience."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1fr_0.9fr] md:px-8">
        <div>
          <SectionTitle eyebrow="Our role" title="Service care behind the JACK STUDIO experience" />
          <div className="grid gap-4 text-base leading-7 text-coffee/78">
            <p>
              JACK STUDIO HUB is created for customers who want practical repair support, premium leather care and thoughtful personalization for the items they carry every day.
            </p>
            <p>
              The Hub supports inquiries from social media, Google search, WhatsApp and JACK STUDIO retail outlets, helping customers understand what can be repaired, restored or customized.
            </p>
          </div>
        </div>
        <div className="rounded-md border border-espresso/10 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Connected outlets</p>
          <h2 className="mt-3 text-2xl font-semibold text-espresso">Preferred drop-off and follow-up locations</h2>
          <div className="mt-5 grid gap-2 text-sm text-coffee/78">
            {stores.map((store) => <p key={store}>{store}</p>)}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
