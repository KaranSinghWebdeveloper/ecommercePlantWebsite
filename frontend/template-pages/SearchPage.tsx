"use client";

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FloatingCart from '../components/FloatingCart';
import MobileBottomNav from '../components/MobileBottomNav';
import { products as allProducts, categories } from '../data/products';
import { productImages, heroImages } from '../data/imageMapping';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'bestsellers', label: 'Best Sellers' },
  { value: 'new', label: 'New Arrivals' },
  { value: 'discount', label: 'Highest Discount' },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    let filtered = allProducts.map((p) => ({
      ...p,
      image: productImages[p.id as keyof typeof productImages] || heroImages[0],
    }));

    if (q) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.specifications.plantType.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) filtered = filtered.filter((p) => p.category === selectedCategory);
    if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    if (inStockOnly) filtered = filtered.filter((p) => p.inStock);

    switch (sortBy) {
      case 'price-low':  return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high': return [...filtered].sort((a, b) => b.price - a.price);
      case 'bestsellers':return [...filtered].sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
      case 'new':        return [...filtered].sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
      case 'discount':   return [...filtered].sort((a, b) => (b.discount || 0) - (a.discount || 0));
      default:
        return [...filtered].sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0)
        );
    }
  }, [query, selectedCategory, sortBy, minPrice, maxPrice, inStockOnly]);

  const hasActiveFilters = !!(selectedCategory || minPrice || maxPrice || inStockOnly);

  const resetFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
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

        {/* Page title */}
        <div className="mb-6">
          {query ? (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Results for{' '}
                <span className="text-primary">&ldquo;{query}&rdquo;</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {results.length} product{results.length !== 1 ? 's' : ''} found
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">All Products</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {results.length} products available
              </p>
            </>
          )}
        </div>

        {/* Controls */}
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
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Min Price (₹)</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    min={0}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Max Price (₹)</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="9999"
                    min={0}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

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

        {/* Results */}
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
                  transition={{ delay: index * 0.04, duration: 0.25 }}
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

              {/* Suggestions */}
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
      </div>

      <FloatingCart />
      <MobileBottomNav />
      <Footer />
    </div>
  );
}
