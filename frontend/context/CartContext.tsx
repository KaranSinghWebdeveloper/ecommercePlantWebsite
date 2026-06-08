"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem as LocalCartItem } from '../data/products';
import { v4 as uuidv4 } from 'uuid';
import apiClient from '../lib/api/client'; // or use fetch directly

// Extend for backend cart item format
export interface CartItem {
  id: string | number; // Backend uses number for cartItemId
  productId: string | number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string | null;
  stockStatus: string;
  stockAvailable: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  isHydrated: boolean;
  addToCart: (product: any, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getCartTotal: () => number;
  getCartCount: () => number;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Setup Session ID
  useEffect(() => {
    let storedSessionId = window.localStorage.getItem('plantShopSessionId');
    if (!storedSessionId) {
      // Basic random UUID if uuid library not available
      storedSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      window.localStorage.setItem('plantShopSessionId', storedSessionId);
    }
    setSessionId(storedSessionId);

    // Load wishlist
    const savedWishlist = window.localStorage.getItem('plantShopWishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch {
        window.localStorage.removeItem('plantShopWishlist');
      }
    }
    
    setIsHydrated(true);
  }, []);

  // Fetch Cart from Backend
  useEffect(() => {
    if (!sessionId) return;
    
    const fetchCart = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cart`, {
          headers: { 'x-session-id': sessionId }
        });
        const data = await res.json();
        if (data.success && data.data?.items) {
          setCart(data.data.items);
        }
      } catch (err) {
        console.error('Failed to fetch cart', err);
      }
    };
    fetchCart();
  }, [sessionId]);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem('plantShopWishlist', JSON.stringify(wishlist));
  }, [wishlist, isHydrated]);

  const addToCart = async (product: any, quantity: number = 1) => {
    if (!sessionId) return;
    try {
      // Optimistic update omitted for simplicity, relying on backend return
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId },
        body: JSON.stringify({ productId: parseInt(product.id, 10) || product.id, quantity })
      });
      const data = await res.json();
      if (data.success && data.data?.items) {
        setCart(data.data.items);
      }
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (!sessionId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cart/item/${cartItemId}`, {
        method: 'DELETE',
        headers: { 'x-session-id': sessionId }
      });
      const data = await res.json();
      if (data.success && data.data?.items) {
        setCart(data.data.items);
      } else {
        // Fallback clear
        setCart(prev => prev.filter(i => i.id !== cartItemId));
      }
    } catch (err) {
      console.error('Failed to remove from cart', err);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!sessionId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cart/item/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId },
        body: JSON.stringify({ quantity })
      });
      const data = await res.json();
      if (data.success && data.data?.items) {
        setCart(data.data.items);
      }
    } catch (err) {
      console.error('Failed to update cart', err);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isHydrated,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getCartTotal,
        getCartCount,
        getTotalPrice: getCartTotal,
        getTotalItems: getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

