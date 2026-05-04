export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Turns plain-text module outlines into safe HTML; passes through existing ul/ol/p markup. */
export function toModuleDescriptionHtml(desc: string) {
  const trimmed = desc.trim();
  if (!trimmed) return "";

  if (/<(ul|ol|li|p|br)\b/i.test(trimmed)) {
    return trimmed;
  }

  const lines = trimmed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return "";

  const firstLine = escapeHtml(lines[0]);
  const isGoal = firstLine.toLowerCase().startsWith("goal:");
  const bullets = (isGoal ? lines.slice(1) : lines).map(escapeHtml);
  const goalHtml = isGoal
    ? `<p class="font-semibold text-slate-900">${firstLine}</p>`
    : "";
  const listItems = bullets.map((line) => `<li>${line}</li>`).join("");
  const listHtml = `<ul class="module-bullets">${listItems}</ul>`;

  return `${goalHtml}${listHtml}`;
}
