/** POST body aligned with backend CreateLiveSessionDto */
export type CreateLiveSessionInput = {
  batchId: number;
  title: string;
  startTime: string;
  durationMinutes: number;
  password?: string | null;
  videoProvider?: "Zoom" | "GoogleMeet" | "Custom" | string | null;
};

/** Normalised row for admin tables / success panels */
export type LiveSessionAdminView = {
  id: number;
  batchId: number;
  title: string;
  meetingUrl: string;
  meetingId: string | null;
  hostUrl: string | null;
  provider: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number;
  password: string | null;
};

export type AdminBatchOption = {
  batchId: number;
  courseTitle: string;
  courseSlug: string;
  apiCourseId: number;
  mentorName: string;
  startDate: string;
  /** Ready-made dropdown label */
  label: string;
};
