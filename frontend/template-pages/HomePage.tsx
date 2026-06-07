"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FloatingCart from '../components/FloatingCart';
import MobileBottomNav from '../components/MobileBottomNav';
// import { products as allProducts, categories } from '../data/products';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { productImages, categoryImages, heroImages } from '../data/imageMapping';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useHydrated } from '../hooks/useHydrated';

export default function HomePage() {
  const hydrated = useHydrated();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  // ✅ API hooks
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  console.log('Products:', productsData);
  console.log('Categories:', categoriesData);

  const allProducts = productsData || [];
  const categories = categoriesData || [];
  const categoriesWithImages = categories || [];

  // Filter and sort products
  let displayProducts = [...allProducts];

  if (selectedCategory !== 'all') {
    const category = categories.find(c => c.id === selectedCategory);
    if (category) {
      displayProducts = displayProducts.filter(p => p.category === category.name);
    }
  }

  // Sort products
  switch (sortBy) {
    case 'price-low':
      displayProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      displayProducts.sort((a, b) => b.price - a.price);
      break;
    case 'bestsellers':
      displayProducts = displayProducts.filter(p => p.bestSeller);
      break;
    case 'new':
      displayProducts = displayProducts.filter(p => p.newArrival);
      break;
  }

  // Hero carousel auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handle sticky categories visibility on mobile
  useEffect(() => {
    const handleScroll = () => {
      const categoriesSection = document.getElementById('categories');
      if (!categoriesSection) return;

      const rect = categoriesSection.getBoundingClientRect();
      setIsStickyVisible(rect.top < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const heroContent = [
    {
      title: 'Bring Nature Home 🌿',
      subtitle: 'Fresh Plants Delivered to Your Door',
      cta: 'Shop Now',
    },
    {
      title: 'Fresh & Healthy Plants',
      subtitle: 'Premium Quality, Guaranteed',
      cta: 'Explore Collection',
    },
    {
      title: 'Special Offer: Up to 40% Off',
      subtitle: 'Limited Time Deal on Selected Plants',
      cta: 'Shop Offers',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      rating: 5,
      text: 'Amazing quality plants! My Monstera arrived in perfect condition and is thriving. Will definitely order again!',
      image: '👩',
    },
    {
      name: 'Rahul Verma',
      rating: 5,
      text: 'Fast delivery and excellent packaging. The plants were fresh and healthy. Great service!',
      image: '👨',
    },
    {
      name: 'Sneha Patel',
      rating: 5,
      text: 'Love the variety! Got beautiful plants for my balcony garden. Highly recommend HarYali!',
      image: '👩',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[220px] md:h-[600px] overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/10">
        {hydrated ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20 z-10" />
              <ImageWithFallback
                src={heroImages[currentSlide]}
                alt="Hero"
                className="w-full h-full object-cover"
                sizes="100vw"
                loading="eager"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20 z-10" />
            <ImageWithFallback
              src={heroImages[0]}
              alt="Hero"
              className="w-full h-full object-cover"
              sizes="100vw"
              loading="eager"
            />
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              key={hydrated ? currentSlide : 0}
              initial={false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: hydrated ? 0.3 : 0 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {heroContent[hydrated ? currentSlide : 0].title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md">
                {heroContent[hydrated ? currentSlide : 0].subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#products"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-lg"
                >
                  {heroContent[hydrated ? currentSlide : 0].cta}
                </Link>
                <Link
                  href="#categories"
                  className="px-8 py-3 bg-white/90 text-foreground rounded-full hover:bg-white transition-colors shadow-lg"
                >
                  View Categories
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Sticky Mobile Categories Bar */}
      {/* <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-300 shadow-sm"
        style={{ transform: isStickyVisible ? 'translateY(0)' : 'translateY(-100%)' }}>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-3 py-2 w-max">
            <motion.button
              onClick={() => {
                setSelectedCategory('all');
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
            >
              All
            </motion.button>
            {categoriesWithImages.slice(0, 6).map((category) => (
              <motion.button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === category.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
              >
                {category.name.split(' ')[0]}
              </motion.button>
            ))}
          </div>
        </div>
      </div> */}

      {/* Categories Section */}
      <section id="categories" className="py-8 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mb-8 md:mb-10">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-3">
              Shop by Category
            </h2>
            <p className="text-xs md:text-base text-muted-foreground">
              Explore our wide range of plants for every space and style
            </p>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide scroll-smooth">
          <div className="flex gap-3 md:gap-4 pb-2 px-4 sm:px-6 lg:px-8 w-max">
            {categoriesWithImages.map((category, index) => (
              <motion.div
                key={category.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/category/${category.id}`}
                  className="group relative block w-24 sm:w-32 md:w-40 lg:w-48 flex-shrink-0 aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                >
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 text-white">
                    <h3 className="font-semibold text-sm md:text-base mb-1">{category.name}</h3>
                    <p className="text-xs text-white/80">{category.productCount} products</p>
                  </div>
                </Link>
              </motion.div>
            ))}
            <div className="w-20 md:w-24 flex-shrink-0" />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
              Featured Plants
            </h2>
            <p className="text-xs md:text-base text-muted-foreground">
              {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 md:px-4 py-2 rounded-lg border border-input bg-input-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 md:px-4 py-2 rounded-lg border border-input bg-input-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="featured">Featured</option>
              <option value="bestsellers">Best Sellers</option>
              <option value="new">New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {displayProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products found in this category.</p>
          </div>
        )}
      </section>

      {/* Customer Reviews */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-muted/30 rounded-3xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground">
            Join thousands of happy plant parents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card p-6 rounded-2xl shadow-md"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <FloatingCart />
      <MobileBottomNav />
      <Footer />
    </div>
  );
}