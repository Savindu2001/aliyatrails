export const config = {
  siteTitle: import.meta.env.VITE_SITE_TITLE ?? "Aliya Trails Lanka Tour",
  companyName: import.meta.env.VITE_COMPANY_NAME ?? "Aliya Trails Lanka Tour",
  slogan: import.meta.env.VITE_SLOGAN ?? "One Journey, Countless Memories",
  whatsapp: import.meta.env.VITE_WHATSAPP ?? "94701575521",
  email: import.meta.env.VITE_EMAIL ?? "aliyatrailanka@gmail.com",
  address: import.meta.env.VITE_ADDRESS ?? "Gampola, Sri Lanka",
  currency: import.meta.env.VITE_CURRENCY ?? "USD",
  facebook: import.meta.env.VITE_FACEBOOK ?? "#",
  instagram: import.meta.env.VITE_INSTAGRAM ?? "#",
  siteUrl: import.meta.env.VITE_SITE_URL ?? "https://aliyatrails.netlify.app",
  devUrl: import.meta.env.VITE_DEV_URL ?? "http://localhost:8080",
};

export function siteUrl(path = "") {
  const base = import.meta.env.DEV ? config.devUrl : config.siteUrl;
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function whatsappLink(message: string) {
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
}

