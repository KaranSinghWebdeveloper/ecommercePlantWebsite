"use client";

import React from 'react';
import { motion } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { Sprout, Heart, Globe, Leaf } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const values = [
  {
    icon: <Sprout className="w-8 h-8 text-primary" />,
    title: "Quality First",
    description: "Every plant is hand-selected and nurtured to ensure it thrives in your home."
  },
  {
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: "Customer Love",
    description: "We provide lifetime plant care support because we care about your green journey."
  },
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: "Sustainability",
    description: "From eco-friendly packaging to sustainable farming practices, we protect our planet."
  },
  {
    icon: <Leaf className="w-8 h-8 text-primary" />,
    title: "Make Every House HarYali",
    description: "Our core mission: bringing the joy and health benefits of greenery to every doorstep."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMG51cnNlcnl8ZW58MXx8fHwxNzgwNTk2NzIyfDA&ixlib=rb-4.0.3&q=80&w=1920" 
            alt="HarYali greenhouse" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Our Mission: Make Every House <span className="text-primary">HarYali</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/90"
          >
            We believe that life is simply better with plants. Our goal is to make plant parenting easy, accessible, and joyful for everyone.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                HarYali started with a simple observation: bringing nature indoors profoundly impacts our well-being, creativity, and peace of mind. But finding healthy, beautiful plants and learning how to care for them can be intimidating.
              </p>
              <p>
                We set out to change that. By partnering with the best local growers and creating comprehensive, easy-to-follow care guides, we have built a platform where anyone—regardless of their gardening experience—can cultivate their own indoor jungle.
              </p>
              <p>
                Today, HarYali delivers thousands of plants across the country, turning bare corners into lush, living spaces.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1604762512697-b648ee2b20fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHNob3B8ZW58MXx8fHwxNzgwNTk2NzU5fDA&ixlib=rb-4.0.3&q=80&w=1080"
              alt="HarYali founder arranging plants"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from sourcing our plants to packaging them for delivery.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MobileBottomNav />
      <Footer />
    </div>
  );
}
