import { backendRequestSafe } from "@/lib/backend-api-client";
import type { BatchByCourseDto } from "@/lib/batch-types";

/** Swagger: GET /api/Batch/course/{courseId} */
export async function getBatchesForCourse(courseId: string | number) {
  return backendRequestSafe<BatchByCourseDto[]>(
    ["Batch", "course", String(courseId)],
    {
      method: "GET",
    },
  );
}
