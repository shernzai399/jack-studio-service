import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteShell, PageHero, SectionTitle } from "@/components/site-shell";
import { serviceCards } from "@/lib/site-data";

export default function ServicesPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Services"
        title="Repair, restore, personalize and craft"
        text="Explore JACK STUDIO HUB services for luggage, leather goods, customization and hands-on leather workshops."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <SectionTitle eyebrow="What we do" title="Detailed service options" />
        <div className="grid gap-5 md:grid-cols-2">
          {serviceCards.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.title} href={service.href} className="rounded-md border border-espresso/10 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-gold">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-12 place-items-center rounded-md bg-warm text-leather"><Icon size={24} /></div>
                  <ArrowRight className="text-gold" size={20} />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-espresso">{service.title}</h2>
                <ul className="mt-4 grid gap-2 text-sm text-coffee/78">
                  {service.items.map((item) => <li key={item}>- {item}</li>)}
                </ul>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}
