"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingCart, Heart, Menu, X, MapPin, User, LogOut, Package, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { useCategories } from '../hooks/useCategories';
import type { ApiCategory } from '../lib/api/categories';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { getCartCount, wishlist, isHydrated } = useCart();
  const { customer, isAuthenticated, logout } = useCustomerAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ✅ Dynamic categories from API
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    else router.push('/search');
    setMobileMenuOpen(false);
  };

  const isActive = (slug: string) => pathname === `/category/${slug}`;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm hidden md:block">
        <p>🌿 Free Delivery on Orders Above ₹999 | Fresh Plants Guaranteed</p>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div>
                <img src="/HarYali.png" alt="HarYali Logo" width="70" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-primary">HarYali</h1>
                <p className="text-xs text-muted-foreground">Bring Nature Home</p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for plants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-12 rounded-full border border-input bg-input-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </form>

            {/* Search Bar - Mobile */}
            <form onSubmit={handleSearch} className="flex md:hidden flex-1 max-w-xs mx-3">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search plants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pl-9 rounded-full border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              {/* Location */}
              <button className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm">Deliver to</span>
              </button>

              {/* Wishlist */}
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                {isHydrated && wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => router.push('/checkout')}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                {isHydrated && getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* User Profile */}
              <div ref={profileRef} className="relative hidden md:block">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        {customer?.name?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <span className="text-sm font-medium hidden lg:block max-w-20 truncate">{customer?.name?.split(' ')[0]}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </>
                  ) : (
                    <User className="w-5 h-5 text-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      {isAuthenticated ? (
                        <>
                          <div className="px-4 py-3 border-b border-border bg-muted/50">
                            <p className="font-semibold text-sm text-foreground truncate">{customer?.name}</p>
                            <p className="text-xs text-muted-foreground">{customer?.phone}</p>
                          </div>
                          <Link
                            href="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-sm"
                          >
                            <User className="w-4 h-4 text-muted-foreground" />
                            My Profile
                          </Link>
                          <Link
                            href="/profile?tab=orders"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-sm"
                          >
                            <Package className="w-4 h-4 text-muted-foreground" />
                            My Orders
                          </Link>
                          <button
                            onClick={() => { logout(); setProfileDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-destructive transition-colors text-sm border-t border-border"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-4 hover:bg-muted transition-colors"
                          >
                            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">Sign In</p>
                              <p className="text-xs text-muted-foreground">View orders & profile</p>
                            </div>
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation - Desktop - Dynamic Categories from API */}
          <nav className="hidden md:flex items-center gap-1 pb-3 overflow-x-auto scrollbar-hide scroll-smooth">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                pathname === '/'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-primary hover:text-primary-foreground bg-muted'
              }`}
            >
              All Plants
            </Link>

            {categoriesLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-muted animate-pulse w-20 h-6 inline-block"
                  />
                ))
              : (categories as ApiCategory[]).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive(cat.slug)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
          </nav>

          {/* Navigation - Mobile horizontal scroll */}
          <div className="md:hidden overflow-x-auto scrollbar-hide scroll-smooth">
            <nav className="flex items-center gap-2 pb-3">
              <Link
                href="/"
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  pathname === '/'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                All
              </Link>
              {(categories as ApiCategory[]).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    isActive(cat.slug)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-card shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-semibold">Browse Categories</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-muted"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`}
                  >
                    🌿 All Plants
                  </Link>

                  {categoriesLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
                      ))
                    : (categories as ApiCategory[]).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`px-4 py-3 rounded-lg transition-colors ${
                            isActive(cat.slug)
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {cat.name}
                        </Link>
                      ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-border space-y-1">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 mb-1">
                        <p className="font-semibold text-sm">{customer?.name}</p>
                        <p className="text-xs text-muted-foreground">{customer?.phone}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <User className="w-5 h-5" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Package className="w-5 h-5" />
                        <span>My Orders</span>
                      </Link>
                      <button
                        onClick={() => { logout(); setMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-destructive transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>Login / Sign Up</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
