import { Suspense } from "react";
import type { Metadata } from "next";
import CoursesCatalog from "@/app/courses/courses-catalog";

export const metadata: Metadata = {
  title: "BIM Course Catalog",
  description:
    "Explore live BIM training programs across Architecture, Structure, and MEP with upcoming batch details and enrollment options.",
  alternates: {
    canonical: "/courses",
  },
};

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-3 text-sm font-medium text-slate-500">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
            Loading catalog...
          </div>
        </main>
      }
    >
      <CoursesCatalog />
    </Suspense>
  );
}
