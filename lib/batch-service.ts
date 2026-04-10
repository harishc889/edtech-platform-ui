import { backendRequestSafe } from "@/lib/backend-api-client";

/** Swagger: GET /api/Batch/course/{courseId} */
export async function getBatchesForCourse(courseId: string | number) {
  return backendRequestSafe<unknown>(["Batch", "course", String(courseId)], {
    method: "GET",
  });
}
