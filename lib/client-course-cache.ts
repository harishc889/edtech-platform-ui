"use client";

import { unwrapArray } from "@/lib/api-normalize";
import { mapCourseByCodeDtoToProgram } from "@/lib/course-program-adapter";
import { trimOrEmpty } from "@/lib/string-trim";
import type {
  CourseBatchDto,
  PublishedCourseDto,
} from "@/lib/course-api-types";
import { getPublishedCourses } from "@/lib/course-service";
import type { Program } from "@/lib/program-catalog";

/**
 * Single cache for the published course catalog (`GET /api/Course`).
 *
 * Every browser-side consumer (header dropdown, dashboard, enroll form,
 * featured programs, courses page, learn-route resolver) MUST go through
 * this module. Otherwise the same endpoint is hit multiple times per page
 * load and the header dropdown shows "Loading courses…" even though another
 * component already fetched the data.
 *
 * Successful responses are cached for `CACHE_TTL_MS`. Failures are not
 * cached so the next caller can retry.
 */

const CACHE_TTL_MS = 5 * 60 * 1000;

type SuccessCache = { programs: Program[]; expiresAt: number };

let cache: SuccessCache | null = null;
let inFlight: Promise<CachedProgramsResult> | null = null;

export type CachedProgramsResult = {
  ok: boolean;
  programs: Program[];
  message: string | null;
};

/** Full result with success / error information — preferred for new code. */
export async function getCachedProgramsResult(): Promise<CachedProgramsResult> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return { ok: true, programs: cache.programs, message: null };
  }
  if (inFlight) return inFlight;

  inFlight = (async (): Promise<CachedProgramsResult> => {
    try {
      const response = await getPublishedCourses();
      if (!response.ok) {
        return { ok: false, programs: [], message: response.message };
      }
      const rows = unwrapArray<PublishedCourseDto>(response.data);
      const programs = rows.map((row) => {
        const optionalBatches = (
          row as PublishedCourseDto & { batches?: CourseBatchDto[] }
        ).batches;
        return mapCourseByCodeDtoToProgram(
          {
            ...row,
            batches: Array.isArray(optionalBatches) ? optionalBatches : [],
          },
          trimOrEmpty(row.courseCode) || String(row.id),
        );
      });
      cache = { programs, expiresAt: Date.now() + CACHE_TTL_MS };
      return { ok: true, programs, message: null };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load courses.";
      return { ok: false, programs: [], message };
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

/**
 * Convenience wrapper for fire-and-forget consumers (header dropdown, etc.)
 * that only care about the program list and want an empty array on failure.
 */
export async function getCachedPrograms(): Promise<Program[]> {
  const result = await getCachedProgramsResult();
  return result.programs;
}

/** Force the next call to re-fetch — useful after admin edits, tests, etc. */
export function invalidateCachedPrograms() {
  cache = null;
}
