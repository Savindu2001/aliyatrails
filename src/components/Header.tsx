import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { config } from "@/lib/config";

const nav = [
  { to: "/", label: "Home" },
  { to: "/tours", label: "Tours" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/85 backdrop-blur border-b border-border shadow-sm" : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img
            src={"/images/logo.jpg"}
            alt={`${config.companyName} logo`}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full bg-white object-contain ring-1 ring-border"
          />
          <span className="truncate font-display text-lg font-bold leading-tight text-foreground sm:text-xl">
            {config.companyName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-[var(--gold)]" }}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-[var(--gold)]"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/tours"
            className="rounded-full bg-[var(--jungle)] px-5 py-2.5 text-sm font-semibold text-[var(--gold)] shadow-sm transition hover:opacity-90"
          >
            Explore Tours
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background/60 text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-[var(--gold)]" }}
                className="rounded-md px-3 py-3 text-base font-medium text-foreground/85 hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
