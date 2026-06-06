"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/product/${product.id}`} className="block group">
        <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border">
          {/* Image Container */}
          <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-muted">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.discount && (
                <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full shadow-lg">
                  {product.discount}% OFF
                </span>
              )}
              {product.bestSeller && (
                <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full shadow-lg">
                  Best Seller
                </span>
              )}
              {product.newArrival && (
                <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full shadow-lg">
                  New
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <Heart
                className={`w-5 h-5 ${inWishlist ? 'fill-destructive text-destructive' : 'text-foreground'
                  }`}
              />
            </button>

            {/* Quick Actions - Appear on Hover */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors font-semibold"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4">
            {/* Category */}
            <p className="text-xs text-muted-foreground mb-1">{product.category}</p>

            {/* Name */}
            <h3 className="font-semibold text-sm md:text-base text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {product.shortDescription}
            </p>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base md:text-lg font-bold text-primary">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              {product.inStock ? (
                <span className="text-xs text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-xs text-destructive font-medium">Out of Stock</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export { ProductCard };
