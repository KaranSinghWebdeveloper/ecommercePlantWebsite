import type { Metadata } from "next";
import RefundPolicyPage from "../../template-pages/RefundPolicyPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Refund & Replacement Policy",
  description: "Review HarYali's refund and replacement policy. Learn about our 7-day plant guarantee and how to request a replacement for damaged deliveries.",
  alternates: {
    canonical: `${SITE_URL}/refund-policy`,
  },
};

export default function RefundPolicyRoute() {
  return <RefundPolicyPage />;
}
