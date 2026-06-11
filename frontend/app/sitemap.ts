import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function fetchAllProducts() {
  try {
    const res = await fetch(`${API_URL}/products?limit=500`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchAllProducts(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat: any) => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    lastModified: new Date(cat.updatedAt || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product: any) => ({
    url: `${SITE_URL}/plants/${product.slug}`,
    lastModified: new Date(product.updatedAt || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.9,
    images: product.images?.[0]?.imageUrl
      ? [
          {
            url: product.images[0].imageUrl,
            title: product.name,
            caption: product.shortDescription,
          },
        ]
      : undefined,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
