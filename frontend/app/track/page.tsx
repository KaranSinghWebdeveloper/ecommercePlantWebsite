"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams?.get('order') || '';
  
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async (numberToFetch: string) => {
    if (!numberToFetch) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${numberToFetch}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        toast.error('Order not found. Please check your order number.');
        setOrder(null);
      }
    } catch (err) {
      toast.error('Error fetching order details.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderNumber);
  };

  const statusMap: Record<string, { label: string, icon: any, color: string }> = {
    pending: { label: 'Order Placed', icon: Clock, color: 'text-yellow-500' },
    confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-500' },
    packed: { label: 'Packed', icon: Package, color: 'text-purple-500' },
    out_for_delivery: { label: 'Out for Delivery', icon: Truck, color: 'text-orange-500' },
    delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-500' },
    cancelled: { label: 'Cancelled', icon: CheckCircle, color: 'text-red-500' },
  };

  const statusOrder = ['pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered'];

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-16">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>

        {/* Search Box */}
        <div className="max-w-xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter Order Number (e.g. PLANT-...)"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-input bg-card shadow-sm"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !orderNumber}
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Track
            </button>
          </form>
        </div>

        {/* Results */}
        {loading && <div className="text-center text-muted-foreground">Searching...</div>}

        {!loading && order && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 md:p-10 shadow-sm border border-border"
          >
            <div className="flex flex-col md:flex-row justify-between mb-8 pb-8 border-b border-border gap-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Order {order.orderNumber}</h2>
                <p className="text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-xl font-bold text-primary">₹{order.totalAmount}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative mb-12">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
              
              <div className="space-y-8 relative">
                {order.statusLogs?.map((log: any, index: number) => {
                  const sMap = statusMap[log.newStatus] || statusMap.pending;
                  const Icon = sMap.icon;
                  return (
                    <div key={log.id} className={`flex items-center flex-col md:flex-row gap-4 md:gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="flex-1 text-left md:text-right w-full pl-16 md:pl-0">
                        {index % 2 === 0 ? (
                          <>
                            <h4 className="font-bold text-lg">{sMap.label}</h4>
                            <p className="text-sm text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</p>
                            {log.note && <p className="text-sm mt-1">{log.note}</p>}
                          </>
                        ) : (
                          <div className="md:text-left">
                            <h4 className="font-bold text-lg">{sMap.label}</h4>
                            <p className="text-sm text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</p>
                            {log.note && <p className="text-sm mt-1">{log.note}</p>}
                          </div>
                        )}
                      </div>
                      <div className={`w-16 h-16 rounded-full bg-card border-4 border-background flex items-center justify-center shadow-lg relative z-10 ${sMap.color}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1 hidden md:block" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-bold text-lg mb-4">Items in this order</h3>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-muted/50">
                    <div className="w-16 h-16 rounded-lg bg-card overflow-hidden">
                      {item.productImage && <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{item.productName}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">₹{item.totalPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
