import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteShell, SectionTitle } from "@/components/site-shell";
import { howItWorks, serviceHighlights, whatsappUrl } from "@/lib/site-data";

export default function HomePage() {
  return (
    <SiteShell>
      <section className="hero-image min-h-[86vh] bg-espresso text-cream">
        <div className="mx-auto flex min-h-[86vh] max-w-7xl items-center px-4 py-20 md:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Modern Craft Service Hub</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-normal md:text-7xl">JACK STUDIO HUB</h1>
            <p className="mt-4 text-xl font-medium text-cream/88">Modern Leather & Luggage Service Hub</p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-cream/78 md:text-lg">
              Repair, restore, personalize and experience craftsmanship through our leather and luggage service ecosystem.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={whatsappUrl} className="inline-flex min-h-11 items-center rounded-md bg-gold px-5 text-sm font-semibold text-espresso transition hover:bg-cream">WhatsApp Us</a>
              <Link href="/inquiry" className="inline-flex min-h-11 items-center rounded-md border border-cream/35 px-5 text-sm font-semibold text-cream transition hover:bg-cream hover:text-espresso">Submit Inquiry</Link>
              <Link href="/services" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-cream/10 px-5 text-sm font-semibold text-cream transition hover:bg-cream/18">
                View Services <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <SectionTitle eyebrow="Services" title="Crafted care for travel and leather goods" text="From luggage repairs to custom engraving, JACK STUDIO HUB helps customers extend the life and story of their favourite items." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceHighlights.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.title} href={service.href} className="rounded-md border border-espresso/10 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-gold">
                <div className="grid size-11 place-items-center rounded-md bg-warm text-leather"><Icon size={22} /></div>
                <h3 className="mt-4 text-xl font-semibold text-espresso">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-coffee/75">{service.text}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[0.95fr_1.05fr] md:px-8">
          <div className="workshop-image min-h-[420px] rounded-md" />
          <div>
            <SectionTitle eyebrow="Why JACK STUDIO HUB" title="A connected service experience" />
            <div className="grid gap-4">
              {["Modern service experience", "Professional repair workflow", "Leather and luggage expertise", "Connected with JACK STUDIO retail stores", "Inquiry and support through WhatsApp"].map((item) => (
                <div key={item} className="flex gap-3 rounded-md border border-espresso/10 bg-cream p-4">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-gold" size={20} />
                  <p className="font-medium text-coffee">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <SectionTitle eyebrow="How it works" title="Simple support from photo to collection" />
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <div key={step} className="rounded-md border border-espresso/10 bg-white p-5">
              <p className="text-sm font-semibold text-gold">Step {index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-espresso">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-warm">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <SectionTitle eyebrow="Before / After" title="Repair transformation previews" text="Placeholder cards for future customer repair transformation photos." />
          <div className="grid gap-4 md:grid-cols-3">
            {["Wheel Repair", "Leather Restore", "Zip Recovery"].map((item) => (
              <div key={item} className="overflow-hidden rounded-md border border-espresso/10 bg-white shadow-soft">
                <div className="grid grid-cols-2">
                  <div className="grid h-44 place-items-center bg-coffee text-sm font-semibold text-cream/75">Before</div>
                  <div className="grid h-44 place-items-center bg-cream text-sm font-semibold text-coffee">After</div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-espresso">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="rounded-md bg-espresso p-6 text-cream md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Store Support</p>
          <h2 className="mt-3 text-3xl font-semibold">JACK STUDIO retail outlet support</h2>
          <p className="mt-4 max-w-3xl leading-7 text-cream/78">
            JACK STUDIO HUB supports JACK STUDIO retail outlets and customers can choose a preferred store for drop-off or follow-up.
          </p>
        </div>
      </section>

      <section className="leather-texture text-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center md:px-8">
          <h2 className="text-3xl font-semibold md:text-5xl">Need repair or leather care advice?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-cream/78">Send us your item photo and our team will assist you.</p>
          <a href={whatsappUrl} className="mt-8 inline-flex min-h-11 items-center rounded-md bg-gold px-5 text-sm font-semibold text-espresso transition hover:bg-cream">WhatsApp Us</a>
        </div>
      </section>
    </SiteShell>
  );
}
