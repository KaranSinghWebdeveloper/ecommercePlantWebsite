import type { Metadata } from "next";
import ContactPage from "../../template-pages/ContactPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the HarYali team. We're here to help you with your plant care, orders, shipping, and any other inquiries you might have.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact Us | HarYali",
    description: "Get in touch with the HarYali plant experts today.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  mainEntity: {
    "@type": "Organization",
    name: "HarYali",
    url: SITE_URL,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-98765-43210",
      contactType: "customer service",
      email: "hello@haryali.com",
      areaServed: "IN",
      availableLanguage: ["en", "hi"]
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Green Valley Road",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560034",
      addressCountry: "IN"
    }
  }
};

export default function ContactRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactPage />
    </>
  );
}
