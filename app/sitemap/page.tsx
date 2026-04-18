import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/app/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Sitemap | LA Bim Academy",
  description: "Quick sitemap links for LA Bim Academy website.",
};

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/courses", label: "Courses" },
  { href: "/enroll", label: "Enroll" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-conditions", label: "Terms & Conditions" },
];

export default function SitemapPage() {
  return (
    <LegalPageShell
      badge="Sitemap"
      title="Sitemap"
      description="Browse all key pages quickly."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </LegalPageShell>
  );
}