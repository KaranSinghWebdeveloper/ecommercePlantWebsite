"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Heart, Menu, MapPin, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Badge } from "./ui/badge";
import { useCart } from "../context/CartContext";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getTotalItems } = useCart();

  const categories = [
    "Indoor Plants",
    "Outdoor Plants",
    "Small Plants",
    "Large Plants",
    "Flowering Plants",
    "Air Purifying",
    "Bonsai",
    "Pots & Accessories",
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Top Bar */}
      <div className="hidden md:block bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Free Delivery on Orders Above ₹999</span>
          </div>
          <div className="flex items-center gap-6">
            <span>📞 1800-XXX-XXXX</span>
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-3xl">🌿</div>
            <div className="hidden md:block">
              <h1 className="font-bold text-xl text-primary">GreenLife</h1>
              <p className="text-xs text-muted-foreground">Plant Paradise</p>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search plants, pots, accessories..."
                className="pl-10 bg-muted/50 border-0"
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
            </Button>
            <Link href="/checkout">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 py-6">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="text-2xl">🌿</div>
                    <h2 className="font-bold text-lg text-primary">GreenLife</h2>
                  </Link>
                  <nav className="flex flex-col gap-3">
                    <Link href="/" className="text-base hover:text-primary">
                      Home
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category}
                        href={`/?category=${category}`}
                        className="text-base hover:text-primary"
                      >
                        {category}
                      </Link>
                    ))}
                    <Link href="/checkout" className="text-base hover:text-primary flex items-center gap-2">
                      Cart
                      {getTotalItems() > 0 && (
                        <Badge className="bg-primary">{getTotalItems()}</Badge>
                      )}
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search plants..."
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>
        )}

        {/* Desktop Category Menu */}
        <nav className="hidden lg:flex items-center gap-6 mt-4 pt-4 border-t">
          <Link href="/" className="text-sm hover:text-primary transition-colors">
            All Plants
          </Link>
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category}
              href={`/?category=${category}`}
              className="text-sm hover:text-primary transition-colors whitespace-nowrap"
            >
              {category}
            </Link>
          ))}
          <Link
            href="/?offers=true"
            className="text-sm text-destructive hover:text-destructive/80 transition-colors"
          >
            🔥 Offers
          </Link>
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
        <div className="flex items-center justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-1">
            <div className="text-xl">🏠</div>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/?category=all" className="flex flex-col items-center gap-1">
            <div className="text-xl">🌱</div>
            <span className="text-xs">Plants</span>
          </Link>
          <Link href="/checkout" className="flex flex-col items-center gap-1 relative">
            <ShoppingCart className="h-5 w-5" />
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-1 right-2 h-4 w-4 flex items-center justify-center p-0 text-xs bg-primary">
                {getTotalItems()}
              </Badge>
            )}
            <span className="text-xs">Cart</span>
          </Link>
          <button className="flex flex-col items-center gap-1">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
}
