/**
 * Information architecture for the admin console — aligned with BFF paths
 * `GET/PATCH /api/Admin/...` (see Swagger).
 */

export type AdminNavMatch = "exact" | "prefix";

export type AdminNavItem = {
  href: string;
  label: string;
  description?: string;
  /** `exact`: pathname === href only. `prefix`: pathname === href or pathname.startsWith(href + "/"). */
  match: AdminNavMatch;
};

export type AdminNavSection = {
  title: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    title: "Overview",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        description: "Summary & entry points",
        match: "exact",
      },
    ],
  },
  {
    title: "Learning ops",
    items: [
      {
        href: "/admin/live-sessions",
        label: "Live sessions",
        description: "Meetings by batch",
        match: "prefix",
      },
      {
        href: "/admin/live-sessions/new",
        label: "Schedule meeting",
        description: "Create Zoom session",
        match: "exact",
      },
    ],
  },
  {
    title: "People & access",
    items: [
      {
        href: "/admin/users",
        label: "Users",
        description: "Directory & roles",
        match: "prefix",
      },
    ],
  },
  {
    title: "Commerce",
    items: [
      {
        href: "/admin/payments",
        label: "Payments",
        description: "Orders & settlement view",
        match: "prefix",
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        href: "/admin/analytics",
        label: "Analytics",
        description: "Enrollments & revenue",
        match: "prefix",
      },
    ],
  },
];

/** Longest matching nav href wins so `/admin/live-sessions/new` prefers the schedule item over the hub prefix. */
export function adminNavActiveHref(pathname: string): string | null {
  let best: { href: string; len: number } | null = null;

  for (const section of ADMIN_NAV_SECTIONS) {
    for (const item of section.items) {
      let hit = false;
      if (item.match === "exact") {
        hit = pathname === item.href;
      } else {
        hit =
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`);
      }
      if (!hit) continue;
      if (!best || item.href.length >= best.len) {
        best = { href: item.href, len: item.href.length };
      }
    }
  }

  return best?.href ?? null;
}
