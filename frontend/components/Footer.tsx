"use client";

import React from 'react';
import Link from 'next/link';
import { Leaf, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary">HarYali</h3>
                <p className="text-xs text-muted-foreground">Bring Nature Home</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted partner for premium quality plants delivered fresh to your doorstep. We bring nature closer to you.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="text-muted-foreground hover:text-primary transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/#bestsellers" className="text-muted-foreground hover:text-primary transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/#offers" className="text-muted-foreground hover:text-primary transition-colors">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  123 Green Street, Plant District, Mumbai, Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+911234567890" className="text-muted-foreground hover:text-primary transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:support@haryali.com" className="text-muted-foreground hover:text-primary transition-colors">
                  support@haryali.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-sm">Newsletter</h4>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🌱</span>
            </div>
            <div>
              <p className="font-semibold text-sm">Healthy Plants</p>
              <p className="text-xs text-muted-foreground">Guaranteed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🚚</span>
            </div>
            <div>
              <p className="font-semibold text-sm">Fast Delivery</p>
              <p className="text-xs text-muted-foreground">Across India</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🔒</span>
            </div>
            <div>
              <p className="font-semibold text-sm">Secure Payment</p>
              <p className="text-xs text-muted-foreground">100% Safe</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <p className="font-semibold text-sm">Fresh Packaging</p>
              <p className="text-xs text-muted-foreground">Premium Care</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            © {new Date().getFullYear()} HarYali. All rights reserved. | Crafted with 💚 for Plant Lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
