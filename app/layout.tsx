import type { Metadata } from "next";
import FloatingEnquiryCta from "./components/floating-enquiry-cta";
import { Inter, Poppins } from "next/font/google";
import SiteFooter from "./components/site-footer";
import SiteHeader from "./components/site-header";
import { ToastProvider } from "./components/toast-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EdTech Academy — Live courses & professional learning",
  description:
    "Join interactive live classes, track progress, and build skills that matter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full data-scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <ToastProvider>
          <SiteHeader />
          <FloatingEnquiryCta />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </ToastProvider>
      </body>
    </html>
  );
}
