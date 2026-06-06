"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Share2, Check, Truck, Shield, Package, Star, Droplets, Sun, Sprout } from 'lucide-react';
import { motion } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FloatingCart from '../components/FloatingCart';
import MobileBottomNav from '../components/MobileBottomNav';
import { products as allProducts } from '../data/products';
import { productImages } from '../data/imageMapping';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Find product and add images
  const product = allProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Link href="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const productWithImage = {
    ...product,
    image: productImages[product.id as keyof typeof productImages],
  };

  const inWishlist = isInWishlist(product.id);

  // Related products (same category, excluding current)
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)
    .map(p => ({
      ...p,
      image: productImages[p.id as keyof typeof productImages],
    }));

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(productWithImage);
    }
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(productWithImage);
    }
    router.push('/checkout');
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(productWithImage);
      toast.success('Added to wishlist!');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/#products" className="hover:text-primary">{product.category}</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
            >
              <ImageWithFallback
                src={productWithImage.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.discount && (
                <span className="absolute top-4 left-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-full font-semibold shadow-lg">
                  {product.discount}% OFF
                </span>
              )}

              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Heart
                  className={`w-6 h-6 ${inWishlist ? 'fill-destructive text-destructive' : 'text-foreground'
                    }`}
                />
              </button>

              <button className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Share2 className="w-5 h-5" />
              </button>
            </motion.div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="text-sm text-primary font-medium">{product.category}</span>
              {product.bestSeller && (
                <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                  Best Seller
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>

            <p className="text-muted-foreground mb-6">{product.shortDescription}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(150 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-primary">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-8">
              {product.inStock ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">In Stock</span>
                </>
              ) : (
                <span className="text-destructive font-medium">Out of Stock</span>
              )}
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Size</p>
                  <p className="font-semibold">{product.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Watering</p>
                  <p className="font-semibold">{product.specifications.wateringFrequency}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Sunlight</p>
                  <p className="font-semibold">{product.specifications.sunlightRequirement}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Pot</p>
                  <p className="font-semibold">{product.potIncluded ? 'Included' : 'Not Included'}</p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-md hover:bg-background transition-colors flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-md hover:bg-background transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-semibold"
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

        {/* Product Details Tabs */}
        <div className="mb-16">
          <div className="border-b border-border mb-6">
            <div className="flex gap-8">
              <button className="pb-4 border-b-2 border-primary font-semibold">Description</button>
              <button className="pb-4 text-muted-foreground hover:text-foreground">Specifications</button>
              <button className="pb-4 text-muted-foreground hover:text-foreground">Care Guide</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold mb-4">About This Plant</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

              <h4 className="font-semibold mb-3">Specifications</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Plant Type</span>
                  <span className="font-medium">{product.specifications.plantType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Height</span>
                  <span className="font-medium">{product.specifications.height}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Pot Size</span>
                  <span className="font-medium">{product.specifications.potSize}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{product.specifications.location}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Maintenance</span>
                  <span className="font-medium">{product.specifications.maintenanceLevel}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Pet Friendly</span>
                  <span className="font-medium">{product.specifications.petFriendly ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Care Guide */}
            <div className="bg-muted/50 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sprout className="w-6 h-6 text-primary" />
                Plant Care Guide
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Watering</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{product.careGuide.watering}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Sunlight</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{product.careGuide.sunlight}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Maintenance</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{product.careGuide.maintenance}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium text-primary">
                  💡 Tip: Rotate your plant weekly for even growth and healthier leaves!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
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