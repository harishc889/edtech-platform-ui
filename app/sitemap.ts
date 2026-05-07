import type { MetadataRoute } from "next";
import { getBackendApiPrefix, getBackendOrigin } from "@/lib/backend-env";
import { asRecordList } from "@/lib/api-normalize";

const BASE_URL = "https://labimacademy.com";

function pickCourseSlug(raw: Record<string, unknown>) {
  const value = raw.courseCode ?? raw.slug ?? raw.code ?? raw.id;
  if (typeof value !== "string" && typeof value !== "number") return null;
  const str = String(value).trim();
  if (!str) return null;
  return str.replace(/\s+/g, "-");
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
    const rows = asRecordList(data);
    return rows
      .map(pickCourseSlug)
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
