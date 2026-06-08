import type { Metadata } from "next";
import CheckoutPage from "../../template-pages/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout – HarYali",
  description: "Complete your plant order securely.",
  robots: { index: false, follow: false },
};

export default function Checkout() {
  return <CheckoutPage />;
}
