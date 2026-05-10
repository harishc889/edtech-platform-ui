import { trimOrEmpty } from "@/lib/string-trim";

const SITE_NAME = "LA BIM Academy";

function stripHtml(value: string): string {
  return trimOrEmpty(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
}

export function faqSchema(items: Array<{ q: string; answerHtml: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(item.answerHtml),
      },
    })),
  };
}

export function courseSchema(input: {
  name: string;
  description: string;
  url: string;
  image?: string;
  priceInr?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    description: input.description,
    url: input.url,
    image: input.image,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: "https://labimacademy.com",
    },
    offers:
      typeof input.priceInr === "number" && Number.isFinite(input.priceInr) && input.priceInr > 0
        ? {
            "@type": "Offer",
            priceCurrency: "INR",
            price: String(input.priceInr),
            availability: "https://schema.org/InStock",
            url: input.url,
          }
        : undefined,
  };
}

export function breadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

/** Values produced by this module — safe for `application/ld+json`. */
export type JsonLdData =
  | ReturnType<typeof faqSchema>
  | ReturnType<typeof courseSchema>
  | ReturnType<typeof breadcrumbSchema>;
