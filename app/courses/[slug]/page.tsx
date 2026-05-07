import type { Metadata } from "next";
import { cache } from "react";
import JsonLd from "@/app/components/seo/json-ld";
import CourseDetailClient from "./course-detail-client";
import { getBackendApiPrefix, getBackendOrigin } from "@/lib/backend-env";
import { breadcrumbSchema, courseSchema } from "@/lib/seo/schemas";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function titleFromSlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

const getCourseSeoData = cache(async (slug: string): Promise<{
  title?: string;
  description?: string;
  image?: string;
  priceInr?: number;
} | null> => {
  const origin = getBackendOrigin();
  if (!origin) return null;
  const prefix = getBackendApiPrefix();
  const encodedSlug = encodeURIComponent(slug);
  const url = `${origin}${prefix}/Course/${encodedSlug}`;

  try {
    const res = await fetch(url, { next: { revalidate: 900 } });
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    return {
      title:
        typeof data.title === "string"
          ? data.title
          : typeof data.name === "string"
            ? data.name
            : undefined,
      description:
        typeof data.shortDescription === "string"
          ? data.shortDescription
          : typeof data.description === "string"
            ? data.description
            : undefined,
      image:
        typeof data.courseDetailCoverImage === "string"
          ? data.courseDetailCoverImage
          : typeof data.cardCoverImage === "string"
            ? data.cardCoverImage
            : undefined,
      priceInr:
        typeof data.upfrontInr === "number"
          ? data.upfrontInr
          : typeof data.price === "number"
            ? data.price
            : undefined,
    };
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fallbackTitle = `${titleFromSlug(slug)} Course in India`;
  const fallbackDescription =
    "Explore BIM course details, syllabus, fees, and upcoming batches at LA BIM Academy.";
  const seoData = await getCourseSeoData(slug);
  const title = seoData?.title ?? fallbackTitle;
  const description = seoData?.description ?? fallbackDescription;
  const image = seoData?.image ?? "/images/hero-home.webp";
  const canonicalPath = `/courses/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalPath,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const seoData = await getCourseSeoData(slug);
  const title = seoData?.title ?? titleFromSlug(slug);
  const description =
    seoData?.description ??
    "Explore BIM course details, syllabus, fees, and upcoming batches at LA BIM Academy.";
  const image = seoData?.image ?? "/images/hero-home.webp";
  const url = `https://labimacademy.com/courses/${encodeURIComponent(slug)}`;
  const courseJsonLd = courseSchema({
    name: title,
    description,
    url,
    image,
    priceInr: seoData?.priceInr,
  });
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", item: "https://labimacademy.com/" },
    { name: "Courses", item: "https://labimacademy.com/courses" },
    { name: title, item: url },
  ]);

  return (
    <>
      <JsonLd data={courseJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <CourseDetailClient slug={slug} />
    </>
  );
}
