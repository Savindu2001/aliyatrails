import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Trash2, Pencil, FileJson } from "lucide-react";
import { loadAllTours, type Tour } from "@/lib/tours";

export const Route = createFileRoute("/admin/tours")({
  head: () => ({
    meta: [
      { title: "Admin – Tours" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminToursPage,
});

const empty: Tour = {
  id: "",
  title: "",
  duration: "",
  location: "",
  shortDescription: "",
  description: "",
  heroImage: "",
  gallery: [],
  pricing: [{ label: "1 Adult", price: 0 }],
  included: [],
  excluded: [],
  itinerary: [{ day: "Day 1", details: "" }],
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function AdminToursPage() {
  const { data: tours = [], refetch } = useQuery({ queryKey: ["tours"], queryFn: loadAllTours });
  const [editing, setEditing] = useState<Tour | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Tour Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add or edit tours. On save you'll download a JSON file — drop it into
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">public/</code>
            and update <code className="rounded bg-muted px-1.5 py-0.5 text-xs">public/tours.json</code>.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90"
        >
          <Plus size={16} /> New Tour
        </button>
      </div>

      {editing ? (
        <TourEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); refetch(); }}
        />
      ) : (
        <TourList tours={tours} onEdit={(t) => setEditing(structuredClone(t))} />
      )}
    </div>
  );
}

function TourList({ tours, onEdit }: { tours: Tour[]; onEdit: (t: Tour) => void }) {
  const indexJson = useMemo(
    () => JSON.stringify(tours.map((t) => `${t.id}.json`), null, 2),
    [tours],
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => download("tours.json", indexJson)}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
        >
          <FileJson size={14} /> Download tours.json index
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tours.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{t.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.id}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.location}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit(t)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                </td>
              </tr>
            ))}
            {tours.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No tours yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Props = { initial: Tour; onClose: () => void; onSaved: () => void };

function TourEditor({ initial, onClose }: Props) {
  const [t, setT] = useState<Tour>(initial);

  useEffect(() => { setT(initial); }, [initial]);

  const set = <K extends keyof Tour>(k: K, v: Tour[K]) => setT((p) => ({ ...p, [k]: v }));
  const autoId = !initial.id;

  function handleSave() {
    const id = (t.id || slugify(t.title)).trim();
    if (!id || !t.title.trim()) { alert("Title and ID are required"); return; }
    const out: Tour = { ...t, id };
    download(`${id}.json`, JSON.stringify(out, null, 2));
  }

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">{initial.id ? "Edit tour" : "New tour"}</h2>
        <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <input
            value={t.title}
            onChange={(e) => {
              const title = e.target.value;
              setT((p) => ({ ...p, title, id: autoId ? slugify(title) : p.id }));
            }}
            className={inputCls}
          />
        </Field>
        <Field label="ID (slug, used in URL & filename)">
          <input value={t.id} onChange={(e) => set("id", slugify(e.target.value))} className={inputCls} />
        </Field>
        <Field label="Duration"><input value={t.duration} onChange={(e) => set("duration", e.target.value)} className={inputCls} placeholder="3 Days" /></Field>
        <Field label="Location"><input value={t.location} onChange={(e) => set("location", e.target.value)} className={inputCls} placeholder="Ella, Sri Lanka" /></Field>
        <Field label="Hero Image path" className="sm:col-span-2">
          <input value={t.heroImage} onChange={(e) => set("heroImage", e.target.value)} className={inputCls} placeholder="/images/tours/ella.jpg" />
        </Field>
        <Field label="Short Description" className="sm:col-span-2">
          <textarea value={t.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} rows={2} className={inputCls} />
        </Field>
        <Field label="Full Description" className="sm:col-span-2">
          <textarea value={t.description} onChange={(e) => set("description", e.target.value)} rows={5} className={inputCls} />
        </Field>
      </div>

      <StringList label="Gallery image paths" items={t.gallery} onChange={(v) => set("gallery", v)} placeholder="/images/tours/x.jpg" />

      <div>
        <SectionLabel>Pricing</SectionLabel>
        <div className="space-y-2">
          {t.pricing.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input className={inputCls} placeholder="Label (e.g. 2 Adults)" value={p.label} onChange={(e) => {
                const arr = [...t.pricing]; arr[i] = { ...arr[i], label: e.target.value }; set("pricing", arr);
              }} />
              <input type="number" className={`${inputCls} w-32`} placeholder="Price" value={p.price} onChange={(e) => {
                const arr = [...t.pricing]; arr[i] = { ...arr[i], price: Number(e.target.value) || 0 }; set("pricing", arr);
              }} />
              <RemoveBtn onClick={() => set("pricing", t.pricing.filter((_, j) => j !== i))} />
            </div>
          ))}
          <AddBtn onClick={() => set("pricing", [...t.pricing, { label: "", price: 0 }])} text="Add price tier" />
        </div>
      </div>

      <StringList label="What's included" items={t.included} onChange={(v) => set("included", v)} />
      <StringList label="Not included" items={t.excluded} onChange={(v) => set("excluded", v)} />

      <div>
        <SectionLabel>Itinerary</SectionLabel>
        <div className="space-y-2">
          {t.itinerary.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input className={`${inputCls} w-32`} placeholder="Day 1" value={s.day} onChange={(e) => {
                const arr = [...t.itinerary]; arr[i] = { ...arr[i], day: e.target.value }; set("itinerary", arr);
              }} />
              <textarea className={inputCls} rows={2} placeholder="Details" value={s.details} onChange={(e) => {
                const arr = [...t.itinerary]; arr[i] = { ...arr[i], details: e.target.value }; set("itinerary", arr);
              }} />
              <RemoveBtn onClick={() => set("itinerary", t.itinerary.filter((_, j) => j !== i))} />
            </div>
          ))}
          <AddBtn onClick={() => set("itinerary", [...t.itinerary, { day: `Day ${t.itinerary.length + 1}`, details: "" }])} text="Add day" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-6">
        <button onClick={onClose} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted">Cancel</button>
        <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90">
          <Download size={16} /> Save & Download JSON
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        After downloading, place the file in <code className="rounded bg-muted px-1 py-0.5">public/</code> as
        <code className="mx-1 rounded bg-muted px-1 py-0.5">{(t.id || "your-id")}.json</code>
        {!initial.id && <> and add <code className="rounded bg-muted px-1 py-0.5">"{(t.id || "your-id")}.json"</code> to <code className="rounded bg-muted px-1 py-0.5">public/tours.json</code></>}.
      </p>
    </div>
  );
}

const inputCls = "flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 font-display text-lg font-bold">{children}</h3>;
}

function StringList({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input className={inputCls} value={it} placeholder={placeholder} onChange={(e) => {
              const arr = [...items]; arr[i] = e.target.value; onChange(arr);
            }} />
            <RemoveBtn onClick={() => onChange(items.filter((_, j) => j !== i))} />
          </div>
        ))}
        <AddBtn onClick={() => onChange([...items, ""])} text={`Add item`} />
      </div>
    </div>
  );
}

function AddBtn({ onClick, text }: { onClick: () => void; text: string }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted">
      <Plus size={12} /> {text}
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Remove" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-destructive">
      <Trash2 size={14} />
    </button>
  );
}
