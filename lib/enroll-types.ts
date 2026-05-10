export type EnrollRequest = {
  batchId: number;
};

export type EnrollBatchRef = {
  id: number;
  courseId: number;
  startDate: string;
  endDate: string;
  mentorName: string;
  capacity: number;
};

export type EnrollCourseRef = {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  price?: number;
};

/** 201 Created response for POST /api/Enroll */
export type EnrollCreateResponse = {
  id: number;
  userId: number;
  batchId: number;
  enrolledAt: string;
  batch: EnrollBatchRef;
  course: EnrollCourseRef;
};

/** 200 OK array item for GET /api/Enroll/my-courses */
export type MyEnrolledCourseItem = {
  enrollmentId: number;
  enrolledAt: string;
  batch: EnrollBatchRef;
  course: EnrollCourseRef;
};
