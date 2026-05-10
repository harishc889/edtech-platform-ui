import type { JsonLdData } from "@/lib/seo/schemas";

type JsonLdProps = {
  data: JsonLdData;
};

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
