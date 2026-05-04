export type PaymentOption = {
  id: string;
  label: string;
  amountDisplay: string;
  amountInr: number;
};

export type CourseResourceLink = {
  title: string;
  url: string;
  kind: "pdf" | "zip" | "model" | "link" | "other";
};

export type CourseLesson = {
  id: string;
  title: string;
  durationLabel?: string;
  videoUrl?: string;
  resources?: CourseResourceLink[];
};

export type CourseModule = {
  title: string;
  hours: string;
  desc: string;
  lessons?: CourseLesson[];
  resources?: CourseResourceLink[];
};

export type Program = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  hours: string;
  internshipDuration: string;
  internshipHours: string;
  language: string;
  mode: string;
  assessments: string;
  eligibility: string;
  cardCoverImage?: string;
  courseDetailCoverImage?: string;
  level?: string;
  description?: string;
  highlights: string[];
  engineeringBenefits: string[];
  modules: CourseModule[];
  tools?: Array<{ name: string; imagePath: string }>;
  certifications?: Array<{
    title: string;
    description: string;
    imagePath: string;
  }>;
  faqs?: Array<{
    id: number;
    question: string;
    answerHtml: string;
    order: number;
  }>;
  learningOutcomes: string[];
  careerRoles: string[];
  criteriaSummary: {
    totalCredits: string;
    minimumScore: string;
    description: string;
  };
  upfrontInr: number;
  seatBookingInr: number;
  apiCourseId: number;
  defaultBatchId: number;
};
