"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, ArrowLeft, Truck } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderId as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${orderNumber}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <button onClick={() => router.push('/')} className="text-primary underline">Return to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-16 flex justify-center">
      <div className="container max-w-3xl px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-3xl p-8 text-center shadow-lg border border-border"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Thank you for your order!</h1>
          <p className="text-muted-foreground mb-8">Your order has been placed successfully and is being processed.</p>
          
          <div className="bg-muted rounded-xl p-6 mb-8 text-left grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-muted-foreground font-medium mb-1">Order Number</h3>
              <p className="font-bold text-lg">{order.orderNumber}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground font-medium mb-1">Total Amount</h3>
              <p className="font-bold text-lg text-primary">₹{order.totalAmount}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground font-medium mb-1">Payment Method</h3>
              <p className="font-semibold">{order.paymentMethod}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground font-medium mb-1">Delivery Address</h3>
              <p className="text-sm line-clamp-2">{order.deliveryAddressText}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/track?order=${order.orderNumber}`}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              <Truck className="w-5 h-5" />
              Track Order
            </Link>
            <Link 
              href="/products"
              className="flex items-center justify-center gap-2 py-3 px-6 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
