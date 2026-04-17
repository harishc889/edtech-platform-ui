import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseDetailShowcase from "@/app/components/course-detail-showcase";
import { PROGRAM_CATALOG, getProgramById } from "@/lib/program-catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PROGRAM_CATALOG.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getProgramById(slug);
  if (!course) {
    return { title: "Course | EdTech Academy" };
  }
  return {
    title: `${course.title} | EdTech Academy`,
    description: course.subtitle,
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = getProgramById(slug);
  if (!course) notFound();

  const enrollHref = `/enroll?course=${encodeURIComponent(course.id)}`;
  const courseFeeInr = new Intl.NumberFormat("en-IN").format(course.upfrontInr);
  const durationHours = course.hours;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm">
          <Link
            href="/#courses"
            className="font-semibold text-cyan-700 transition hover:text-cyan-600"
          >
            ← Featured courses
          </Link>
        </nav>
        <CourseDetailShowcase
          course={course}
          enrollHref={enrollHref}
          courseFeeInr={courseFeeInr}
        />
      </div>
    </main>
  );
}
