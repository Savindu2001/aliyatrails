import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { config, whatsappLink } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-[var(--jungle)] text-white/85">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <h3 className="font-display text-xl font-bold text-[var(--gold)]">{config.companyName}</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            {config.slogan}. Authentic, locally-guided journeys across the wonders of Sri Lanka.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[var(--gold)]">Home</Link></li>
            <li><Link to="/tours" className="hover:text-[var(--gold)]">Tours</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--gold)]">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" />{config.address}</li>
            <li className="flex items-start gap-2"><Mail size={16} className="mt-0.5 shrink-0" /><a href={`mailto:${config.email}`} className="hover:text-[var(--gold)] break-all">{config.email}</a></li>
            <li className="flex items-start gap-2"><Phone size={16} className="mt-0.5 shrink-0" /><a href={`tel:+${config.whatsapp}`} className="hover:text-[var(--gold)]">+{config.whatsapp}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Connect</h4>
          <div className="mt-4 flex gap-3">
            <a href={whatsappLink(`Hello ${config.companyName}!`)} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-[var(--gold)] hover:text-[var(--jungle)]"><MessageCircle size={18} /></a>
            <a href={config.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-[var(--gold)] hover:text-[var(--jungle)]"><Facebook size={18} /></a>
            <a href={config.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-[var(--gold)] hover:text-[var(--jungle)]"><Instagram size={18} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/60 sm:px-6">
        © {new Date().getFullYear()} {config.companyName}. All rights reserved. · Developed by Savindu
      </div>
    </footer>
  );
}
