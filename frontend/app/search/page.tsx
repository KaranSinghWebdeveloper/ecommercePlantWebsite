import { Suspense } from "react";
import type { Metadata } from "next";
import SearchPage from "../../template-pages/SearchPage";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q?.trim();
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (q) {
    return {
      title: `"${q}" – Plant Search Results`,
      description: `Find "${q}" plants at HarYali. Shop indoor plants, outdoor plants, bonsai & more. Free delivery above ₹999.`,
      // noindex parameterized search pages to avoid duplicate content
      robots: { index: false, follow: true },
      alternates: { canonical: `${SITE_URL}/search` },
    };
  }

  return {
    title: "Search Plants – Browse All Indoor, Outdoor & Specialty Plants",
    description:
      "Search and filter our full catalog of 200+ plants. Indoor plants, outdoor plants, bonsai, air purifiers and more. Free delivery above ₹999.",
    alternates: { canonical: `${SITE_URL}/search` },
    openGraph: {
      title: "Search Plants | HarYali",
      description: "Find the perfect plant for your home or garden.",
      url: `${SITE_URL}/search`,
    },
  };
}

export default function SearchRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Searching…</p>
          </div>
        </div>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
