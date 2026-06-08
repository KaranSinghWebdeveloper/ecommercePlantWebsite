import type { Metadata } from "next";
import FaqPage from "../../template-pages/FaqPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "FAQ – Frequently Asked Questions",
  description: "Find answers to your questions about HarYali. Shipping policies, plant care tips, order tracking, returns, and refunds.",
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: "FAQ | HarYali",
    description: "Find answers to your questions about plant delivery, care, and more.",
    url: `${SITE_URL}/faq`,
    type: "website",
  },
};

// Rich snippet JSON-LD for Answer Engine Optimization (AEO)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does delivery take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We process orders within 24 hours. Standard delivery takes 3-5 business days across India. For metro cities, we often deliver within 48 hours."
      }
    },
    {
      "@type": "Question",
      name: "How are the plants packaged?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Plants are carefully packaged in specially designed ventilated boxes. We use eco-friendly materials that keep the soil in place and protect the foliage during transit."
      }
    },
    {
      "@type": "Question",
      name: "My plant arrived looking droopy. Is it dying?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not necessarily! Plants can experience 'transit shock'. Give it some water (if the soil is dry), place it in appropriate light, and let it rest for a few days. It should bounce back."
      }
    },
    {
      "@type": "Question",
      name: "What if my plant arrives damaged?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer a 7-day plant replacement guarantee. If your plant arrives severely damaged, please take a photo and contact us within 24 hours of delivery. We will send a free replacement."
      }
    }
  ]
};

export default function FaqRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqPage />
    </>
  );
}
