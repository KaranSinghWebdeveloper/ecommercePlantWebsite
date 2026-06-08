import type { Metadata } from "next";
import HomePage from "../template-pages/HomePage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  description:
    "Shop fresh indoor plants, outdoor plants, bonsai, flowering plants & air-purifying plants online. Free delivery above ₹999. Premium quality, guaranteed freshness.",
  keywords: [
    "buy plants online India",
    "indoor plants online",
    "outdoor plants",
    "air purifying plants",
    "bonsai plants",
    "plant delivery",
    "HarYali plants",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "HarYali – Buy Fresh Plants Online | Indoor, Outdoor & More",
    description:
      "Discover 200+ varieties of indoor & outdoor plants. Premium quality, fast delivery, and expert care guides.",
    url: SITE_URL,
    type: "website",
  },
};

/** JSON-LD Organization + WebSite schema for Google rich results */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "HarYali",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/HarYali.png`,
        width: 70,
        height: 70,
      },
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["English", "Hindi"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "HarYali",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomePage />
    </>
  );
}
