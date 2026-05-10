# Admin Live Session — Implementation Guide (Next.js + API)

## Overview

This guide helps you implement the **first admin feature**: **creating a live session** tied to an existing **batch**. Your backend already exposes `POST /api/live-session` (Admin role), integrates with **Zoom** by default, and persists rows on **`LiveSession`** linked to **`Batch`** → **`Course`**.

Use this as your starting point; course creation, batch creation, and richer admin dashboards can follow later.

**Next.js UI (`edtech-platform-ui`):** Browser calls should match the code already there — shared Axios in `lib/api.ts` (`withCredentials: true`, JSON headers, cache headers on GET), ASP.NET access through `lib/backend-api-client.ts` (`bffUrl`, `backendRequest`, `backendRequestSafe`), and small service modules (`lib/course-service.ts`, `lib/batch-service.ts`). Use **`lib/live-session-service.ts`** for create/list/delete live session calls (same pattern as course/batch).

For field-level model shapes, see [`edtech-platform-api/ADMIN_LIVE_SESSION_MODELS_REFERENCE.md`](edtech-platform-api/ADMIN_LIVE_SESSION_MODELS_REFERENCE.md).

---

## What the backend already gives you

| Capability | Endpoint | Auth |
|------------|----------|------|
| Create live session (Zoom / provider) | `POST /api/live-session` | **Admin** (`Bearer` JWT) |
| Delete live session | `DELETE /api/live-session/{id}` | **Admin** |
| List sessions for a batch (lightweight) | `GET /api/live-session/batch/{batchId}` | Anonymous |
| Published courses **including nested batches** | `GET /api/course` | Anonymous |
| Batches for one course | `GET /api/batch/course/{courseId}` | Anonymous |

**Important:** There is **no** `GET /api/batch` that returns all batches. For the admin UI, load **courses** first, then either:

- use **`batches` embedded in each course** from `GET /api/course`, or  
- call **`GET /api/batch/course/{courseId}`** after the admin picks a course.

Creating batches/courses remains separate (`POST /api/batch`, `POST /api/course`) — out of scope for this first screen unless you want a combined wizard later.

**Browser ↔ ASP.NET:** The UI does **not** call `API_BASE_URL` directly from the client. The browser hits **`/api/backend/...`** on Next.js; the Route Handler proxies to the API using **`API_BASE_URL`** on the server (see `lib/backend-env.ts`, `app/api/backend/[...path]/route.ts`).

---

## Domain models you actually touch for “Create session”

You do **not** create `LiveSession` rows manually from the UI; the API creates them after calling the video provider.

| Model / DTO | Role in admin UI |
|-------------|------------------|
| **User** | Admin must be logged in through your existing UI auth; cookies are sent with `withCredentials` and forwarded by the Next.js BFF (`lib/proxy-backend-api.ts`). Backend still enforces **`Admin`** role. |
| **Course** | Identify course title/code for labels when choosing a batch. |
| **Batch** | **Required foreign key:** `batchId` on create. Shows mentor, dates, capacity in dropdowns. |
| **CreateLiveSessionDto** | Exact payload for `POST /api/live-session`. |
| **LiveSession** | Display **after success** (meeting URL, host URL, provider, times). |

### API input: `CreateLiveSessionDto` (matches backend)

| Field | Required | Notes |
|-------|----------|--------|
| `batchId` | Yes | `int` |
| `title` | Yes | Max length 200 |
| `startTime` | Yes | See **Date/time** section below |
| `durationMinutes` | Yes | **15–480** (backend validation) |
| `password` | No | Max 50; Zoom may still enforce its own password rules |
| `videoProvider` | No | Defaults from config; see **Video providers** |

### Successful create response (shape from `LiveSessionController`)

The API returns `201 Created` with JSON including: `id`, `batchId`, `title`, `meetingUrl`, `meetingId`, `hostUrl`, `provider`, `startTime`, `endTime`, `durationMinutes`, `password`, nested `batch`, `createdAt`.

---

## Date and time (avoid subtle bugs)

The backend normalizes `startTime` to UTC. From `LiveSessionService`:

- Values sent as **UTC** (`DateTimeKind.Utc`, e.g. ISO string ending in `Z`) are stored as UTC.
- Values sent **without** timezone (`Unspecified`) are interpreted using **`LiveSession:StartTimeAssumedTimeZoneId`** (default **Asia/Kolkata** in `appsettings.json`).

**Recommendation for Next.js:** Build an ISO **UTC** string for the API, e.g. convert the user’s local `datetime-local` choice with `toISOString()`, **or** send an explicit offset. Document whichever you choose for your admins.

---

## Video providers

`videoProvider` is matched **case-insensitively** (`zoom`, `Zoom`, etc.):

| Value | Behavior |
|-------|----------|
| **`Zoom`** (recommended for MVP) | Real meetings via Server-to-Server OAuth — see [ZOOM_INTEGRATION_GUIDE.md](ZOOM_INTEGRATION_GUIDE.md). |
| **`GoogleMeet`** | Currently **not implemented** on the API — will throw at runtime. |
| **`Custom`** | Stub URLs — fine for UI wiring tests, not real classes. |

For the first admin screen, default the dropdown to **Zoom** only unless you have configured something else.

---

## Backend prerequisites checklist

- [ ] Zoom (or chosen provider) configured on the API  
- [ ] At least one **Course** and one **Batch** exist (`batchId` must exist)  
- [ ] Admin account has **`Admin`** role on the API  
- [ ] Next `.env.local` has **`API_BASE_URL`** (and optional **`API_PATH_PREFIX`**) so the BFF can reach the API; ASP.NET **CORS** still applies to that origin if anything calls the API directly  
- [ ] Session **`startTime` is strictly in the future** (UTC), or the API returns an error  

---

## Next.js admin UI — suggested scope (MVP)

### 1. Routing and layout

Suggested paths:

- `/admin/live-sessions/new` — **create form** (this guide)  
- Optionally `/admin/live-sessions` later — list/edit (needs extra API endpoints if you want server-side listing for all sessions)

Protect routes with your existing auth guard so only **`Admin`** reaches them.

### 2. Environment (Next.js BFF — already how `edtech-platform-ui` works)

Server-side (`.env.local` on the **Next** app), not the browser:

```bash
# Required for app/api/backend proxy → Kestrel
API_BASE_URL=https://localhost:7148
# Optional; default /api
# API_PATH_PREFIX=/api
```

Do **not** add a separate `NEXT_PUBLIC_*` base URL for these calls: components use the shared client targeting **`/api/backend/...`** only.

### 3. Axios pattern (reuse — do not reinvent)

| Piece | Purpose |
|-------|--------|
| `lib/api.ts` | `axios.create({ withCredentials: true, headers: { "Content-Type": "application/json", Accept: "application/json" } })` plus GET cache-control interceptor |
| `lib/backend-api-client.ts` | `bffUrl("LiveSession", ...)` → `/api/backend/LiveSession/...`; `backendRequest` / **`backendRequestSafe`** wrap `api.request` |
| `lib/api-error.ts` | `getErrorMessageFromPayload` — used inside `backendRequestSafe` for human-readable `message` |

**Prefer `backendRequestSafe`** in UI code: it returns `{ ok: true, data } | { ok: false, status, message, details? }` and never throws on HTTP errors.

Controller segments follow the same style as existing services: **`Course`**, **`Batch`**, **`LiveSession`** (ASP.NET may accept different casing; the BFF retries PascalCase on `404`).

### 4. Data loading for the batch dropdown

Reuse **`getPublishedCourses`** from `lib/course-service.ts`:

```typescript
import { getPublishedCourses } from "@/lib/course-service";

const result = await getPublishedCourses();
if (!result.ok) {
  // show result.message (already normalized via getErrorMessageFromPayload)
  return;
}
const courses = result.data as Array<{
  id: number;
  title: string;
  batches: Array<{ id: number; startDate: string; mentorName?: string | null }>;
}>;

const batchOptions = courses.flatMap((c) =>
  (c.batches ?? []).map((b) => ({
    batchId: b.id,
    label: `${c.title} — ${b.mentorName ?? "Mentor TBD"} (${new Date(b.startDate).toLocaleDateString()})`,
  })),
);
```

**Option B:** Course picker → **`getBatchesForCourse`** from `lib/batch-service.ts` (maps to `GET /api/Batch/course/{courseId}` through the BFF).

### 5. Form fields and submit (match `CreateLiveSessionDto`)

1. **Batch** → `batchId`  
2. **Title** → `title`  
3. **Start** → `startTime` (prefer ISO UTC from `datetime-local` via `toISOString()`)  
4. **Duration** → `durationMinutes` (**15–480**)  
5. **Password** → optional `password`  
6. **Provider** → optional `videoProvider` (default `"Zoom"`)

Call **`createLiveSession`** from `lib/live-session-service.ts`:

```typescript
import { createLiveSession } from "@/lib/live-session-service";

const result = await createLiveSession({
  batchId: 12,
  title: "Week 3 — Live Q&A",
  startTime: "2026-05-15T14:30:00.000Z",
  durationMinutes: 90,
  password: null,
  videoProvider: "Zoom",
});

if (!result.ok) {
  setError(result.message);
  return;
}

// result.data — created session JSON from the API
```

Equivalent JSON body (what the BFF forwards to ASP.NET):

```json
{
  "batchId": 12,
  "title": "Week 3 — Live Q&A",
  "startTime": "2026-05-15T14:30:00.000Z",
  "durationMinutes": 90,
  "password": null,
  "videoProvider": "Zoom"
}
```

### 6. After success and verification

Show **join URL**, **host URL**, meeting id, password, times.

Verify scheduled sessions for a batch with **`getLiveSessionsForBatch`** (`lib/live-session-service.ts`) — same pattern: check `result.ok`, then use `result.data`.

Direct HTTP (curl / Postman against Kestrel), without BFF:

```http
GET /api/LiveSession/batch/{batchId}
```

### 7. Error handling

| Situation | Typical cause |
|-----------|----------------|
| `401` / `403` | Not logged in or not **Admin** |
| `404` / batch error | Invalid `batchId` |
| `400` / validation | Duration outside 15–480, missing fields |
| Provider error | Zoom credentials, scopes, or API failure |

Use **`result.message`** from `backendRequestSafe` for UI alerts; inspect **`result.details`** when you need raw ProblemDetails / payload for debugging.

### 8. TypeScript types (starter)

```typescript
export interface CreateLiveSessionRequest {
  batchId: number;
  title: string;
  startTime: string; // ISO 8601
  durationMinutes: number;
  password?: string | null;
  videoProvider?: string | null;
}

export interface CreateLiveSessionResponse {
  id: number;
  batchId: number;
  title: string;
  meetingUrl: string;
  meetingId: string;
  hostUrl?: string | null;
  provider: string;
  startTime: string;
  endTime?: string | null;
  durationMinutes: number;
  password?: string | null;
  batch: {
    id: number;
    courseId: number;
    startDate: string;
    mentorName?: string | null;
  };
  createdAt: string;
}

export interface CourseListItem {
  id: number;
  title: string;
  courseCode: string;
  batches: Array<{
    id: number;
    courseId: number;
    startDate: string;
    endDate?: string | null;
    mentorName?: string | null;
    capacity: number;
    createdAt: string;
  }>;
}
```

---

## Quick API smoke test (Swagger / curl)

Replace placeholders:

```http
POST /api/live-session
Authorization: Bearer YOUR_ADMIN_JWT
Content-Type: application/json

{
  "batchId": 1,
  "title": "Test session",
  "startTime": "2026-12-25T10:00:00Z",
  "durationMinutes": 60,
  "videoProvider": "Zoom"
}
```

---

## What to defer (later phases)

- Full **admin session list** across all batches (may need new `GET` endpoints with filters)  
- Editing/rescheduling sessions (needs PATCH design + provider update rules)  
- **Google Meet** or **Custom** real implementations  
- Email reminders, calendars, attendance  

---

## Related docs

- [ZOOM_INTEGRATION_GUIDE.md](ZOOM_INTEGRATION_GUIDE.md) — Zoom app, scopes, env vars  
- [edtech-platform-api/ADMIN_LIVE_SESSION_MODELS_REFERENCE.md](edtech-platform-api/ADMIN_LIVE_SESSION_MODELS_REFERENCE.md) — model field reference  

---

## Implementation checklist

- [ ] Admin auth + role gate on `/admin/live-sessions/new`  
- [ ] Load courses/batches (no reliance on non-existent `GET /api/batch`)  
- [ ] Form validation aligned with `CreateLiveSessionDto` (especially duration 15–480)  
- [ ] Correct date serialization (UTC or documented IST behavior)  
- [ ] Create session wired through **`createLiveSession`** → BFF (`backendRequestSafe` / cookies), not a manual bearer header unless you intentionally bypass the BFF  
- [ ] Success UI shows join + host links; errors surfaced clearly  
- [ ] Zoom (or provider) configured on API  

Once this page is reliable, you can extend the admin shell (navigation, layout, listing) without changing the core create contract.
