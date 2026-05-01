import { backendRequestSafe } from "@/lib/backend-api-client";

/** Guide: GET /api/course — Swagger: GET /api/Course */
export async function getPublishedCourses() {
  return backendRequestSafe<unknown>(["Course"], { method: "GET" });
}

/** Swagger: GET /api/Course/{courseCode} */
export async function getCourseById(courseCode: string) {
  return backendRequestSafe<unknown>(["Course", courseCode], {
    method: "GET",
  });
}
