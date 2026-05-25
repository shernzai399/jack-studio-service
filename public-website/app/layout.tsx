import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "JACK STUDIO HUB | Leather & Luggage Service",
  description: "Repair, restore, personalize and experience craftsmanship through JACK STUDIO HUB leather and luggage services."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
