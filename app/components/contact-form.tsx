"use client";

import { FormEvent, useState } from "react";
import { useToast } from "@/app/components/toast-provider";
import { submitContactEnquiry } from "@/lib/contact-service";
import { trimOrEmpty } from "@/lib/string-trim";

const LIMIT = {
  name: 200,
  email: 254,
  phone: 40,
  subject: 300,
  message: 8000,
} as const;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactForm() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n = trimOrEmpty(name);
    const em = trimOrEmpty(email);
    const ph = trimOrEmpty(phone);
    const sub = trimOrEmpty(subject);
    const msg = trimOrEmpty(message);

    if (!n || n.length > LIMIT.name) {
      showToast({ type: "error", message: "Please enter your name." });
      return;
    }
    if (!em || em.length > LIMIT.email || !isValidEmail(em)) {
      showToast({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }
    if (ph.length > LIMIT.phone) {
      showToast({ type: "error", message: "Phone number is too long." });
      return;
    }
    if (sub.length > LIMIT.subject) {
      showToast({ type: "error", message: "Subject is too long." });
      return;
    }
    if (!msg || msg.length > LIMIT.message) {
      showToast({
        type: "error",
        message: "Please enter a message (required).",
      });
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitContactEnquiry({
        name: n,
        email: em,
        phone: ph,
        subject: sub,
        message: msg,
      });

      if (!result.ok) {
        showToast({
          type: "error",
          message:
            trimOrEmpty(result.message) ??
            "Could not send your message. Please try again or email us directly.",
        });
        return;
      }

      const bodyOk = result.data?.ok !== false;
      if (!bodyOk) {
        showToast({
          type: "error",
          message:
            "Could not send your message. Please try again or email us directly.",
        });
        return;
      }

      showToast({
        type: "success",
        message: "Thank you — your message has been sent. We will reply soon.",
      });
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            maxLength={LIMIT.name}
            required
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-cyan-500/30 transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            maxLength={LIMIT.email}
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-cyan-500/30 transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Phone Number
          </span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            maxLength={LIMIT.phone}
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-cyan-500/30 transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Subject</span>
          <input
            type="text"
            name="subject"
            maxLength={LIMIT.subject}
            placeholder="What is this regarding?"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-cyan-500/30 transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Message</span>
        <textarea
          name="message"
          rows={6}
          required
          maxLength={LIMIT.message}
          placeholder="Describe your course, payment related queries..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-cyan-500/30 transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2"
        />
      </label>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-w-40 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
        <p className="text-xs text-slate-500">
          By submitting, you agree to be contacted about your enquiry.
        </p>
      </div>
    </form>
  );
}
