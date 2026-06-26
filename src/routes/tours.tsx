import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { loadAllTours } from "@/lib/tours";
import { TourCard } from "@/components/TourCard";
import { config, siteUrl } from "@/lib/config";

export const Route = createFileRoute("/tours")({
  head: () => ({
    meta: [
      { title: `Tours – ${config.companyName}` },
      { name: "description", content: `Explore handcrafted Sri Lanka tours by ${config.companyName}. Adventure, culture, wildlife and beaches.` },
      { property: "og:title", content: `Tours – ${config.companyName}` },
      { property: "og:description", content: "Browse all curated Sri Lanka tour experiences." },
      { property: "og:url", content: siteUrl("/tours") },
      { property: "og:image", content: "/images/hero.jpg" },
    ],
    links: [{ rel: "canonical", href: siteUrl("/tours") }],
  }),
  component: ToursPage,
});

function ToursPage() {
  const { data: tours = [], isLoading } = useQuery({ queryKey: ["tours"], queryFn: loadAllTours });

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-[var(--secondary)] px-4 py-20 sm:px-6 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">Our Tours</span>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl md:text-6xl">Choose your Sri Lanka journey</h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Hand-picked experiences from misty highlands to wild jungles and golden coastlines.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : tours.length === 0 ? (
          <p className="text-center text-muted-foreground">No tours available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((t, i) => <TourCard key={t.id} tour={t} index={i} />)}
          </div>
        )}
      </section>
    </>
  );
}
