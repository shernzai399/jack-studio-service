import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SiteShell, PageHero, SectionTitle } from "@/components/site-shell";
import { stores, whatsappUrl } from "@/lib/site-data";

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Contact" title="Talk to JACK STUDIO HUB" text="Need repair or leather care advice? WhatsApp us or submit an inquiry with item photos." />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div className="rounded-md border border-espresso/10 bg-white p-6 shadow-soft">
          <SectionTitle eyebrow="WhatsApp" title="Fast service advice" text="Send us your item photo and our team will assist you." />
          <a href={whatsappUrl} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#25D366] px-5 text-sm font-semibold text-white">
            <MessageCircle size={18} />
            WhatsApp Us
          </a>
          <Link href="/inquiry" className="ml-3 inline-flex min-h-11 items-center rounded-md border border-espresso/15 px-5 text-sm font-semibold text-espresso">
            Submit Inquiry
          </Link>
        </div>
        <div className="rounded-md border border-espresso/10 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Store support</p>
          <h2 className="mt-3 text-2xl font-semibold text-espresso">Preferred store options</h2>
          <div className="mt-5 grid gap-2 text-sm text-coffee/78 md:grid-cols-2">
            {stores.map((store) => <p key={store}>{store}</p>)}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
