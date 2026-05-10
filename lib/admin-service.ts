import { backendRequestSafe } from "@/lib/backend-api-client";
import type {
  AdminDashboardResponse,
  AdminEnrollmentAnalyticsResponse,
  AdminPaymentsQuery,
  AdminPaymentSummary,
  AdminRevenueAnalyticsResponse,
  AdminUserRolePatchRequest,
  AdminUserRolePatchResponse,
  AdminUsersQuery,
  AdminUserSummary,
} from "@/lib/admin-types";

/** GET /api/Admin/dashboard */
export function getAdminDashboard() {
  return backendRequestSafe<AdminDashboardResponse>(["Admin", "dashboard"]);
}

/** GET /api/Admin/users?role= */
export function getAdminUsers(params?: AdminUsersQuery) {
  return backendRequestSafe<AdminUserSummary[]>(["Admin", "users"], {
    params: params?.role ? { role: params.role } : undefined,
  });
}

/** GET /api/Admin/users/{id} */
export function getAdminUserById(id: number) {
  return backendRequestSafe<AdminUserSummary>(["Admin", "users", String(id)]);
}

/** PATCH /api/Admin/users/{id}/role — body: `{ role: string }` */
export function patchAdminUserRole(id: number, body: AdminUserRolePatchRequest) {
  return backendRequestSafe<AdminUserRolePatchResponse>(
    ["Admin", "users", String(id), "role"],
    {
      method: "PATCH",
      data: body,
    },
  );
}

/** GET /api/Admin/payments?status=&userId= */
export function getAdminPayments(params?: AdminPaymentsQuery) {
  const q: AdminPaymentsQuery = {};
  if (params?.status) q.status = params.status;
  if (params?.userId != null) q.userId = params.userId;
  return backendRequestSafe<AdminPaymentSummary[]>(
    ["Admin", "payments"],
    Object.keys(q).length ? { params: q } : undefined,
  );
}

/** GET /api/Admin/analytics/enrollments */
export function getAdminAnalyticsEnrollments() {
  return backendRequestSafe<AdminEnrollmentAnalyticsResponse>([
    "Admin",
    "analytics",
    "enrollments",
  ]);
}

/** GET /api/Admin/analytics/revenue?months= */
export function getAdminAnalyticsRevenue(months?: number) {
  return backendRequestSafe<AdminRevenueAnalyticsResponse>([
    "Admin",
    "analytics",
    "revenue",
  ], {
    params:
      months != null && Number.isFinite(months)
        ? { months }
        : undefined,
  });
}
