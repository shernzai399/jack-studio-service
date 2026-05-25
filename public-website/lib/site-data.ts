import { Brush, Hammer, Luggage, MessageCircle, PenTool, ShieldCheck, Sparkles, Store, Wrench } from "lucide-react";

export const whatsappNumber = "60XXXXXXXXX";
export const whatsappMessage = "Hi JACK STUDIO HUB, I would like to ask about your service.";
export const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

export const stores = [
  "JACK STUDIO HUB",
  "AEON BUKIT TINGGI",
  "PARADIGM MALL",
  "MAIN PLACE",
  "ALAMANDA Putrajaya",
  "BERJAYA TIME SQUARE",
  "AEON KULAIJAYA",
  "AEON PERMASJAYA",
  "AEON BUKIT INDAH",
  "MAYANG MALL",
  "ECM",
  "SUNWAY CARNIVAL",
  "AEON SEREMBAN2",
  "AEON ALPHA ANGLE"
];

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/inquiry", label: "Inquiry" },
  { href: "/contact", label: "Contact" }
];

export const serviceHighlights = [
  { title: "Luggage Repair", text: "Wheels, zips, handles, locks, shells and travel wear recovery.", icon: Luggage, href: "/luggage-repair" },
  { title: "Leather Care", text: "Cleaning, polishing, conditioning, recolor and protection care.", icon: ShieldCheck, href: "/leather-care" },
  { title: "Handcraft", text: "Hands-on leather craft sessions for individuals, teams and brands.", icon: Hammer, href: "/handcraft-workshop" },
  { title: "Customization", text: "Personal initials, tags, accessories and bespoke finishing.", icon: Sparkles, href: "/customization-engraving" },
  { title: "Engraving", text: "Names, initials and thoughtful personalization on selected items.", icon: PenTool, href: "/customization-engraving" },
  { title: "Workshop", text: "DIY keychains, cardholders, corporate gifts and team building.", icon: Brush, href: "/handcraft-workshop" }
];

export const serviceCards = [
  {
    title: "Luggage Repair",
    href: "/luggage-repair",
    icon: Wrench,
    items: ["Wheel replacement", "Zip repair", "Handle repair", "Lock repair", "Shell repair"]
  },
  {
    title: "Leather Care",
    href: "/leather-care",
    icon: ShieldCheck,
    items: ["Leather cleaning", "Leather polishing", "Conditioning", "Recolor", "Protection"]
  },
  {
    title: "Customization",
    href: "/customization-engraving",
    icon: PenTool,
    items: ["Engraving", "Embossing", "Initials", "Custom tag", "Custom accessories"]
  },
  {
    title: "Handcraft Workshop",
    href: "/handcraft-workshop",
    icon: Store,
    items: ["DIY leather keychain", "DIY cardholder", "Corporate workshop", "Team building"]
  }
];

export const howItWorks = [
  "Submit inquiry",
  "Upload photos",
  "Our team checks and quotes",
  "Drop off at selected store or Hub",
  "Repair / service completed",
  "Collect item"
];

export const serviceTypes = [
  "Luggage Repair",
  "Leather Care",
  "Handcraft Workshop",
  "Customization / Engraving",
  "General Service Advice"
];

export const productTypes = ["Luggage", "Bag", "Wallet", "Leather accessory", "Travel accessory", "Others"];

export const contactOptions = ["Morning", "Afternoon", "Evening", "Anytime"];

export const imageUrls = {
  hero: "https://source.unsplash.com/Fn63GGFHNiM/1800x1200",
  workshop: "https://source.unsplash.com/Z6bJJEhzByc/1200x900",
  luggage: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=1200&q=80",
  leather: "https://source.unsplash.com/0o4WkIo8RnU/1200x900"
};

export { MessageCircle };
