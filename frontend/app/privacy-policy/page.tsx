import type { Metadata } from "next";
import PrivacyPolicyPage from "../../template-pages/PrivacyPolicyPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read HarYali's Privacy Policy. Learn about how we collect, use, and protect your personal information when you shop for plants with us.",
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function PrivacyPolicyRoute() {
  return <PrivacyPolicyPage />;
}
