"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <div className="bg-muted/30 py-12 md:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Refund & Replacement Policy</h1>
          <p className="text-muted-foreground">We want you to be 100% happy with your plants.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="prose prose-green max-w-none text-muted-foreground">
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">7-Day Plant Guarantee</h2>
          <p>
            Plants are living things and shipping can be stressful for them. It is normal for a plant to lose a leaf or look slightly wilted upon arrival. However, if your plant arrives dead or severely damaged, we offer a <strong>7-Day Replacement Guarantee</strong>.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">How to claim a replacement:</h3>
          <ol className="list-decimal pl-6 space-y-2 mb-6">
            <li>Take clear photos of the damaged plant, including the packaging it arrived in.</li>
            <li>Email the photos along with your Order ID to <strong>support@haryali.com</strong> within 7 days of delivery.</li>
            <li>Our team will review your claim and dispatch a healthy replacement plant at no additional cost to you.</li>
          </ol>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 my-8">
            <h4 className="font-bold text-foreground mb-2">Important Note on Plant Appearance</h4>
            <p className="text-sm">
              Because plants are living entities, the plant you receive may differ slightly in size, shape, and color from the photos on our website. Minor cosmetic damage (like a torn leaf or slight yellowing) is not considered severe damage and is a normal part of shipping.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Returns for Non-Plant Items</h2>
          <p>
            For accessories, pots, tools, and fertilizers, we accept returns within <strong>14 days</strong> of delivery.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Items must be unused, in their original packaging, and in the same condition that you received them.</li>
            <li>To initiate a return, please contact our support team.</li>
            <li>Return shipping costs are the responsibility of the customer unless the item arrived defective.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Refund Process</h2>
          <p>
            Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
          </p>
          <p>
            If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 5-7 business days.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Cancellations</h2>
          <p>
            Orders can be cancelled for a full refund within <strong>12 hours</strong> of placing the order, provided the order has not yet been dispatched. Once dispatched, orders cannot be cancelled.
          </p>
        </div>
      </div>

      <MobileBottomNav />
      <Footer />
    </div>
  );
}
