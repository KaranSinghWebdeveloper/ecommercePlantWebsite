"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useCart } from '../../context/CartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { ShoppingCart, Truck, CreditCard, ChevronRight, User, Mail, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { customer, isAuthenticated, isLoading: authLoading, sendOtp, verifyOtp, token } = useCustomerAuth();
  const router = useRouter();

  const [authStep, setAuthStep] = useState<'AUTH' | 'CHECKOUT'>('AUTH');
  const [authEmail, setAuthEmail] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    customerNote: ''
  });

  const [summary, setSummary] = useState({
    subtotal: 0,
    deliveryCharge: 0,
    totalAmount: 0,
    message: '',
    freeDeliveryApplied: false
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (cart.length === 0 && !loading && !isProcessingPayment) {
      router.push('/');
    }
  }, [cart, router, loading, isProcessingPayment]);

  // Handle Authentication state
  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated && customer) {
        setAuthStep('CHECKOUT');
        setFormData(prev => ({
          ...prev,
          name: prev.name || customer.name || '',
          email: prev.email || customer.email || '',
          phone: prev.phone || customer.phone || ''
        }));
      } else {
        setAuthStep('AUTH');
      }
    }
  }, [isAuthenticated, customer, authLoading]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    setAuthInProgress(true);
    try {
      await sendOtp(authEmail);
      setOtpSent(true);
      toast.success('OTP sent to your email');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setAuthInProgress(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authOtp) return;
    setAuthInProgress(true);
    try {
      await verifyOtp(authEmail, authOtp);
      toast.success('Successfully verified!');
      // Auth context effect will switch step to CHECKOUT
    } catch (err: any) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setAuthInProgress(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchSummary = async () => {
      setCalculating(true);
      try {
        const sessionId = window.localStorage.getItem('plantShopSessionId');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/checkout/summary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId || '' },
          body: JSON.stringify({ pincode: formData.pincode })
        });
        const data = await res.json();
        if (data.success) {
          setSummary(data.data);
        } else if (formData.pincode.length === 6) {
          toast.error(data.message || 'Delivery not available for this pincode');
          setSummary(prev => ({ ...prev, deliveryCharge: 0, message: 'Invalid Pincode' }));
        }
      } catch (err) {
        console.error('Failed to get summary', err);
      } finally {
        setCalculating(false);
      }
    };

    if (formData.pincode.length === 6 || formData.pincode === '') {
      fetchSummary();
    }
  }, [formData.pincode, cart]);

  const initializeRazorpay = (order: any, rzpOrder: any) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: rzpOrder.amount,
      currency: "INR",
      name: "HarYali Plants",
      description: "Order Payment",
      order_id: rzpOrder.id,
      handler: async function (response: any) {
        try {
          const sessionId = window.localStorage.getItem('plantShopSessionId');
          const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/verify-payment`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-session-id': sessionId || ''
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success('Payment successful!');
            clearCart();
            router.push('/');
          } else {
            toast.error('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          toast.error('Payment verification error.');
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      },
      theme: { color: "#22c55e" },
      modal: {
        ondismiss: function() {
          setLoading(false);
          setIsProcessingPayment(false);
        }
      }
    };
    const rzp = new (window as any).Razorpay(options);
    
    rzp.on('payment.failed', function (response: any) {
      toast.error('Payment Failed: ' + response.error.description);
      setLoading(false);
      setIsProcessingPayment(false);
    });

    rzp.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const sessionId = window.localStorage.getItem('plantShopSessionId');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'x-session-id': sessionId || '',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
          customerNote: formData.customerNote,
          paymentMethod
        })
      });

      const data = await res.json();
      if (data.success) {
        const { order, rzpOrder } = data.data;

        if (paymentMethod === 'ONLINE' && rzpOrder) {
          setIsProcessingPayment(true);
          initializeRazorpay(order, rzpOrder);
        } else {
          toast.success('Order placed successfully!');
          clearCart();
          router.push('/');
        }
      } else {
        toast.error(data.message || 'Failed to place order');
        setLoading(false);
      }
    } catch (err) {
      toast.error('An error occurred while placing the order');
      console.error(err);
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // AUTHENTICATION STEP
  if (authStep === 'AUTH') {
    return (
      <div className="min-h-screen bg-muted/30 pt-24 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-8 shadow-lg border border-border"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-center mb-8 text-sm">
              Please verify your identity to proceed with the checkout.
            </p>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input 
                      type="email" 
                      required 
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary" 
                      placeholder="you@example.com" 
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={authInProgress}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {authInProgress ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium">{authEmail}</span>
                  <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-primary hover:underline font-semibold">Change</button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Enter OTP</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input 
                      type="text" 
                      required 
                      value={authOtp}
                      onChange={(e) => setAuthOtp(e.target.value)}
                      maxLength={6}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary text-center tracking-[0.5em] font-mono text-lg" 
                      placeholder="------" 
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={authInProgress || authOtp.length < 6}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {authInProgress ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // CHECKOUT STEP
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-muted/30 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <User className="w-4 h-4" />
              <span>{customer?.name || customer?.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-input bg-background" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number *</label>
                    <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full px-4 py-2 rounded-lg border border-input bg-background" placeholder="+91 98765 43210" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Email Address (Optional)</label>
                    <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-4 py-2 rounded-lg border border-input bg-background" placeholder="john@example.com" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</span>
                  Delivery Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
                    <input required name="addressLine1" value={formData.addressLine1} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-input bg-background" placeholder="House/Flat No., Building Name" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address Line 2</label>
                    <input name="addressLine2" value={formData.addressLine2} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-input bg-background" placeholder="Street, Area" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pincode *</label>
                    <input required name="pincode" value={formData.pincode} onChange={handleChange} type="text" maxLength={6} className="w-full px-4 py-2 rounded-lg border border-input bg-background" placeholder="110001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input required name="city" value={formData.city} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-input bg-background" placeholder="New Delhi" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State *</label>
                    <input required name="state" value={formData.state} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-input bg-background" placeholder="Delhi" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Landmark</label>
                    <input name="landmark" value={formData.landmark} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-input bg-background" placeholder="Near Apollo Hospital" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Delivery Instructions (Optional)</label>
                    <textarea name="customerNote" value={formData.customerNote} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-input bg-background" placeholder="E.g., Leave with security guard" rows={2}></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</span>
                  Payment Method
                </h2>
                
                <div className="space-y-4">
                  <label onClick={() => setPaymentMethod('ONLINE')} className={`block p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                        {paymentMethod === 'ONLINE' && <div className="w-2 h-2 bg-current rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4" /> Pay Online</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">Recommended</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Pay securely via UPI, Credit/Debit Card, or Netbanking using Razorpay</p>
                      </div>
                    </div>
                  </label>

                  <label onClick={() => setPaymentMethod('COD')} className={`block p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                        {paymentMethod === 'COD' && <div className="w-2 h-2 bg-current rounded-full" />}
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center gap-2"><Truck className="w-4 h-4" /> Cash on Delivery (COD)</h3>
                        <p className="text-sm text-muted-foreground mt-1">Pay when your order arrives</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{summary.subtotal || getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    {calculating ? (
                      <span className="text-muted-foreground animate-pulse">Calculating...</span>
                    ) : summary.freeDeliveryApplied ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      <span>₹{summary.deliveryCharge}</span>
                    )}
                  </div>
                  {summary.message && (
                    <p className={`text-xs ${summary.freeDeliveryApplied ? 'text-green-600' : 'text-primary'}`}>
                      {summary.message}
                    </p>
                  )}
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl text-primary">₹{summary.totalAmount || getCartTotal()}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || calculating || (!summary.freeDeliveryApplied && summary.deliveryCharge === 0 && formData.pincode.length === 6)}
                  className="w-full mt-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : (paymentMethod === 'ONLINE' ? 'Pay Securely' : 'Place Order via COD')}
                  {!loading && <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
