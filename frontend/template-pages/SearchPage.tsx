"use client";

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, ChevronDown, Search, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FloatingCart from '../components/FloatingCart';
import MobileBottomNav from '../components/MobileBottomNav';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { ApiCategory } from '../lib/api/categories';
import type { ApiProduct } from '../lib/api/products';

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Most Relevant' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular',   label: 'Best Sellers' },
  { value: 'newest',    label: 'New Arrivals' },
  { value: 'discount',  label: 'Highest Discount' },
] as const;

// Deduplicate by value
const UNIQUE_SORT_OPTIONS = Array.from(
  new Map(SORT_OPTIONS.map((o) => [o.label, o])).values()
);

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-[3/4]" />
      ))}
    </div>
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read from URL params
  const [query, setQuery]                 = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy]               = useState<string>('newest');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters]     = useState(false);
  const [minPrice, setMinPrice]           = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice]           = useState(searchParams.get('maxPrice') || '');
  const [inStockOnly, setInStockOnly]     = useState(false);
  const [inputValue, setInputValue]       = useState(searchParams.get('q') || '');

  // Keep local state in sync with URL
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setInputValue(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  // ── API: categories for filter panel ────────────────────────────────────
  const { data: categories = [] } = useCategories();

  // ── API: products from backend (with q, category, price, sort) ──────────
  const {
    data: apiProducts = [],
    isLoading,
    isError,
  } = useProducts({
    q: query || undefined,
    category: selectedCategory || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: sortBy as any,
    limit: 100,
  });

  // Client-side stock filter (backend doesn't have boolean inStockOnly in the same pass)
  const results: ApiProduct[] = useMemo(() => {
    if (!inStockOnly) return apiProducts;
    return apiProducts.filter(
      (p) => p.stockStatus === 'in_stock' && p.stockAvailable > 0
    );
  }, [apiProducts, inStockOnly]);

  const hasActiveFilters = !!(selectedCategory || minPrice || maxPrice || inStockOnly);

  // Push new search to URL
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams();
      if (inputValue.trim()) params.set('q', inputValue.trim());
      if (selectedCategory) params.set('category', selectedCategory);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      router.push(`/search?${params.toString()}`);
    },
    [inputValue, selectedCategory, minPrice, maxPrice, router]
  );

  const resetFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Search</span>
          {query && (
            <>
              <span>/</span>
              <span className="text-foreground">&ldquo;{query}&rdquo;</span>
            </>
          )}
        </nav>

        {/* Inline search bar for refinement */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search for plants, accessories..."
              className="w-full px-4 py-3 pl-11 rounded-xl border border-input bg-input-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Page title */}
        <div className="mb-6">
          {query ? (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Results for{' '}
                <span className="text-primary">&ldquo;{query}&rdquo;</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isLoading ? 'Searching...' : `${results.length} product${results.length !== 1 ? 's' : ''} found`}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">All Products</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isLoading ? 'Loading...' : `${results.length} products available`}
              </p>
            </>
          )}
        </div>

        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              hasActiveFilters
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-input hover:border-primary'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-white text-primary rounded-full text-xs flex items-center justify-center font-bold">
                {[selectedCategory, minPrice, maxPrice, inStockOnly].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm cursor-pointer"
            >
              {UNIQUE_SORT_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="bg-muted/40 border border-border rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="">All Categories</option>
                    {(categories as ApiCategory[]).map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Min Price (₹)
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    min={0}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Max Price (₹)
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="9999"
                    min={0}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                {/* Stock + Reset */}
                <div className="flex flex-col justify-between gap-3">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <span className="text-sm group-hover:text-primary transition-colors">In Stock Only</span>
                  </label>
                  {hasActiveFilters && (
                    <button onClick={resetFilters} className="text-sm text-destructive hover:underline text-left">
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <p className="text-muted-foreground text-lg">Failed to load products. Please try again.</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && !isError && <ProductGridSkeleton />}

        {/* Results */}
        {!isLoading && !isError && (
          <AnimatePresence mode="wait">
            {results.length > 0 ? (
              <motion.div
                key={`${query}-${selectedCategory}-${sortBy}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
              >
                {results.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.25 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🌵</div>
                <h2 className="text-xl font-bold text-foreground mb-2">No plants found</h2>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {query
                    ? `We couldn't find anything matching "${query}". Try a different keyword.`
                    : 'No products match your current filters.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="px-5 py-2.5 rounded-xl border border-input hover:border-primary text-sm font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                  <Link
                    href="/"
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Browse All Plants
                  </Link>
                </div>

                {/* Quick search suggestions */}
                <div className="mt-10">
                  <p className="text-sm text-muted-foreground mb-3 font-medium">Try searching for:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Monstera', 'Snake Plant', 'Bonsai', 'Aloe Vera', 'Air Purifying'].map((s) => (
                      <Link
                        key={s}
                        href={`/search?q=${encodeURIComponent(s)}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-sm transition-colors"
                      >
                        <Search className="w-3 h-3" />
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ── Explore Other Categories ──────────────────────────────────────── */}
        <section className="mt-16 md:mt-20">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              Explore Categories
            </h2>
            <p className="text-sm text-muted-foreground">
              Browse plants by type — find exactly what you need
            </p>
          </div>

          {/* Loading skeletons */}
          {(categories as ApiCategory[]).length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {(categories as ApiCategory[]).map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={() => {
                      // If user clicks a category, update the filter too
                      setSelectedCategory(cat.slug);
                    }}
                    className="group relative block aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                  >
                    <ImageWithFallback
                      src={(cat as any).imageUrl || ''}
                      alt={(cat as any).imageAlt || cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 text-white">
                      <h3 className="font-semibold text-sm md:text-base leading-tight mb-0.5">
                        {cat.name}
                      </h3>
                      {cat.productCount !== undefined && (
                        <p className="text-xs text-white/75">{cat.productCount} products</p>
                      )}
                    </div>
                    {/* Active highlight */}
                    {selectedCategory === cat.slug && (
                      <div className="absolute inset-0 ring-2 ring-primary ring-inset rounded-2xl pointer-events-none" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      <FloatingCart />
      <MobileBottomNav />
      <Footer />
    </div>
  );
}
