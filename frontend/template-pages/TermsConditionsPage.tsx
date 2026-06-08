"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <div className="bg-muted/30 py-12 md:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground">Please read these terms carefully before using our service.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="prose prose-green max-w-none text-muted-foreground">
          <p className="mb-8">
            Welcome to HarYali. These terms and conditions outline the rules and regulations for the use of HarYali's Website, located at haryali.com.
          </p>
          
          <p className="mb-8">
            By accessing this website we assume you accept these terms and conditions. Do not continue to use HarYali if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">1. License</h2>
          <p>
            Unless otherwise stated, HarYali and/or its licensors own the intellectual property rights for all material on HarYali. All intellectual property rights are reserved. You may access this from HarYali for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p className="mb-6">You must not:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Republish material from HarYali</li>
            <li>Sell, rent or sub-license material from HarYali</li>
            <li>Reproduce, duplicate or copy material from HarYali</li>
            <li>Redistribute content from HarYali</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">2. Product Information and Imagery</h2>
          <p>
            We make every effort to display as accurately as possible the colors, features, specifications, and details of the plants available on our website. However, we do not guarantee that the colors, features, specifications, and details will be accurate, complete, reliable, current, or free of other errors. Because plants are living organisms, the actual plant delivered will vary slightly from the photographs displayed on our site.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">3. Pricing and Availability</h2>
          <p>
            All products are subject to availability. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change without notice. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the products.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">4. Delivery and Shipping</h2>
          <p>
            HarYali relies on third-party logistics partners for the delivery of products. While we try to ensure that deliveries are made within the estimated timeframes, we do not guarantee exact delivery times. We are not responsible for delays caused by the courier service or unforeseen circumstances.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">5. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>
        </div>
      </div>

      <MobileBottomNav />
      <Footer />
    </div>
  );
}
