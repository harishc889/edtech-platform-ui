/**
 * WhatsApp Business CTA — builds `https://wa.me/<digits>` for consistent opens on mobile & desktop.
 *
 * Env (optional):
 * - `NEXT_PUBLIC_WHATSAPP_BUSINESS_LINK` — full URL (`https://wa.me/...`, `https://api.whatsapp.com/...`) or bare `wa.me/91...`
 * - `NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER` — E.164-style digits e.g. `917895001831` or `+91 78950 01831`
 *
 * If unset, uses the same published support line as `tel:+917895001831` elsewhere on the site.
 */
const DEFAULT_WA_ME = "https://wa.me/917895001831";

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function normalizeHttpLink(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^wa\.me\//i.test(trimmed)) return `https://${trimmed}`;
  if (/^api\.whatsapp\.com\//i.test(trimmed)) return `https://${trimmed}`;
  const d = digitsOnly(trimmed);
  if (d.length >= 10 && d.length <= 15) return `https://wa.me/${d}`;
  return null;
}

/** Target for WhatsApp icon (external wa.me or internal `/contact`). */
export function resolveWhatsAppBusinessHref(): string {
  const link = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_LINK?.trim();
  if (link) {
    if (link.startsWith("/")) return link;
    const resolved = normalizeHttpLink(link);
    if (resolved) return resolved;
  }

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER?.trim();
  if (phone) {
    const d = digitsOnly(phone);
    if (d.length >= 10 && d.length <= 15) return `https://wa.me/${d}`;
  }

  return DEFAULT_WA_ME;
}

export function isExternalWhatsAppHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}
