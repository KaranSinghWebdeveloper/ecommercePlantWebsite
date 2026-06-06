"use client";

import { Shield, Truck, CreditCard, Award, Leaf, PackageCheck } from "lucide-react";
import { motion } from "motion/react";

const badges = [
  {
    icon: Leaf,
    title: "Healthy Plants",
    description: "100% quality guarantee",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Within 2-5 business days",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Multiple payment options",
  },
  {
    icon: PackageCheck,
    title: "Fresh Packaging",
    description: "Eco-friendly materials",
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "Expert plant selection",
  },
  {
    icon: CreditCard,
    title: "Easy Returns",
    description: "7-day return policy",
  },
];

export function TrustBadges() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-4 bg-card rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm mb-1">{badge.title}</h4>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
