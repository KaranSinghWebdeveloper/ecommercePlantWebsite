import type { Metadata } from "next";
import ProductDetailPage from "../../../template-pages/ProductDetailPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProductBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/products/slug/${slug}`, {
      next: { revalidate: 1800 }, // ISR: revalidate every 30 min
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title =
    product.seoTitle ||
    `Buy ${product.name} Online – ₹${product.price} | HarYali`;
  const description =
    product.seoDescription ||
    product.shortDescription ||
    `Buy ${product.name} online at ₹${product.price}. ${product.potIncluded ? "Pot included." : ""} Free delivery above ₹999. Fresh, healthy plants guaranteed.`;

  const primaryImage =
    product.ogImage ||
    product.images?.find((img: any) => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl;

  const canonical = `${SITE_URL}/plants/${slug}`;

  return {
    title,
    description,
    keywords: product.seoKeywords
      ? product.seoKeywords.split(",").map((k: string) => k.trim())
      : [
          `buy ${product.name.toLowerCase()}`,
          `${product.name.toLowerCase()} online`,
          `${product.name.toLowerCase()} plant`,
          product.category?.name?.toLowerCase(),
          "HarYali plants",
          "buy plants online",
        ].filter(Boolean),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: primaryImage
        ? [{ url: primaryImage, alt: product.name, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: primaryImage ? [primaryImage] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id: slug } = await params;
  const product = await getProductBySlug(slug);

  const primaryImage =
    product?.images?.find((img: any) => img.isPrimary)?.imageUrl ||
    product?.images?.[0]?.imageUrl;

  const price = Number(product?.price ?? 0);
  const comparePrice = Number(product?.comparePrice ?? 0);
  const inStock = product?.stockStatus === "in_stock" && product?.stockAvailable > 0;

  /** JSON-LD: BreadcrumbList + Product schema */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: product?.category?.name ?? "Plants",
            item: `${SITE_URL}/category/${product?.category?.slug ?? ""}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product?.name ?? slug,
            item: `${SITE_URL}/plants/${slug}`,
          },
        ],
      },
      ...(product
        ? [
            {
              "@type": "Product",
              "@id": `${SITE_URL}/plants/${slug}`,
              name: product.name,
              description: product.description || product.shortDescription,
              sku: product.sku || product.slug,
              brand: { "@type": "Brand", name: "HarYali" },
              image: product.images?.map((img: any) => img.imageUrl) ?? [],
              url: `${SITE_URL}/plants/${slug}`,
              category: product.category?.name,
              offers: {
                "@type": "Offer",
                url: `${SITE_URL}/plants/${slug}`,
                priceCurrency: "INR",
                price: price,
                priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
                availability: inStock
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
                seller: { "@type": "Organization", name: "HarYali" },
                ...(comparePrice > price && {
                  highPrice: comparePrice,
                  lowPrice: price,
                }),
              },
              ...(Number(product.ratingAvg) > 0 && {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: Number(product.ratingAvg).toFixed(1),
                  reviewCount: product.reviewsCount,
                  bestRating: 5,
                  worstRating: 1,
                },
              }),
              additionalProperty: [
                product.size && {
                  "@type": "PropertyValue",
                  name: "Size",
                  value: product.size,
                },
                {
                  "@type": "PropertyValue",
                  name: "Pot Included",
                  value: product.potIncluded ? "Yes" : "No",
                },
                product.petFriendly !== undefined && {
                  "@type": "PropertyValue",
                  name: "Pet Friendly",
                  value: product.petFriendly ? "Yes" : "No",
                },
              ].filter(Boolean),
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
      <ProductDetailPage />
    </>
  );
}
