import { backendRequestSafe } from "@/lib/backend-api-client";

/** Guide: GET /api/course — Swagger: GET /api/Course */
export async function getPublishedCourses() {
  return backendRequestSafe<unknown>(["Course"], { method: "GET" });
}

/** Swagger: GET /api/Course/{id} */
export async function getCourseById(id: string | number) {
  return backendRequestSafe<unknown>(["Course", String(id)], {
    method: "GET",
  });
}
