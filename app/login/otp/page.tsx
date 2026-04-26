"use client";

import { useMemo, useState } from "react";

export default function OtpLoginPage() {
  const expectedOtp = useMemo(() => "123456", []);

  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [status, setStatus] = useState<string | null>(null);

  const otpIsValid = otp.length === 6 && /^[0-9]{6}$/.test(otp);

  function handleIdentifierChange(value: string) {
    setIdentifier(value);
    setStatus(null);
    setOtpSent(false);
    setOtp("");
  }

  async function handleSendOtp() {
    const nextIdentifier = identifier.trim();
    setStatus(null);

    if (!nextIdentifier) {
      setStatus("Please enter your phone number or email.");
      return;
    }

    setIsSending(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setOtpSent(true);
      setOtp("");
      setStatus(`OTP sent. Demo OTP: ${expectedOtp}`);
    } finally {
      setIsSending(false);
    }
  }

  async function handleVerify() {
    setStatus(null);

    if (!otpSent) {
      setStatus("Please send an OTP first.");
      return;
    }

    if (!otpIsValid) {
      setStatus("Enter the 6-digit OTP.");
      return;
    }

    setIsVerifying(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      if (otp === expectedOtp) {
        setStatus("Verification successful. Welcome!");
      } else {
        setStatus("Invalid OTP. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  }

  const inputClass =
    "mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
          <div className="text-center">
            <p className="inline-flex rounded-full bg-cyan-50 px-4 py-1 text-xs font-bold uppercase tracking-wide text-cyan-800">
              Sign in with OTP
            </p>
            <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900">
              Login
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Enter your phone or email to receive a 6-digit OTP.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Phone or email
              </span>
              <input
                className={inputClass}
                placeholder="Email ID or +1 555 123 4567"
                value={identifier}
                onChange={(e) => handleIdentifierChange(e.target.value)}
                autoComplete="username"
                inputMode="email"
              />
            </label>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSending || !identifier.trim()}
              className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? "Sending..." : "Send OTP"}
            </button>

            <div className="pt-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">
                  OTP (6 digits)
                </span>
                <input
                  className={`${inputClass} text-center text-lg tracking-[0.35em] disabled:cursor-not-allowed disabled:opacity-60`}
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    setOtp(onlyNumbers.slice(0, 6));
                    setStatus(null);
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  disabled={!otpSent || isVerifying}
                />
              </label>

              <button
                type="button"
                onClick={handleVerify}
                disabled={!otpSent || isVerifying || !otpIsValid}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-4 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>

            {status ? (
              <p
                className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                  status.startsWith("Verification successful")
                    ? "border-green-200 bg-green-50 text-green-800"
                    : status.includes("Demo OTP")
                      ? "border-cyan-200 bg-cyan-50 text-cyan-900"
                      : "border-slate-200 bg-slate-50 text-slate-800"
                }`}
              >
                {status}
              </p>
            ) : null}

            <p className="text-center text-xs leading-5 text-slate-500">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
