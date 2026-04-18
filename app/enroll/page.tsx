import type { Metadata } from "next";
import Link from "next/link";
import { EnrollForm } from "../components/enroll-form";
import BackNavLink from "../components/back-nav-link";

export const metadata: Metadata = {
  title: "Enroll | EdTech Academy",
  description:
    "Choose your program, payment plan, and submit your enrollment request.",
};

type PageProps = {
  searchParams: Promise<{ course?: string }>;
};

export default async function EnrollPage({ searchParams }: PageProps) {
  const { course } = await searchParams;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <nav className="mb-8 text-sm">
          <Link
            href="/"
            className="font-semibold text-cyan-700 transition hover:text-cyan-600"
          >
           <BackNavLink className="font-semibold text-cyan-700 transition hover:text-cyan-600" />

          </Link>
        </nav>
        <EnrollForm initialCourseId={course} />
      </div>
    </main>
  );
}
