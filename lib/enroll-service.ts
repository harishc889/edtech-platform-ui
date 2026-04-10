import { backendRequestSafe } from "@/lib/backend-api-client";

/**
 * Guide: GET /api/enroll/my-courses — optional if your `/api/Auth/me` already includes enrollments.
 * Dashboard uses `/me` only; call this from other flows if needed.
 */
export async function getMyEnrolledCourses() {
  return backendRequestSafe<unknown>(["Enroll", "my-courses"], {
    method: "GET",
  });
}

/** Guide: POST /api/enroll — body `{ batchId }` */
export async function enrollInBatch(batchId: number) {
  return backendRequestSafe<unknown>(["Enroll"], {
    method: "POST",
    data: { batchId },
  });
}
