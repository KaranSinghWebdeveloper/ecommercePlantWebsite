"use client";

import Image from 'next/image';
import { motion } from "motion/react";
import { Category } from "../data/types";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl aspect-square">
        {/* Image */}
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 25vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
          <h3 className="text-white font-semibold text-lg md:text-xl mb-1">
            {category.name}
          </h3>
          <p className="text-white/80 text-sm mb-3">
            {category.productCount} products
          </p>
          <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm">Shop Now</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-2xl transition-all" />
      </div>
    </motion.div>
  );
}
