"use client";

import { Toaster } from "sonner";
import { MotionConfig } from "motion/react";
import { CartProvider } from "../context/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig initial={false}>
      <CartProvider>
        {children}
        <Toaster position="top-right" richColors />
      </CartProvider>
    </MotionConfig>
  );
}
