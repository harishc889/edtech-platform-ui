import type { MetadataRoute } from "next";
import { unwrapArray } from "@/lib/api-normalize";
import type { PublishedCourseDto } from "@/lib/course-api-types";
import { trimOrUndefined } from "@/lib/string-trim";
import { getBackendApiPrefix, getBackendOrigin } from "@/lib/backend-env";

const BASE_URL = "https://labimacademy.com";

function slugFromPublishedCourse(dto: PublishedCourseDto): string | null {
  const code = trimOrUndefined(dto.courseCode);
  if (!code) return null;
  return code.replace(/\s+/g, "-");
}

async function fetchCourseSlugs(): Promise<string[]> {
  const origin = getBackendOrigin();
  if (!origin) return [];
  const prefix = getBackendApiPrefix();
  const url = `${origin}${prefix}/Course`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const rows = unwrapArray<PublishedCourseDto>(data);
    return rows
      .map(slugFromPublishedCourse)
      .filter((slug): slug is string => Boolean(slug));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const courseSlugs = await fetchCourseSlugs();
  const routes = [
    "/",
    "/about",
    "/contact",
    "/courses",
    "/enroll",
    "/privacy-policy",
    "/terms-conditions",
    "/refund-policy",
    "/cancellation-policy",
    "/referral-terms",
    "/evaluation-criteria",
    "/fee-payment",
    "/sitemap",
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const courseEntries: MetadataRoute.Sitemap = courseSlugs.map((slug) => ({
    url: `${BASE_URL}/courses/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...courseEntries];
}
