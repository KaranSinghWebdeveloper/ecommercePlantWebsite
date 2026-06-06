"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { motion } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FloatingCart from '../components/FloatingCart';
import MobileBottomNav from '../components/MobileBottomNav';
import { products as allProducts, categories } from '../data/products';
import { productImages, categoryImages, heroImages } from '../data/imageMapping';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sortBy, setSortBy] = useState<string>('featured');

  const category = categories.find(c => c.id === id);

  const categoryWithImage = category
    ? {
        ...category,
        image: categoryImages[category.id as keyof typeof categoryImages] || heroImages[0],
      }
    : null;

  const displayProducts = useMemo(() => {
    if (!category) return [];

    let filtered = allProducts
      .filter(p => p.category === category.name)
      .map(p => ({
        ...p,
        image: productImages[p.id as keyof typeof productImages] || heroImages[0],
      }));

    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'bestsellers':
        filtered = filtered.filter(p => p.bestSeller);
        break;
      case 'new':
        filtered = filtered.filter(p => p.newArrival);
        break;
      default:
        filtered = filtered.filter(p => p.featured);
        if (filtered.length === 0) {
          filtered = allProducts
            .filter(p => p.category === category.name)
            .map(p => ({
              ...p,
              image: productImages[p.id as keyof typeof productImages] || heroImages[0],
            }));
        }
        break;
    }

    return filtered;
  }, [category, sortBy]);

  const otherCategories = categories
    .filter(c => c.id !== id)
    .map(c => ({
      ...c,
      image: categoryImages[c.id as keyof typeof categoryImages] || heroImages[0],
    }));

  if (!category || !categoryWithImage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
          <Link href="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/#categories" className="hover:text-primary">Categories</Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Category Hero */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden mb-10 md:mb-12"
        >
          <div className="relative h-48 sm:h-56 md:h-72">
            <ImageWithFallback
              src={categoryWithImage.image}
              alt={category.name}
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
              <p className="text-white/90 text-sm md:text-lg max-w-2xl mb-4">
                {category.description}
              </p>
              <div className="flex items-center gap-2 text-white/90">
                <Package className="w-5 h-5" />
                <span className="text-sm md:text-base font-medium">
                  {displayProducts.length} {displayProducts.length === 1 ? 'product' : 'products'} available
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Products in {category.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Browse our curated collection of {category.name.toLowerCase()}
              </p>
            </div>

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

          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {displayProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-2xl">
              <p className="text-muted-foreground text-lg mb-4">
                No products found in this category.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                Browse all products
              </Link>
            </div>
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherCategories.slice(0, 4).map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/category/${cat.id}`}
                  className="group relative block aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                >
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h3 className="font-semibold text-sm md:text-base mb-1">{cat.name}</h3>
                    <p className="text-xs text-white/80">{cat.productCount} products</p>
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
