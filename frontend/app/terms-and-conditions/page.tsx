import type { Metadata } from "next";
import TermsConditionsPage from "../../template-pages/TermsConditionsPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read HarYali's terms and conditions of service. Information on user responsibilities, disclaimers, and legal policies.",
  alternates: {
    canonical: `${SITE_URL}/terms-and-conditions`,
  },
};

export default function TermsConditionsRoute() {
  return <TermsConditionsPage />;
}
