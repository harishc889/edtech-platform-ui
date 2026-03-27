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
      // Demo UI only: we "send" an OTP and display a hint.
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
      // Demo UI only: verify OTP on the client.
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl bg-white/90 p-7 shadow-lg ring-1 ring-zinc-200 backdrop-blur">
          <div className="text-center">
            <p className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
              Sign in with OTP
            </p>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
              Login
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Enter your phone or email to receive a 6-digit OTP.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-zinc-900">
                Phone or email
              </span>
              <input
                className="mt-2 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="name@example.com or +1 555 123 4567"
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
              className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isSending ? "Sending..." : "Send OTP"}
            </button>

            <div className="pt-2">
              <label className="block">
                <span className="text-sm font-medium text-zinc-900">
                  OTP (6 digits)
                </span>
                <input
                  className="mt-2 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center text-lg tracking-widest text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="123456"
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
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>

            {status ? (
              <p
                className={`rounded-xl border px-4 py-3 text-sm ${
                  status.startsWith("Verification successful")
                    ? "border-green-200 bg-green-50 text-green-800"
                    : status.includes("Demo OTP")
                      ? "border-indigo-200 bg-indigo-50 text-indigo-800"
                      : "border-zinc-200 bg-zinc-50 text-zinc-800"
                }`}
              >
                {status}
              </p>
            ) : null}

            <p className="text-center text-xs leading-5 text-zinc-500">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

