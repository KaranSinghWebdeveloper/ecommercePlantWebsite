"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const SCROLL_THRESHOLD = 10;

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { getCartCount, isHydrated } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= SCROLL_THRESHOLD) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + SCROLL_THRESHOLD) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - SCROLL_THRESHOLD) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/#products', icon: Search, label: 'Explore' },
    { path: '/checkout', icon: ShoppingCart, label: 'Cart', badge: isHydrated ? getCartCount() : 0 },
    { path: '/admin', icon: User, label: 'Account' },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border md:hidden transform transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-1 relative transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
