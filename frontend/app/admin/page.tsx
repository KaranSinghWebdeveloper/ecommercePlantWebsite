import type { Metadata } from "next";
import AdminDashboard from "../../template-pages/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin – HarYali",
  robots: { index: false, follow: false },
};

export default function Admin() {
  return <AdminDashboard />;
}
