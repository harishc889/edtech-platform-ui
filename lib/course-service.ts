import { backendRequestSafe } from "@/lib/backend-api-client";
import type { CourseByCodeDto, PublishedCourseDto } from "@/lib/course-api-types";

/** Guide: GET /api/course — Swagger: GET /api/Course */
export async function getPublishedCourses() {
  return backendRequestSafe<PublishedCourseDto[]>(["Course"], { method: "GET" });
}

/** Swagger: GET /api/Course/{courseCode} */
export async function getCourseById(courseCode: string) {
  return backendRequestSafe<CourseByCodeDto>(["Course", courseCode], {
    method: "GET",
  });
}
