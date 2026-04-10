import type { Metadata } from "next";
import { LegalPageShell } from "@/app/components/legal-page-shell";

export const metadata: Metadata = {
  title: "About Us | LA Bim Solutions",
  description:
    "Learn about LA Bim Solutions, our mission, and BIM/VDC services.",
};

const capabilities = [
  "Architectural BIM Modeling",
  "Structural BIM Modeling",
  "MEP BIM Modeling",
  "Landscape BIM Modeling",
  "Virtual Design and Construction (VDC)",
  "BIM coordination and project support",
];

export default function AboutPage() {
  return (
    <LegalPageShell
      badge="About Us"
      title="LA Bim Solutions"
      description="LA Bim Solutions is an emerging and dynamic organization in the Design, Engineering, and Construction Technology sector. We are committed to delivering high-quality BIM (Building Information Modeling) and VDC (Virtual Design and Construction) services to a diverse range of clients across the construction industry."
      maxWidth="5xl"
    >
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          What we do
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {capabilities.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </LegalPageShell>
  );
}