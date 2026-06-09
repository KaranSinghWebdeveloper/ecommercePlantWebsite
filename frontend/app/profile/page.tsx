import type { Metadata } from "next";
import CustomerProfilePage from "../../template-pages/CustomerProfilePage";

export const metadata: Metadata = {
  title: "My Account – HarYali",
  description: "Manage your HarYali account, view orders, and update your details.",
  robots: { index: false, follow: false },
};

export default function ProfileRoute() {
  return <CustomerProfilePage />;
}
