import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { config, siteUrl, whatsappLink } from "@/lib/config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact – ${config.companyName}` },
      { name: "description", content: `Get in touch with ${config.companyName}. We respond within 24 hours.` },
      { property: "og:title", content: `Contact – ${config.companyName}` },
      { property: "og:description", content: "Reach out to plan your Sri Lanka journey." },
      { property: "og:url", content: siteUrl("/contact") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/contact") }],
  }),
  component: ContactPage,
});


function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      // formsubmit.co — delivers the form to the env email with zero backend.
      // First submission requires a one-time confirmation click on the email link.
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(config.email)}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
      form.reset();
    } catch (err) {
      setError((err as Error).message || "Could not send message. Please WhatsApp us instead.");
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <>
      <section className="border-b border-border bg-[var(--secondary)] px-4 py-20 sm:px-6 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">Get in touch</span>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl md:text-6xl">Let's plan your journey</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Tell us your dates, your dream destinations and how you like to travel — we'll handle the rest.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3">
        {/* Info */}
        <aside className="space-y-6 lg:col-span-1">
          <InfoCard Icon={MapPin} title="Visit Us" body={config.address} />
          <InfoCard Icon={Mail} title="Email" body={config.email} href={`mailto:${config.email}`} />
          <InfoCard Icon={Phone} title="Call / WhatsApp" body={`+${config.whatsapp}`} href={`tel:+${config.whatsapp}`} />
          <a
            href={whatsappLink(`Hello ${config.companyName}!`)}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--jungle)] px-5 py-4 text-sm font-semibold text-[var(--gold)] shadow-[var(--shadow-luxe)]"
          >
            <MessageCircle size={18} /> Chat instantly on WhatsApp
          </a>
        </aside>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
            {sent ? (
              <div className="py-10 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--gold)]/20 text-[var(--jungle)]">
                  <Send size={24} />
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold">Thank you!</h2>
                <p className="mt-2 text-muted-foreground">We've received your message and will reply within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 rounded-full border border-border px-5 py-2.5 text-sm font-semibold">Send another message</button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="space-y-5"
              >
                <input type="hidden" name="_subject" value={`New enquiry — ${config.companyName}`} />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <p hidden><label>Don't fill this out: <input name="_honey" /></label></p>


                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" name="name" required />
                  <Field label="Email" name="email" type="email" required />
                  <Field label="Phone" name="phone" type="tel" />
                  <Field label="Subject" name="subject" required />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30"
                    placeholder="Tell us about your dream Sri Lanka trip..."
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--jungle)] px-6 py-3.5 text-sm font-semibold text-[var(--gold)] transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
                >
                  {submitting ? "Sending..." : <>Send message <Send size={14} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}{required && <span className="text-[var(--gold)]"> *</span>}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30"
      />
    </div>
  );
}

function InfoCard({ Icon, title, body, href }: { Icon: typeof Mail; title: string; body: string; href?: string }) {
  const content = (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--jungle)] text-[var(--gold)]">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="mt-1 break-words text-sm font-medium text-foreground">{body}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
