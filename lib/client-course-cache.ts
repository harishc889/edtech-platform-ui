"use client";

import { asRecordList } from "@/lib/api-normalize";
import { mapCourseToProgram } from "@/lib/course-program-adapter";
import { getPublishedCourses } from "@/lib/course-service";
import type { Program } from "@/lib/program-catalog";

const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedPrograms: Program[] | null = null;
let cacheExpiresAt = 0;
let inFlightPrograms: Promise<Program[]> | null = null;

export async function getCachedPrograms(): Promise<Program[]> {
  const now = Date.now();
  if (cachedPrograms && cacheExpiresAt > now) {
    return cachedPrograms;
  }

  if (inFlightPrograms) {
    return inFlightPrograms;
  }

  inFlightPrograms = (async () => {
    try {
      const response = await getPublishedCourses();
      if (!response.ok) return [];
      const mapped = asRecordList(response.data).map((row) => mapCourseToProgram(row));
      cachedPrograms = mapped;
      cacheExpiresAt = Date.now() + CACHE_TTL_MS;
      return mapped;
    } catch {
      return [];
    }
  })();

  try {
    return await inFlightPrograms;
  } finally {
    inFlightPrograms = null;
  }
}
