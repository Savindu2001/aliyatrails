import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, MapPin, MessageCircle, X } from "lucide-react";
import { loadAllTours, type Tour } from "@/lib/tours";
import { config, whatsappLink } from "@/lib/config";

export const Route = createFileRoute("/tour/$id")({
  head: () => ({
    meta: [
      { title: `Tour – ${config.companyName}` },
      { name: "description", content: `Discover authentic tours with ${config.companyName}.` },
    ],
  }),
  component: TourDetail,
});

function TourDetail() {
  const { id } = Route.useParams();
  const { data: tours, isLoading, error } = useQuery({
    queryKey: ["tours"],
    queryFn: loadAllTours,
  });
  const tour = tours?.find((t) => t.id === id) ?? null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md px-4 py-32 text-center">
        <p className="text-muted-foreground">Loading tour…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-32 text-center">
        <h1 className="font-display text-3xl font-bold">Failed to load tour</h1>
        <p className="mt-3 text-sm text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="mx-auto max-w-md px-4 py-32 text-center">
        <h1 className="font-display text-4xl font-bold">Tour not found</h1>
        <p className="mt-3 text-muted-foreground">This tour may have moved or been retired.</p>
        <Link to="/tours" className="mt-6 inline-flex rounded-full bg-[var(--jungle)] px-6 py-3 text-sm font-semibold text-[var(--gold)]">Browse all tours</Link>
      </div>
    );
  }

  return <TourBody tour={tour} />;
}

function TourBody({ tour }: { tour: Tour }) {
  const [selected, setSelected] = useState(tour.pricing[0]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const bookMessage = `Hello, I am interested in the tour:\n${tour.title}\n\nPricing Option:\n${selected.label} – ${config.currency} ${selected.price}`;

  return (
    <>
      <section className="relative -mt-[72px] h-[75vh] min-h-[520px] w-full overflow-hidden">
        <img src={tour.heroImage} alt={tour.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-14 pt-32 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link to="/tours" className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80 hover:text-white">← All Tours</Link>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur"><Clock size={13} /> {tour.duration}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur"><MapPin size={13} /> {tour.location}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)] px-3 py-1.5 text-xs font-bold text-[var(--jungle)]">From {config.currency} {Math.min(...tour.pricing.map(p => p.price))}</span>
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">{tour.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-white drop-shadow sm:text-xl">{tour.shortDescription}</p>
          </motion.div>
        </div>
      </section>


      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          <section>
            <h2 className="font-display text-2xl font-bold">Overview</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{tour.description}</p>
          </section>

          {tour.gallery?.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold">Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {tour.gallery.map((img, i) => (
                  <button key={i} onClick={() => setLightbox(img)} className="group overflow-hidden rounded-xl">
                    <img src={img} alt={`${tour.title} ${i + 1}`} loading="lazy" className="aspect-square h-full w-full object-cover transition group-hover:scale-110" />
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-xl font-bold">What's included</h3>
              <ul className="mt-4 space-y-2">
                {tour.included.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0 text-[var(--jungle)]" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">Not included</h3>
              <ul className="mt-4 space-y-2">
                {tour.excluded.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <X size={16} className="mt-0.5 shrink-0 text-destructive" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">Itinerary</h2>
            <ol className="mt-6 space-y-4 border-l-2 border-[var(--gold)]/40 pl-6">
              {tour.itinerary.map((step, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full bg-[var(--jungle)] text-xs font-bold text-[var(--gold)]">{i + 1}</span>
                  <h4 className="font-display text-lg font-bold">{step.day}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{step.details}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-luxe)]">
            <h3 className="font-display text-xl font-bold">Choose your group</h3>
            <p className="mt-1 text-sm text-muted-foreground">Pricing in {config.currency}, all inclusive of listed services.</p>
            <div className="mt-5 space-y-2">
              {tour.pricing.map((p) => {
                const active = p.label === selected.label;
                return (
                  <button
                    key={p.label}
                    onClick={() => setSelected(p)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      active ? "border-[var(--gold)] bg-[var(--gold)]/10" : "border-border hover:border-[var(--gold)]/50"
                    }`}
                  >
                    <span className="text-sm font-medium">{p.label}</span>
                    <span className="font-display text-lg font-bold">{config.currency} {p.price}</span>
                  </button>
                );
              })}
            </div>
            <a
              href={whatsappLink(bookMessage)}
              target="_blank" rel="noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--jungle)] py-3.5 text-sm font-semibold text-[var(--gold)] transition hover:opacity-90"
            >
              <MessageCircle size={16} /> Book Now via WhatsApp
            </a>
            <p className="mt-3 text-center text-xs text-muted-foreground">No payment required to enquire</p>
          </div>
        </aside>
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4">
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-full rounded-lg object-contain" />
          <button className="absolute right-6 top-6 text-white" onClick={() => setLightbox(null)}><X /></button>
        </div>
      )}
    </>
  );
}
