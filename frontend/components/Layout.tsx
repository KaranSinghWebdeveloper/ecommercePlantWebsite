"use client";

import { Navbar } from "./Navbar";
import Footer from "./Footer";
import FloatingCart from "./FloatingCart";
import { CartProvider } from "../context/CartContext";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingCart />
      </div>
    </CartProvider>
  );
}
