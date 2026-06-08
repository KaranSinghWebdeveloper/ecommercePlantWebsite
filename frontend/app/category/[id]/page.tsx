import type { Metadata } from "next";
import CategoryDetailPage from "../../../template-pages/CategoryDetailPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Server-side fetch category for metadata */
async function getCategoryBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/categories/slug/${slug}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

/** Server-side fetch product count for a category */
async function getCategoryProductCount(slug: string) {
  try {
    const res = await fetch(`${API_URL}/products?category=${slug}&limit=1`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return 0;
    const json = await res.json();
    return json.meta?.total ?? 0;
  } catch {
    return 0;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title =
    category.seoTitle ||
    `Buy ${category.name} Online – Best ${category.name} Prices | HarYali`;
  const description =
    category.seoDescription ||
    category.description ||
    `Shop the best ${category.name.toLowerCase()} online at HarYali. Fresh, healthy plants delivered to your door. Free delivery above ₹999.`;

  const canonical = `${SITE_URL}/category/${slug}`;

  return {
    title,
    description,
    keywords: [
      `${category.name.toLowerCase()} online`,
      `buy ${category.name.toLowerCase()}`,
      `${category.name.toLowerCase()} plant`,
      `${category.name.toLowerCase()} delivery`,
      "HarYali plants",
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: category.imageUrl
        ? [{ url: category.imageUrl, alt: category.name, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: category.imageUrl ? [category.imageUrl] : [],
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { id: slug } = await params;
  const category = await getCategoryBySlug(slug);
  const productCount = await getCategoryProductCount(slug);

  /** JSON-LD: BreadcrumbList + ItemList */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Categories",
            item: `${SITE_URL}/#categories`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category?.name ?? slug,
            item: `${SITE_URL}/category/${slug}`,
          },
        ],
      },
      ...(category
        ? [
            {
              "@type": "CollectionPage",
              "@id": `${SITE_URL}/category/${slug}`,
              name: category.name,
              description:
                category.description ||
                `Shop ${category.name} at HarYali`,
              url: `${SITE_URL}/category/${slug}`,
              numberOfItems: productCount,
              image: category.imageUrl || undefined,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryDetailPage />
    </>
  );
}
