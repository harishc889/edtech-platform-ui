/** Next upcoming session by `startTime`, or earliest session if all are past. */
export function pickNextUpcomingByStartTime<T extends { startTime: string }>(
  sessions: T[],
  nowMs = Date.now(),
): T | null {
  if (sessions.length === 0) return null;
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );
  const upcoming = sorted.find((s) => {
    const ts = new Date(s.startTime).getTime();
    return Number.isFinite(ts) && ts >= nowMs;
  });
  return upcoming ?? sorted[0] ?? null;
}
