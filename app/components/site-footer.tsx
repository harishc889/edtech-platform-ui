import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-sky-950/60 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          <div>
            <p className="font-display text-xl font-bold text-sky-100">
              LA Bim Academy
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
            LA BIM Academy is a professional training institute focused on delivering industry-relevant BIM education. We help students, engineers, architects, and working professionals develop practical skills that connect academic knowledge with real-world construction and design project requirements.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-300/80">
              Quick Links
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="transition hover:text-sky-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/course" className="transition hover:text-sky-200">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-sky-200">
                  About Us
                </Link>
              </li>            
              
              <li>
                <Link href="/contact" className="transition hover:text-sky-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="hidden">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-300/80">
              Services
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                Architectural BIM Modeling
              </li>
              <li>
                Structural BIM Modeling
              </li>
              <li>
                MEP BIM Modeling
              </li>
              <li>
                Landscape BIM Modeling
              </li>
            </ul>
          </div>
          <div className="hidden">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-300/80">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>Vasant Kunj , India</li>
              <li>+91-7017578290</li>
              <li>la@labimsolutions.com</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-300/80">
              Other Links
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/fee-payment" className="text-slate-400 transition hover:text-sky-200">
                  Fee Payment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 transition hover:text-sky-200">
                  Contact Us
                </Link>
              </li>
              {/* <li>
                <Link href="/sitemap" className="text-slate-400 transition hover:text-sky-200">
                  Sitemap
                </Link>
              </li> */}
              <li>
                <Link href="/cancellation-policy" className="text-slate-400 transition hover:text-sky-200">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-slate-400 transition hover:text-sky-200">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-slate-400 transition hover:text-sky-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="text-slate-400 transition hover:text-sky-200">
                  Terms &amp; Conditions
                </Link>
              </li>
              {/* <li>
                <Link href="/evaluation-criteria" className="text-slate-400 transition hover:text-sky-200">
                  Evaluation Criteria
                </Link>
              </li>
              <li>
                <Link href="/referral-terms" className="text-slate-400 transition hover:text-sky-200">
                  Terms &amp; Conditions for Referral Program
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} LA Bim Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
