"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "We process orders within 24 hours. Standard delivery takes 3-5 business days across India. For metro cities, we often deliver within 48 hours."
      },
      {
        q: "How are the plants packaged?",
        a: "Plants are carefully packaged in specially designed ventilated boxes. We use eco-friendly materials that keep the soil in place and protect the foliage during transit."
      },
      {
        q: "Can I track my order?",
        a: "Yes! Once your order is dispatched, you will receive an email and SMS with the tracking link and courier details."
      }
    ]
  },
  {
    category: "Plant Care",
    items: [
      {
        q: "My plant arrived looking droopy. Is it dying?",
        a: "Not necessarily! Plants can experience 'transit shock'. Give it some water (if the soil is dry), place it in appropriate light, and let it rest for a few days. It should bounce back."
      },
      {
        q: "How often should I water my new plant?",
        a: "Watering depends on the plant species. Please refer to the specific care instructions included in the box or on the product page. Always check the top inch of soil before watering."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What if my plant arrives damaged?",
        a: "We offer a 7-day plant replacement guarantee. If your plant arrives severely damaged, please take a photo and contact us within 24 hours of delivery. We will send a free replacement."
      },
      {
        q: "Can I return a plant if I change my mind?",
        a: "Because plants are living perishable items, we do not accept returns for change of mind. However, non-plant items (pots, tools) can be returned within 14 days in unused condition."
      }
    ]
  }
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      {/* Page Header */}
      <div className="bg-primary/5 py-16 md:py-20 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <MessageCircleQuestion className="w-12 h-12 text-primary mx-auto mb-4" />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Find answers to common questions about orders, shipping, plant care, and more.
          </motion.p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="space-y-12">
          {faqs.map((category, catIndex) => (
            <div key={category.category}>
              <h2 className="text-2xl font-bold mb-6 text-foreground">{category.category}</h2>
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const id = `${catIndex}-${itemIndex}`;
                  const isOpen = openIndex === id;
                  
                  return (
                    <motion.div 
                      key={id}
                      initial={false}
                      className="border border-border rounded-xl overflow-hidden bg-card"
                    >
                      <button
                        onClick={() => toggleAccordion(id)}
                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                        aria-expanded={isOpen}
                      >
                        <span className="font-medium text-lg pr-4">{item.q}</span>
                        <ChevronDown 
                          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="p-5 pt-0 text-muted-foreground leading-relaxed border-t border-border/50">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Still need help? */}
        <div className="mt-16 bg-muted/30 rounded-2xl p-8 text-center border border-border">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">If you couldn't find the answer you're looking for, our plant experts are here to help.</p>
          <a 
            href="/contact" 
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>

      <MobileBottomNav />
      <Footer />
    </div>
  );
}
