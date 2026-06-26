import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Award, Compass, Heart, MessageCircle, Phone, ShieldCheck, Star, Users } from "lucide-react";
import { config, siteUrl, whatsappLink } from "@/lib/config";
import { loadAllTours } from "@/lib/tours";
import { TourCard } from "@/components/TourCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${config.companyName} – ${config.slogan}` },
      { name: "description", content: `${config.companyName} crafts unforgettable Sri Lanka tours. ${config.slogan}.` },
      { property: "og:title", content: `${config.companyName} – ${config.slogan}` },
      { property: "og:description", content: `Discover Sri Lanka with local experts. ${config.slogan}.` },
      { property: "og:image", content: "/images/hero.jpg" },
      { property: "og:url", content: siteUrl("/") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/") }],
  }),
  component: HomePage,
});

type Review = { name: string; from: string; rating?: number; text: string };

async function loadReviews(): Promise<Review[]> {
  const res = await fetch("/reviews.json");
  if (!res.ok) return [];
  return res.json();
}

function HomePage() {
  const { data: tours = [] } = useQuery({ queryKey: ["tours"], queryFn: loadAllTours });
  const { data: testimonials = [] } = useQuery({ queryKey: ["reviews"], queryFn: loadReviews });
  const featured = tours.slice(0, 3);


  return (
    <>
      {/* HERO */}
      <section className="relative -mt-[72px] min-h-[100svh] w-full overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt="Sri Lanka tea hills at sunrise"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-start justify-end px-4 pb-20 pt-32 sm:px-6 md:justify-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur"
          >
            Discover Sri Lanka
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.05] text-white sm:text-6xl md:text-7xl"
          >
            {config.companyName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 max-w-xl text-lg text-white/85 sm:text-xl"
          >
            {config.slogan}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-7 py-3.5 text-sm font-semibold text-[var(--jungle)] shadow-lg transition hover:scale-105"
            >
              <Compass size={16} /> Explore Tours
            </Link>
            <a
              href={whatsappLink(`Hello ${config.companyName}, I'd love to plan a trip!`)}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 md:py-28">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">About Us</span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
          Sri Lanka, the way a local would show you
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Based in the misty hills of Gampola, {config.companyName} is a family-run tour company crafting
          private, thoughtfully designed journeys across our island home. From ancient kingdoms and emerald
          tea country to wild safaris and golden beaches — we'll show you the Sri Lanka most travellers never see.
        </p>
      </section>

      {/* FEATURED TOURS */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">Featured</span>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Our most loved journeys</h2>
          </div>
          <Link to="/tours" className="hidden text-sm font-semibold text-[var(--jungle)] hover:text-[var(--gold)] sm:inline">
            View all →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t, i) => <TourCard key={t.id} tour={t} index={i} />)}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-[var(--secondary)] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">Why Choose Us</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Crafted with care, guided with heart</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Award, t: "Professional Guides", d: "Licensed, multilingual guides who love sharing their home." },
              { Icon: ShieldCheck, t: "Comfortable Transport", d: "Modern, air-conditioned vehicles for every group size." },
              { Icon: Heart, t: "Best Prices", d: "Direct rates with no middlemen. Transparent and fair." },
              { Icon: Users, t: "Local Experience", d: "Hidden gems, family homes, and authentic encounters." },
            ].map(({ Icon, t, d }, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--jungle)] text-[var(--gold)]">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">Travellers' Stories</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Loved by guests worldwide</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((tt, i) => (
            <motion.figure
              key={tt.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex gap-1 text-[var(--gold)]">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={16} fill="currentColor" />)}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/85">"{tt.text}"</blockquote>
              <figcaption className="mt-5 text-sm">
                <div className="font-semibold">{tt.name}</div>
                <div className="text-muted-foreground">{tt.from}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--jungle)] px-6 py-14 text-center text-white sm:px-12 md:py-20">
          <div className="absolute inset-0 opacity-30">
            <img src="/images/tours/sigiriya.jpg" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              Ready for your Sri Lanka story?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Tell us how you'd like to travel — we'll design a journey just for you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={whatsappLink(`Hello ${config.companyName}, I'd like to plan a trip!`)}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-7 py-3.5 text-sm font-semibold text-[var(--jungle)] shadow-lg transition hover:scale-105"
              >
                <MessageCircle size={16} /> WhatsApp Us
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
              >
                <Phone size={16} /> Contact Form
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
