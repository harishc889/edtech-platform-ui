"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingEnquiryCta() {
  const pathname = usePathname();
  const hideOn = ["/contact", "/login", "/register"];
  const whatsappBusinessLink =
    process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_LINK?.trim() || "/contact";
  if (hideOn.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return (
    <>
      <div className="fixed right-2 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 lg:flex">
      <Link
        href="https://youtube.com/@labimacademy?si=1AZ0uVXpuKfeNqrK"
        target="_blank"
        aria-label="YouTube"
        className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#FF0000] shadow-lg shadow-slate-300/60 transition hover:scale-105"
      >
        <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-md transition group-hover:opacity-100">
          YouTube
        </span>
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current" aria-hidden>
          <path d="M22 12c0-2.4-.3-4.2-.7-5.3-.4-1-1.2-1.7-2.2-2C17.9 4.4 12 4.4 12 4.4s-5.9 0-7.1.3c-1 .3-1.8 1-2.2 2C2.3 7.8 2 9.6 2 12c0 2.4.3 4.2.7 5.3.4 1 1.2 1.7 2.2 2 1.2.3 7.1.3 7.1.3s5.9 0 7.1-.3c1-.3 1.8-1 2.2-2 .4-1.1.7-2.9.7-5.3Zm-12.3 3.8V8.2l6 3.8-6 3.8Z" />
        </svg>
      </Link>

      <Link
        href="https://www.linkedin.com/posts/labimacademy_bim-digitalconstruction-aec-activity-7450210822720630784-GVoP?utm_source=share&utm_medium=member_ios&rcm=ACoAAClfoD8BIREr_pUw-uZbpo2bEjoEPzL2uZk"
        aria-label="LinkedIn"
        target="_blank"
        className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0A66C2] shadow-lg shadow-slate-300/60 transition hover:scale-105"
      >
        <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-md transition group-hover:opacity-100">
          LinkedIn
        </span>
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current" aria-hidden>
          <path d="M5.5 8.7a1.8 1.8 0 1 1 0-3.5 1.8 1.8 0 0 1 0 3.5ZM4 20V10h3v10H4Zm5 0V10h2.9v1.4h.1c.4-.8 1.4-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.8V20h-3v-4.8c0-1.2 0-2.6-1.6-2.6s-1.8 1.2-1.8 2.5V20H9Z" />
        </svg>
      </Link>

      <Link
        href={whatsappBusinessLink}
        aria-label="WhatsApp"
        className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#25D366] shadow-lg shadow-slate-300/60 transition hover:scale-105"
        target={whatsappBusinessLink.startsWith("http") ? "_blank" : undefined}
        rel={
          whatsappBusinessLink.startsWith("http")
            ? "noopener noreferrer"
            : undefined
        }
      >
        <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-md transition group-hover:opacity-100">
          WhatsApp
        </span>
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current" aria-hidden>
          <path d="M20.5 3.5A11 11 0 0 0 3.8 17.2L2.5 22l5-1.3a11 11 0 0 0 5 1.2h.1A11 11 0 0 0 20.5 3.5Zm-8 16.6a9.2 9.2 0 0 1-4.7-1.3l-.3-.2-2.9.7.8-2.8-.2-.3a9.1 9.1 0 1 1 7.3 3.9Zm5-6.8c-.3-.2-1.7-.8-2-.9s-.4-.2-.6.2-.7.9-.8 1c-.2.2-.3.2-.6.1-1.7-.8-2.9-2.5-3.1-2.8s0-.4.1-.6l.5-.5c.1-.1.2-.2.3-.4.1-.2 0-.4 0-.5s-.6-1.5-.9-2-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-.9 2.3c0 1.4 1 2.7 1.1 2.9.1.2 2 3.2 4.9 4.4 2.9 1.2 2.9.8 3.4.8.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.1-1.3-.1-.2-.3-.2-.6-.3Z" />
        </svg>
      </Link>
      </div>

      <Link

        href="/contact"
        aria-label="Chat with AI assistant"
        className="group fixed bottom-4 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white p-0.5 shadow-lg shadow-slate-300/60 transition hover:scale-105 "
      >
        <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-md transition group-hover:opacity-100">
          Send Enquiry
        </span>
        <span className="relative h-full w-full overflow-hidden rounded-full">
          <Image
            src="/images/ai-assistant-avatar.png"
            alt="AI assistant avatar"
            fill
            className="object-cover object-center"
            sizes="48px"
          />
        </span>
      </Link>
    </>
  );
}
