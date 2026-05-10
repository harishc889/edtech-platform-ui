export type AdminRole = "Admin" | "User" | string;

export type AdminUsersQuery = {
  role?: AdminRole;
};

export type AdminUserSummary = {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
};

export type AdminUserRolePatchRequest = {
  role: AdminRole;
};

export type AdminUserRolePatchResponse = {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  message: string;
};

export type AdminDashboardResponse = {
  totalUsers: number;
  totalCourses: number;
  totalBatches: number;
  totalEnrollments: number;
  activeSessions: number;
  totalRevenue: number;
  pendingPayments: number;
  successfulPayments: number;
};

export type AdminPaymentSummary = {
  id: number;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: number;
    title: string;
  };
  createdAt: string;
  paidAt: string | null;
};

export type AdminPaymentsQuery = {
  status?: string;
  userId?: number;
};

/** GET /api/Admin/analytics/enrollments -> { "batchId": count } */
export type AdminEnrollmentAnalyticsResponse = Record<string, number>;
/** GET /api/Admin/analytics/revenue -> { "YYYY-MM": totalRevenue } */
export type AdminRevenueAnalyticsResponse = Record<string, number>;
