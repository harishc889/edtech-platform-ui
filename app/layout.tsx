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
  metadataBase: new URL("https://labimacademy.com"),
  title: {
    default: "LA BIM Academy | BIM Courses in India",
    template: "%s | LA BIM Academy",
  },
  description:
    "Job-oriented BIM courses in Architecture, Structure, and MEP with live project training, mentorship, and placement support.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://labimacademy.com",
    siteName: "LA BIM Academy",
    title: "LA BIM Academy | BIM Courses in India",
    description:
      "Master BIM with expert-led, project-based training for AEC careers.",
    images: [
      {
        url: "/images/hero-home.webp",
        width: 1200,
        height: 630,
        alt: "LA BIM Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LA BIM Academy | BIM Courses in India",
    description:
      "Expert-led BIM training with practical projects and career support.",
    images: ["/images/hero-home.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
