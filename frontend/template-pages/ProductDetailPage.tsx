"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShoppingCart, Heart, Share2, Check, Truck, Shield, Package,
  Star, Droplets, Sun, Sprout, ArrowLeft, AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FloatingCart from '../components/FloatingCart';
import MobileBottomNav from '../components/MobileBottomNav';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import type { ApiProduct } from '../lib/api/products';

// ── Skeleton ─────────────────────────────────────────────────────────────────

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 animate-pulse">
      <div className="aspect-square rounded-2xl bg-muted" />
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-24" />
        <div className="h-10 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-12 bg-muted rounded w-32" />
        <div className="h-12 bg-muted rounded" />
        <div className="h-12 bg-muted rounded" />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id: slug } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, isHydrated } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'care'>('description');

  // ── API: fetch product by slug ─────────────────────────────────────────
  const { data: product, isLoading, isError } = useProduct(slug);

  // ── API: related products (same category, exclude current) ────────────
  const { data: allCategoryProducts = [] } = useProducts({
    category: product?.category?.slug,
    limit: 8,
  });
  const relatedProducts = (allCategoryProducts as ApiProduct[])
    .filter((p) => p.slug !== slug)
    .slice(0, 4);

  const inWishlist = isHydrated && !!product && isInWishlist(String(product.id));

  // Derive primary image
  const primaryImage = product?.images?.find((img) => img.isPrimary)?.imageUrl
    ?? product?.images?.[0]?.imageUrl
    ?? '';

  // Stock helpers
  const inStock = product
    ? product.stockStatus === 'in_stock' && product.stockAvailable > 0
    : false;

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product as any);
    }
    toast.success(`${quantity}× ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product as any);
    }
    router.push('/checkout');
  };

  const handleWishlist = () => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlist(String(product.id));
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product as any);
      toast.success('Added to wishlist!');
    }
  };

  // ── Error state ────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t find the product you&apos;re looking for.
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

  const categoryHref = product?.category?.slug
    ? `/category/${product.category.slug}`
    : '/#products';

  const comparePrice = product?.comparePrice ? Number(product.comparePrice) : undefined;
  const price = product ? Number(product.price) : 0;
  const discount = comparePrice && comparePrice > price
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : undefined;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          {product ? (
            <>
              <Link href={categoryHref} className="hover:text-primary transition-colors">
                {product.category?.name}
              </Link>
              <span>/</span>
              <span className="text-foreground line-clamp-1">{product.name}</span>
            </>
          ) : (
            <span className="inline-block w-40 h-4 bg-muted animate-pulse rounded" />
          )}
        </nav>

        {/* Loading skeleton */}
        {isLoading && <ProductDetailSkeleton />}

        {/* Product Details */}
        {!isLoading && product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">

            {/* Image Gallery */}
            <div className="space-y-4">
              <motion.div
                initial={false}
                animate={{ opacity: 1 }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
              >
                <ImageWithFallback
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {discount && (
                  <span className="absolute top-4 left-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-full font-semibold shadow-lg">
                    {discount}% OFF
                  </span>
                )}

                <button
                  onClick={handleWishlist}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`w-6 h-6 ${inWishlist ? 'fill-destructive text-destructive' : 'text-foreground'}`}
                  />
                </button>

                <button className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Share2 className="w-5 h-5" />
                </button>
              </motion.div>

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img, i) => (
                    <div
                      key={img.id ?? i}
                      className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border"
                    >
                      <ImageWithFallback
                        src={img.imageUrl}
                        alt={img.imageAlt || `${product.name} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <Link
                  href={categoryHref}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  {product.category?.name}
                </Link>
                {product.bestSeller && (
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded font-medium">
                    Best Seller
                  </span>
                )}
                {product.newArrival && (
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded font-medium">
                    New Arrival
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>

              <p className="text-muted-foreground mb-6">{product.shortDescription}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(Number(product.ratingAvg))
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {Number(product.ratingAvg).toFixed(1)} ({product.reviewsCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-primary">₹{price}</span>
                {comparePrice && comparePrice > price && (
                  <>
                    <span className="text-2xl text-muted-foreground line-through">₹{comparePrice}</span>
                    <span className="text-sm font-semibold text-green-600">
                      Save ₹{comparePrice - price}
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-8">
                {inStock ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-medium">
                      In Stock ({product.stockAvailable} left)
                    </span>
                  </>
                ) : (
                  <span className="text-destructive font-medium">Out of Stock</span>
                )}
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-muted/50 rounded-xl">
                {product.size && (
                  <div className="flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Size</p>
                      <p className="font-semibold text-sm">{product.size}</p>
                    </div>
                  </div>
                )}
                {product.wateringFrequency && (
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Watering</p>
                      <p className="font-semibold text-sm">{product.wateringFrequency}</p>
                    </div>
                  </div>
                )}
                {product.sunlightRequirement && (
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Sunlight</p>
                      <p className="font-semibold text-sm">{product.sunlightRequirement}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pot</p>
                    <p className="font-semibold text-sm">{product.potIncluded ? 'Included' : 'Not Included'}</p>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-8">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-md hover:bg-background transition-colors flex items-center justify-center text-lg font-medium"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockAvailable || 99, quantity + 1))}
                    className="w-10 h-10 rounded-md hover:bg-background transition-colors flex items-center justify-center text-lg font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="w-full py-4 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-primary/5 rounded-xl">
                <div className="text-center">
                  <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">Fast Delivery</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">Quality Guarantee</p>
                </div>
                <div className="text-center">
                  <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">Safe Packaging</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs: Description / Specs / Care */}
        {!isLoading && product && (
          <div className="mb-16">
            <div className="border-b border-border mb-6">
              <div className="flex gap-8">
                {(['description', 'specs', 'care'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-medium capitalize transition-colors border-b-2 -mb-px ${
                      activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab === 'description' ? 'Description' : tab === 'specs' ? 'Specifications' : 'Care Guide'}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'description' && (
              <div className="max-w-2xl">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-lg space-y-2 text-sm">
                {[
                  ['Plant Type', product.plantType],
                  ['Height', product.height],
                  ['Pot Size', product.potSize],
                  ['Location', product.location],
                  ['Maintenance', product.maintenanceLevel],
                  ['Pet Friendly', product.petFriendly ? 'Yes ✅' : 'No ❌'],
                  ['Watering', product.wateringFrequency],
                  ['Sunlight', product.sunlightRequirement],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label as string} className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'care' && (
              <div className="bg-muted/50 p-6 rounded-2xl max-w-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sprout className="w-6 h-6 text-primary" />
                  Plant Care Guide
                </h3>
                <div className="space-y-4 text-sm text-muted-foreground">
                  {product.wateringFrequency && (
                    <div className="flex gap-3">
                      <Droplets className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">Watering</p>
                        <p>{product.wateringFrequency}</p>
                      </div>
                    </div>
                  )}
                  {product.sunlightRequirement && (
                    <div className="flex gap-3">
                      <Sun className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">Sunlight</p>
                        <p>{product.sunlightRequirement}</p>
                      </div>
                    </div>
                  )}
                  {product.maintenanceLevel && (
                    <div className="flex gap-3">
                      <Sprout className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">Maintenance</p>
                        <p>Maintenance level: {product.maintenanceLevel}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium text-primary">
                    💡 Tip: Rotate your plant weekly for even growth and healthier leaves!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <FloatingCart />
      <MobileBottomNav />
      <Footer />
    </div>
  );
}