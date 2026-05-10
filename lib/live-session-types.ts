/** POST /api/LiveSession body (CreateLiveSessionDto) */
export type CreateLiveSessionInput = {
  batchId: number;
  title: string;
  startTime: string;
  durationMinutes: number;
  password?: string | null;
  videoProvider?: "Zoom" | "GoogleMeet" | "Custom" | string | null;
};

export type LiveSessionBatchRef = {
  id: number;
  courseId: number;
  startDate: string;
  mentorName: string;
};

export type LiveSessionCourseRef = {
  id: number;
  title: string;
  thumbnailUrl: string | null;
};

/** 201 Created response from POST /api/LiveSession */
export type LiveSessionAdminView = {
  id: number;
  batchId: number;
  title: string;
  meetingUrl: string | null;
  meetingId: string | null;
  hostUrl: string | null;
  provider: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number;
  password: string | null;
  batch: LiveSessionBatchRef | null;
  createdAt: string | null;
};

/** GET /api/LiveSession/my item */
export type LiveSessionMyItem = {
  id: number;
  title: string;
  meetingUrl: string | null;
  provider: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number;
  password: string | null;
  batch: {
    id: number;
    startDate: string;
    mentorName: string;
  } | null;
  course: LiveSessionCourseRef | null;
};

/** GET /api/LiveSession/batch/{batchId} item */
export type LiveSessionBatchItem = {
  id: number;
  title: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number;
  provider: string;
  meetingUrl?: string | null;
  meetingId?: string | null;
  hostUrl?: string | null;
  password?: string | null;
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
