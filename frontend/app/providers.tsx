"use client";

import { Toaster } from "sonner";
import { MotionConfig } from "motion/react";
import { CartProvider } from "../context/CartContext";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import { CustomerAuthProvider } from "../context/CustomerAuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig initial={false}>
        <AdminAuthProvider>
          <CustomerAuthProvider>
            <CartProvider>
              {children}
              <Toaster position="top-right" richColors />
            </CartProvider>
          </CustomerAuthProvider>
        </AdminAuthProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
