import Link from "next/link";
import type { ReactNode } from "react";
import { Menu, MessageCircle } from "lucide-react";
import { navItems, whatsappUrl } from "@/lib/site-data";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-30 border-b border-espresso/10 bg-cream/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link href="/" className="grid gap-0.5">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">JACK STUDIO</span>
            <span className="text-lg font-semibold text-espresso">Service Hub</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-coffee md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-leather">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={whatsappUrl} className="hidden min-h-10 items-center rounded-md bg-espresso px-4 text-sm font-semibold text-cream transition hover:bg-leather sm:inline-flex">
              WhatsApp Us
            </a>
            <details className="relative md:hidden">
              <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-md border border-espresso/15 bg-white text-espresso">
                <Menu size={20} />
              </summary>
              <nav className="absolute right-0 mt-3 grid w-56 gap-1 rounded-md border border-espresso/10 bg-white p-2 text-sm font-medium shadow-soft">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-coffee hover:bg-warm">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-espresso/10 bg-espresso text-cream">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">JACK STUDIO HUB</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-cream/75">
              Modern leather and luggage service support for repairs, restoration, personalization and customer care.
            </p>
          </div>
          <div>
            <p className="font-semibold">Services</p>
            <div className="mt-3 grid gap-2 text-sm text-cream/75">
              <Link href="/luggage-repair">Luggage Repair</Link>
              <Link href="/leather-care">Leather Care</Link>
              <Link href="/customization-engraving">Customization / Engraving</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold">Contact</p>
            <a href={whatsappUrl} className="mt-3 inline-flex text-sm font-semibold text-gold">WhatsApp JACK STUDIO HUB</a>
          </div>
        </div>
      </footer>
      <a
        href={whatsappUrl}
        aria-label="WhatsApp JACK STUDIO HUB"
        className="fixed bottom-5 right-5 z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:scale-105"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}

export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="bg-espresso text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-cream/78 md:text-lg">{text}</p>
      </div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-espresso md:text-4xl">{title}</h2>
      {text && <p className="mt-4 max-w-2xl text-base leading-7 text-coffee/75">{text}</p>}
    </div>
  );
}
