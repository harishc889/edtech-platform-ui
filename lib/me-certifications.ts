import type {
  AuthMeCertificationDto,
  AuthMePayload,
} from "@/lib/auth-me-types";
import { trimOrUndefined } from "@/lib/string-trim";

export function certificationsFromMePayload(
  data: AuthMePayload | null | undefined,
): AuthMeCertificationDto[] {
  if (!data) return [];
  const buckets = [
    data.certifications,
    data.certificates,
    data.myCertifications,
    data.myCertificates,
    data.user?.certifications,
    data.user?.certificates,
    data.user?.myCertifications,
    data.user?.myCertificates,
  ];
  for (const candidate of buckets) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate;
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
  raw: AuthMeCertificationDto,
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
    trimOrUndefined(
      typeof raw.credentialId === "string" ? raw.credentialId : undefined,
    ) ??
    trimOrUndefined(
      typeof raw.certificateCode === "string"
        ? raw.certificateCode
        : undefined,
    ) ??
    null;
  const verifyUrl =
    trimOrUndefined(
      typeof raw.verifyUrl === "string" ? raw.verifyUrl : undefined,
    ) ??
    trimOrUndefined(
      typeof raw.certificateUrl === "string"
        ? raw.certificateUrl
        : undefined,
    ) ??
    null;
  return { id, title, issuedOn, credentialId, verifyUrl };
}
