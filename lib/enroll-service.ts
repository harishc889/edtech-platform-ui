import { backendRequestSafe } from "@/lib/backend-api-client";
import type {
  EnrollCreateResponse,
  EnrollRequest,
  MyEnrolledCourseItem,
} from "@/lib/enroll-types";

/**
 * Guide: GET /api/enroll/my-courses — optional if your `/api/Auth/me` already includes enrollments.
 * Dashboard uses `/me` only; call this from other flows if needed.
 */
export async function getMyEnrolledCourses() {
  return backendRequestSafe<MyEnrolledCourseItem[]>(["Enroll", "my-courses"], {
    method: "GET",
  });
}

/** Guide: POST /api/enroll — body `{ batchId }` */
export async function enrollInBatch(batchId: number) {
  const body: EnrollRequest = { batchId };
  return backendRequestSafe<EnrollCreateResponse>(["Enroll"], {
    method: "POST",
    data: body,
  });
}
