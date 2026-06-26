import { Link } from "@tanstack/react-router";
import { Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import type { Tour } from "@/lib/tours";
import { config } from "@/lib/config";

export function TourCard({ tour, index = 0 }: { tour: Tour; index?: number }) {
  const startPrice = Math.min(...tour.pricing.map((p) => p.price));
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-luxe)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={tour.heroImage}
          alt={tour.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
          from {config.currency} {startPrice}
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {tour.duration}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={12} /> {tour.location}</span>
        </div>
        <h3 className="mt-2 font-display text-xl font-bold text-foreground">{tour.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{tour.shortDescription}</p>
        <Link
          to="/tour/$id"
          params={{ id: tour.id }}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--jungle)] hover:text-[var(--gold)]"
        >
          View Details →
        </Link>
      </div>
    </motion.article>
  );
}
