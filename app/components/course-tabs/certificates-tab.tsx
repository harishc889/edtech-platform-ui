"use client";

import type { PlayerCertification } from "@/app/components/enrolled-course-player";

type Props = {
  certifications: PlayerCertification[];
};

export default function CertificatesTab({ certifications }: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
      <h2 className="font-display text-lg font-bold text-white sm:text-xl">
        Your certificates
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Download or verify credentials issued to your account.
      </p>
      {certifications.length === 0 ? (
        <p className="mt-8 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-6 text-sm text-slate-500">
          Certificates will appear here after your academy records course completion.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {certifications.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-lg"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-400">
                Credential
              </p>
              <p className="mt-2 font-semibold text-white">{c.title}</p>
              <p className="mt-2 text-xs text-slate-500">Issued {c.issuedOn}</p>
              {c.credentialId ? (
                <p className="mt-1 text-xs text-slate-500">ID: {c.credentialId}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {c.verifyUrl ? (
                  <a
                    href={c.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20"
                  >
                    Download / verify
                  </a>
                ) : (
                  <span className="text-xs text-slate-500">Link not available yet</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
