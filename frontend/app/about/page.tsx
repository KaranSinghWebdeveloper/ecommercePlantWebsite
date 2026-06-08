import type { Metadata } from "next";
import AboutPage from "../../template-pages/AboutPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about HarYali's mission to make every house green. Discover our story, our values, and our commitment to sustainable, beautiful indoor plants.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Us | HarYali",
    description: "Learn about HarYali's mission to make every house green.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  mainEntity: {
    "@type": "Organization",
    name: "HarYali",
    description: "A premium online nursery dedicated to bringing the joy and health benefits of greenery to every doorstep.",
    url: SITE_URL,
  }
};

export default function AboutRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutPage />
    </>
  );
}
