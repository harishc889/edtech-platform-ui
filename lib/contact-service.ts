import { backendRequestSafe } from "@/lib/backend-api-client";

/** Swagger: POST /api/Contact/enquiry */
export type ContactEnquiryPayload = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type ContactEnquiryResponse = {
  ok?: boolean;
};

export async function submitContactEnquiry(payload: ContactEnquiryPayload) {
  return backendRequestSafe<ContactEnquiryResponse>(["Contact", "enquiry"], {
    method: "POST",
    data: payload,
  });
}
