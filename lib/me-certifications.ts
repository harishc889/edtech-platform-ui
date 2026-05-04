export function certificationsFromMePayload(data: unknown): Record<string, unknown>[] {
  if (!data || typeof data !== "object") return [];
  const o = data as Record<string, unknown>;
  const user =
    o.user && typeof o.user === "object"
      ? (o.user as Record<string, unknown>)
      : null;
  const candidates = [
    o.certifications,
    o.certificates,
    o.myCertifications,
    o.myCertificates,
    user?.certifications,
    user?.certificates,
    user?.myCertifications,
    user?.myCertificates,
  ];
  for (const candidate of candidates) {
    const rows = Array.isArray(candidate)
      ? candidate.filter((item) => item && typeof item === "object")
      : [];
    if (rows.length > 0) {
      return rows as Record<string, unknown>[];
    }
  }
  return [];
}

export type CertificationRow = {
  id: string;
  title: string;
  issuedOn: string;
  credentialId: string | null;
  verifyUrl: string | null;
};

export function mapCertificationRow(
  raw: Record<string, unknown>,
  index: number,
): CertificationRow {
  const id = String(
    raw.id ?? raw.certificateId ?? raw.certificationId ?? `cert-${index}`,
  );
  const title = String(
    raw.title ??
      raw.name ??
      raw.certificateName ??
      raw.certificationName ??
      "Certificate",
  );
  const issuedOn = String(
    raw.issuedOn ?? raw.issueDate ?? raw.awardedAt ?? raw.createdAt ?? "—",
  );
  const credentialId =
    typeof raw.credentialId === "string" && raw.credentialId.trim()
      ? raw.credentialId.trim()
      : typeof raw.certificateCode === "string" && raw.certificateCode.trim()
        ? raw.certificateCode.trim()
        : null;
  const verifyUrl =
    typeof raw.verifyUrl === "string" && raw.verifyUrl.trim()
      ? raw.verifyUrl.trim()
      : typeof raw.certificateUrl === "string" && raw.certificateUrl.trim()
        ? raw.certificateUrl.trim()
        : null;
  return { id, title, issuedOn, credentialId, verifyUrl };
}
