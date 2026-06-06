"use client";

import { Toaster } from "sonner";
import { CartProvider } from "../context/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster position="top-right" richColors />
    </CartProvider>
  );
}
