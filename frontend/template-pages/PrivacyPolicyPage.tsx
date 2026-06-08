"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <div className="bg-muted/30 py-12 md:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last Updated: June 8, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="prose prose-green max-w-none text-muted-foreground">
          <p className="lead text-lg text-foreground mb-8">
            At HarYali, accessible from haryali.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by HarYali and how we use it.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">1. Information We Collect</h2>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li><strong>Personal Identification Information:</strong> Name, email address, phone number, shipping address.</li>
            <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely through our payment gateways).</li>
            <li><strong>Log Data:</strong> IP address, browser type, pages visited, time and date of visit.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect in various ways, including to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Provide, operate, and maintain our website and process orders.</li>
            <li>Improve, personalize, and expand our website.</li>
            <li>Understand and analyze how you use our website.</li>
            <li>Develop new products, services, features, and functionality.</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
            <li>Send you emails and track orders.</li>
            <li>Find and prevent fraud.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">3. Log Files</h2>
          <p>
            HarYali follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">4. Cookies and Web Beacons</h2>
          <p>
            Like any other website, HarYali uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">5. Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>privacy@haryali.com</strong>.
          </p>
        </div>
      </div>

      <MobileBottomNav />
      <Footer />
    </div>
  );
}
