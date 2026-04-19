"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import {
  authSelectClass,
} from "@/app/components/password-field-with-toggle";
import { SelectField } from "@/app/components/select-field";
import {
  PROGRAM_CATALOG,
  getProgramById,
  type PaymentOption,
} from "@/lib/program-catalog";
import {
  RAZORPAY_CHECKOUT_SCRIPT,
  runRazorpayPaymentFlow,
} from "@/lib/razorpay-checkout-flow";

const ENROLLMENT_TERMS = [
  "Available seats are limited and filled on a first-come, first-served basis.",
  "Please provide accurate learner and guardian/emergency contact details.",
  "Any change in contact details must be shared in writing within 10 days.",
  "Program schedule, timing, and venue may change based on academic or operational requirements.",
  "In case of serious misconduct, indiscipline, or policy violations, enrollment may be cancelled.",
  "Registration or admission fees are non-refundable once paid.",
  "If misconduct occurs toward staff members, the institute may discontinue participation without refund.",
  "In case of disputes, institute management decisions will be considered final.",
  "Missed sessions are learner responsibility; backup sessions are not guaranteed for every absence.",
  "All rules are designed to maintain quality, fairness, and a professional learning environment.",
];

function formatInr(amount: number) {
  return `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

const selectClass = authSelectClass;

type Props = {
  /** From URL ?course= — must match a program id */
  initialCourseId?: string;
};

export function EnrollForm({ initialCourseId }: Props) {
  const defaultCourseId = PROGRAM_CATALOG[0]?.id ?? "";

  const resolvedInitial =
    initialCourseId && getProgramById(initialCourseId)
      ? initialCourseId
      : defaultCourseId;

  const [courseId, setCourseId] = useState(resolvedInitial);
  const [paymentId, setPaymentId] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [designation, setDesignation] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [country, setCountry] = useState("India");
  const [stateValue, setStateValue] = useState("");
  const [city, setCity] = useState("");
  const [heardFrom, setHeardFrom] = useState("");
  const [bestTime, setBestTime] = useState("");
  const [paymentMode, setPaymentMode] = useState("upfront");
  const [paymentGateway, setPaymentGateway] = useState("razorpay");
  const [otherPaymentAmount, setOtherPaymentAmount] = useState("");
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentEvaluation, setConsentEvaluation] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const program = getProgramById(courseId);

  const paymentOptions: PaymentOption[] = useMemo(() => {
    if (!program) return [];

    if (paymentMode === "upfront") {
      return [
        {
          id: "upfront",
          label: "Upfront Payment",
          amountDisplay: formatInr(program.upfrontInr),
          amountInr: program.upfrontInr,
        },
      ];
    }

    if (paymentMode === "book-slot") {
      return [
        {
          id: "book-slot",
          label: "Book Slot",
          amountDisplay: formatInr(program.seatBookingInr),
          amountInr: program.seatBookingInr,
        },
      ];
    }

    return [3, 6, 9, 12].map((months) => {
      const monthly = Math.ceil(program.upfrontInr / months);
      return {
        id: `emi-${months}`,
        label: `EMI - ${months} Months`,
        amountDisplay: `${formatInr(monthly)} / month`,
        amountInr: monthly * months,
      };
    });
  }, [program, paymentMode]);

  useEffect(() => {
    const next =
      initialCourseId && getProgramById(initialCourseId)
        ? initialCourseId
        : defaultCourseId;
    setCourseId(next);
  }, [initialCourseId, defaultCourseId]);

  useEffect(() => {
    const first = paymentOptions[0]?.id ?? "";
    setPaymentId((prev) => {
      if (paymentOptions.some((p) => p.id === prev)) return prev;
      return first;
    });
  }, [paymentOptions]);

  useEffect(() => {
    if (!termsOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [termsOpen]);

  const selectedPayment = paymentOptions.find((p) => p.id === paymentId);

  function validateForm() {
    const nextErrors: Record<string, string> = {};

    if (!firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!mobile.trim()) {
      nextErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(mobile.trim())) {
      nextErrors.mobile = "Mobile number must be exactly 10 digits.";
    }
    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "please enter valid email";
    }
    // Designation field is optional / hidden in the current layout — do not block submit.
    if (!courseId.trim()) nextErrors.course = "Course is required.";
    if (!country.trim()) nextErrors.country = "Country is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    if (!program || !selectedPayment || !consentMarketing || !consentTerms) {
      return;
    }

    setPaymentError(null);

    if (paymentGateway === "razorpay") {
      setPaymentBusy(true);
      try {
        const result = await runRazorpayPaymentFlow({
          courseId: program.apiCourseId,
          batchId: program.defaultBatchId,
        });
        if (result.ok) {
          setSubmitted(true);
        } else {
          setPaymentError(result.message);
        }
      } finally {
        setPaymentBusy(false);
      }
      return;
    }

    if (paymentGateway === "stripe") {
      setPaymentError(
        "Stripe checkout is not connected yet. Please choose Razorpay or contact support.",
      );
      return;
    }

    setSubmitted(true);
  }

  if (PROGRAM_CATALOG.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        No programs are available yet.{" "}
        <Link href="/" className="font-semibold text-cyan-700 hover:text-cyan-600">
          Return home
        </Link>
      </p>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg sm:p-8 lg:p-10">
      <Script src={RAZORPAY_CHECKOUT_SCRIPT} strategy="lazyOnload" />
      {submitted ? (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-5 py-8 text-center">
          <p className="font-display text-lg font-bold text-cyan-950">
            Thank you, {firstName || "there"}!
          </p>
          <p className="mt-2 text-sm text-cyan-900">
            We received your enrollment request for{" "}
            <span className="font-semibold">{program?.title}</span> with{" "}
            <span className="font-semibold">{selectedPayment?.label}</span> (
            {selectedPayment?.amountDisplay}) via{" "}
            <span className="font-semibold">
              {paymentGateway === "razorpay" ? "Razorpay" : "Stripe"}
            </span>
            . Our team will contact you shortly.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex justify-center rounded-full border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 hover:border-slate-300"
            >
              Back to home
            </Link>
            <Link
              href="/#courses"
              className="inline-flex justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              View courses
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Enroll Now
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Complete your enrollment form. Fields marked with * are required.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                First Name *
              </span>
              <input
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setErrors((prev) => ({ ...prev, firstName: "" }));
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-cyan-500/30 focus:border-cyan-500 focus:ring-2"
                placeholder="First name"
                required
              />
              {errors.firstName ? (
                <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
              ) : null}
            </label>
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Last Name
              </span>
              <input
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-cyan-500/30 focus:border-cyan-500 focus:ring-2"
                placeholder="Last name"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Mobile Number *
              </span>
              <input
                type="tel"
                autoComplete="tel"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setErrors((prev) => ({ ...prev, mobile: "" }));
                }}
                inputMode="numeric"
                maxLength={10}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-cyan-500/30 focus:border-cyan-500 focus:ring-2"
                placeholder="10-digit mobile number"
                required
              />
              {errors.mobile ? (
                <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>
              ) : null}
            </label>
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Email Address *
              </span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-cyan-500/30 focus:border-cyan-500 focus:ring-2"
                placeholder="you@example.com"
                required
              />
              {errors.email ? (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              ) : null}
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Designation *
              </span>
              <input
                type="text"
                value={designation}
                onChange={(e) => {
                  setDesignation(e.target.value);
                  setErrors((prev) => ({ ...prev, designation: "" }));
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-cyan-500/30 focus:border-cyan-500 focus:ring-2"
                placeholder="Your role"
                required
              />
              {errors.designation ? (
                <p className="mt-1 text-xs text-red-600">{errors.designation}</p>
              ) : null}
            </label> */}
            {/* <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Verify Referral Code
              </span>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-cyan-500/30 focus:border-cyan-500 focus:ring-2"
                placeholder="Optional referral code"
              />
            </label> */}
          </div>

          <div>
            <label
              htmlFor="enroll-course"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Course *
            </label>
            <SelectField
              className="relative mt-2"
              selectClassName={selectClass}
              id="enroll-course"
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setErrors((prev) => ({ ...prev, course: "" }));
              }}
              required
            >
              {PROGRAM_CATALOG.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
              <option value="other">Other</option>
            </SelectField>
            {errors.course ? (
              <p className="mt-1 text-xs text-red-600">{errors.course}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="block sm:col-span-1">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Country *
              </span>
              <SelectField
                className="relative mt-2"
                selectClassName={selectClass}
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setErrors((prev) => ({ ...prev, country: "" }));
                }}
                required
              >
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>United Arab Emirates</option>
                <option>Singapore</option>
                <option>Other</option>
              </SelectField>
              {errors.country ? (
                <p className="mt-1 text-xs text-red-600">{errors.country}</p>
              ) : null}
            </label>
            <label className="block sm:col-span-1">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                State *
              </span>
              <input
                type="text"
                value={stateValue}
                onChange={(e) => setStateValue(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-cyan-500/30 focus:border-cyan-500 focus:ring-2"
                placeholder="State"
                required
              />
            </label>
            <label className="block sm:col-span-1">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                City *
              </span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-cyan-500/30 focus:border-cyan-500 focus:ring-2"
                placeholder="City"
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Where did you hear about us? *
              </span>
              <SelectField
                className="relative mt-2"
                selectClassName={selectClass}
                value={heardFrom}
                onChange={(e) => setHeardFrom(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select source
                </option>
                <option>Instagram</option>
                <option>Website</option>
                <option>Facebook</option>
                <option>WhatsApp</option>
                <option>LinkedIn</option>
                <option>Email</option>
                <option>Other</option>
              </SelectField>
            </label>
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Best time to connect *
              </span>
              <SelectField
                className="relative mt-2"
                selectClassName={selectClass}
                value={bestTime}
                onChange={(e) => setBestTime(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select time
                </option>
                <option>9AM-12PM</option>
                <option>12PM-3PM</option>
                <option>3PM-6PM</option>
                <option>6PM-9PM</option>
              </SelectField>
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Choose your payment *
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { id: "upfront", label: "Upfront Payment" },
                { id: "book-slot", label: "Book Slot" },
                { id: "emi", label: "EMI Options" },
              ].map((mode) => (
                <label
                  key={mode.id}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-bold transition ${
                    paymentMode === mode.id
                      ? "border-cyan-500 bg-cyan-50 text-cyan-800"
                      : "border-slate-200 bg-white text-slate-700 hover:border-cyan-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-mode"
                    value={mode.id}
                    checked={paymentMode === mode.id}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="sr-only"
                  />
                  {mode.label}
                </label>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Payment Plan *
                </span>
                <SelectField
                  className="relative mt-2"
                  selectClassName={`${selectClass} disabled:opacity-50`}
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  disabled={paymentOptions.length === 0}
                  required
                >
                  {paymentOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} - {p.amountDisplay}
                    </option>
                  ))}
                </SelectField>
              </label>
              <label className="block">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Payment Gateway *
                </span>
                <SelectField
                  className="relative mt-2"
                  selectClassName={selectClass}
                  value={paymentGateway}
                  onChange={(e) => setPaymentGateway(e.target.value)}
                  required
                >
                  <option value="razorpay">Razorpay</option>
                  <option value="stripe">Stripe</option>
                </SelectField>
              </label>
            </div>

            {/* <label className="mt-4 block">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Other Payment Amount
              </span>
              <input
                type="number"
                min="0"
                value={otherPaymentAmount}
                onChange={(e) => setOtherPaymentAmount(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-cyan-500/30 focus:border-cyan-500 focus:ring-2"
                placeholder="Enter custom amount if needed"
              />
            </label> */}

            {selectedPayment ? (
              <p className="mt-3 text-xs text-slate-500">
                Selected amount:{" "}
                <span className="font-semibold text-slate-700">
                  {selectedPayment.amountDisplay}
                </span>
              </p>
            ) : null}
          </div>

          <label className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={consentMarketing}
              onChange={(e) => setConsentMarketing(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              required
            />
            <span>
              I authorize LA Bim Academy and its representatives to call, SMS,
              email, or WhatsApp me about products and offers.
            </span>
          </label>

          <label className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={consentTerms}
              onChange={(e) => setConsentTerms(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              required
            />
            <span>
              I agree to{" "}
              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="font-semibold text-cyan-700 underline decoration-cyan-500 decoration-2 underline-offset-2 transition hover:text-cyan-600"
              >
                Terms &amp; Conditions
              </button>
              .
            </span>
          </label>

          {/* <label className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={consentEvaluation}
              onChange={(e) => setConsentEvaluation(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              required
            />
            <span>
              I agree to follow the{" "}
              <Link
                href="/evaluation-criteria"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-cyan-700 underline decoration-cyan-500 decoration-2 underline-offset-2 transition hover:text-cyan-600"
              >
                evaluation criteria
              </Link>
              .
            </span>
          </label> */}

          {paymentError ? (
            <p className="text-sm text-red-600" role="alert">
              {paymentError}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              href="/"
              className="order-2 inline-flex items-center justify-center rounded-full border-2 border-slate-200 px-6 py-3 text-center text-sm font-bold text-slate-800 hover:border-slate-300 sm:order-1"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!program || !selectedPayment || paymentBusy}
              className="order-1 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2"
            >
              {paymentBusy
                ? "Processing payment…"
                : paymentGateway === "razorpay"
                  ? "Submit & pay with Razorpay"
                  : "Submit"}
            </button>
          </div>
        </form>
      )}

      {termsOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/70 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enroll-terms-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setTermsOpen(false)}
            aria-label="Close terms dialog"
          />
          <section className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <header className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 sm:px-8">
              <h2
                id="enroll-terms-title"
                className="font-display text-xl font-bold text-slate-900"
              >
                Terms &amp; Conditions
              </h2>
              <button
                type="button"
                onClick={() => setTermsOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </header>

            <div className="px-6 py-6 sm:px-8 sm:py-7">
              <p className="mb-4 text-sm text-slate-600">
                Please review the following enrollment terms before submitting
                your application.
              </p>
              <ul className="space-y-3">
                {ENROLLMENT_TERMS.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm leading-relaxed text-slate-700"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setTermsOpen(false)}
                  className="rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-500 hover:to-blue-500"
                >
                  I Understand
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
