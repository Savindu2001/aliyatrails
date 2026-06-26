export type PricingOption = { label: string; price: number };
export type ItineraryItem = { day: string; details: string };

export type Tour = {
  id: string;
  title: string;
  duration: string;
  location: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  gallery: string[];
  pricing: PricingOption[];
  included: string[];
  excluded: string[];
  itinerary: ItineraryItem[];
};

export async function loadAllTours(): Promise<Tour[]> {
  const indexRes = await fetch("/tours.json");
  if (!indexRes.ok) throw new Error("Failed to load tours index");
  const files: string[] = await indexRes.json();
  const tours = await Promise.all(
    files.map(async (file) => {
      const res = await fetch(`/${file}`);
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      return (await res.json()) as Tour;
    }),
  );
  return tours;
}

export async function loadTourById(id: string): Promise<Tour | null> {
  const tours = await loadAllTours();
  return tours.find((t) => t.id === id) ?? null;
}
