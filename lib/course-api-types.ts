/** Wire shapes from GET /api/Course — nullable / unions match real JSON (camelCase). */

export type CourseModuleDto = {
  id: number;
  title: string;
  /** API may send `10` or `"10 Hours"`. */
  hours: number | string;
  description: string | null;
  order: number;
};

export type CourseToolDto = {
  id: number;
  name: string;
  imagePath: string;
  order: number;
};

export type CourseCertificationDto = {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  order: number;
};

export type CourseFaqDto = {
  id: number;
  question: string;
  answerHtml: string;
  order: number;
};

export type CourseBatchDto = {
  id: number;
  startDate: string;
  endDate: string;
  mentorName: string;
  capacity: number;
  createdAt: string;
};

export type PublishedCourseDto = {
  id: number;
  courseCode: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  duration: string;
  hours: string;
  internshipDuration: string | null;
  internshipHours: string;
  language: string;
  mode: string;
  assessments: string;
  eligibility: string;
  cardCoverImage: string;
  courseDetailCoverImage: string;
  price: number;
  upfrontInr: number;
  seatBookingInr: number;
  criteriaTotalCredits: number | string;
  criteriaMinimumScore: number | string;
  criteriaDescription: string | null;
  /** New API: arrays; legacy: single string with newlines. */
  highlights: string | string[];
  engineeringBenefits: string | string[];
  learningOutcomes: string | string[];
  careerRoles: string | string[];
  isPublished: boolean;
  createdAt: string;
  modules: CourseModuleDto[];
  tools: CourseToolDto[];
  certifications: CourseCertificationDto[];
  faqs: CourseFaqDto[];
};

export type CourseByCodeDto = PublishedCourseDto & {
  batches: CourseBatchDto[];
};
