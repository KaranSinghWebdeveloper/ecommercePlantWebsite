"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Package, AlertCircle, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FloatingCart from '../components/FloatingCart';
import MobileBottomNav from '../components/MobileBottomNav';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCategory, useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import type { ApiProduct } from '../lib/api/products';
import type { ApiCategory } from '../lib/api/categories';

// ── Skeleton loaders ────────────────────────────────────────────────────────

function CategoryHeroSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-10 md:mb-12 h-48 sm:h-56 md:h-72 bg-muted animate-pulse" />
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-[3/4]" />
      ))}
    </div>
  );
}

function CategoryCardSkeleton() {
  return (
    <div className="aspect-square rounded-2xl bg-muted animate-pulse" />
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function CategoryDetailPage() {
  // The Next.js route is /category/[id] — the param "id" holds the slug value
  const { id: slug } = useParams<{ id: string }>();
  const [sortBy, setSortBy] = useState<string>('featured');

  // ── API: fetch the current category by slug ──────────────────────────────
  const {
    data: category,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useCategory(slug);

  // ── API: fetch products filtered by category slug ────────────────────────
  const {
    data: rawProducts = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts({ category: slug, limit: 100 });

  // ── API: fetch all categories for "Explore Other Categories" ────────────
  const { data: allCategories = [], isLoading: categoriesLoading } = useCategories();

  // ── Client-side sort (the API gives us a flat list, sort here) ───────────
  const displayProducts = useMemo(() => {
    const products: ApiProduct[] = [...rawProducts];
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => Number(a.price) - Number(b.price));
      case 'price-high':
        return [...products].sort((a, b) => Number(b.price) - Number(a.price));
      case 'bestsellers':
        return products.filter((p) => p.bestSeller);
      case 'new':
        return products.filter((p) => p.newArrival);
      case 'featured':
      default: {
        const featured = products.filter((p) => p.featured);
        return featured.length > 0 ? featured : products;
      }
    }
  }, [rawProducts, sortBy]);

  // Other categories (excluding current)
  const otherCategories = useMemo(
    () => (allCategories as ApiCategory[]).filter((c) => c.slug !== slug),
    [allCategories, slug]
  );

  // ── Not found state ───────────────────────────────────────────────────────
  if (categoryError) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t find the category &quot;{slug}&quot;.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/#categories" className="hover:text-primary transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-foreground font-medium">
            {categoryLoading ? (
              <span className="inline-block w-24 h-4 bg-muted animate-pulse rounded" />
            ) : (
              category?.name
            )}
          </span>
        </nav>

        {/* Category Hero */}
        {categoryLoading ? (
          <CategoryHeroSkeleton />
        ) : category ? (
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden mb-10 md:mb-12"
          >
            <div className="relative h-48 sm:h-56 md:h-72">
              <ImageWithFallback
                src={category.imageUrl || ''}
                alt={category.imageAlt || category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10">
                <Link
                  href="/#categories"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 w-fit transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  All Categories
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-white/90 text-sm md:text-lg max-w-2xl mb-4">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-white/90">
                  <Package className="w-5 h-5" />
                  <span className="text-sm md:text-base font-medium">
                    {productsLoading ? (
                      <span className="inline-block w-20 h-4 bg-white/20 animate-pulse rounded" />
                    ) : (
                      `${rawProducts.length} ${rawProducts.length === 1 ? 'product' : 'products'} available`
                    )}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Products Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {categoryLoading ? (
                  <span className="inline-block w-48 h-8 bg-muted animate-pulse rounded" />
                ) : (
                  `Products in ${category?.name ?? ''}`
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                Browse our curated collection of{' '}
                {category?.name?.toLowerCase() ?? 'plants'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground hidden md:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 md:px-4 py-2 rounded-lg border border-input bg-input-background focus:outline-none focus:ring-2 focus:ring-primary text-sm w-full md:w-auto"
              >
                <option value="featured">Featured</option>
                <option value="bestsellers">Best Sellers</option>
                <option value="new">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {productsLoading && <ProductGridSkeleton />}

          {/* Error */}
          {productsError && !productsLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 bg-muted/30 rounded-2xl">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <p className="text-muted-foreground text-lg">Failed to load products. Please try again.</p>
            </div>
          )}

          {/* Product Grid */}
          {!productsLoading && !productsError && (
            displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/30 rounded-2xl">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
                <p className="text-muted-foreground text-lg mb-4">
                  No products found in this category yet.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  Browse all products
                </Link>
              </div>
            )
          )}
        </section>

        {/* Other Categories */}
        <section className="mt-16 md:mt-20">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Explore Other Categories
            </h2>
            <p className="text-sm text-muted-foreground">
              Discover more plants for every space and style
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {categoriesLoading
              ? Array.from({ length: 4 }).map((_, i) => <CategoryCardSkeleton key={i} />)
              : otherCategories.map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link
                      href={`/category/${cat.slug}`}
                      className="group relative block aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                    >
                      <ImageWithFallback
                        src={cat.imageUrl || ''}
                        alt={cat.imageAlt || cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-2 md:p-4 text-white text-center md:text-left">
                        <h3 className="font-semibold text-[10px] sm:text-xs md:text-base leading-tight md:mb-1 line-clamp-2 md:line-clamp-1">{cat.name}</h3>
                        {cat.productCount !== undefined && (
                          <p className="text-[9px] md:text-xs text-white/80 hidden md:block">{cat.productCount} products</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </section>
      </div>

      <FloatingCart />
      <MobileBottomNav />
      <Footer />
    </div>
  );
}
