"use client";

import { Star, Quote } from "lucide-react";
import { motion } from "motion/react";
import { reviews } from "../data/mockData";
import { Card, CardContent } from "./ui/card";

export function ReviewsSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say 🌟
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy plant parents who trust us for their green companions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating
                          ? "fill-warning-amber text-warning-amber"
                          : "text-muted"
                          }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                    {review.comment}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.name}</p>
                      <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                        {new Date(review.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-8 bg-muted/50 rounded-full px-8 py-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-5 w-5 fill-warning-amber text-warning-amber" />
                <span className="font-bold text-2xl">4.8</span>
              </div>
              <p className="text-xs text-muted-foreground">Average Rating</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="font-bold text-2xl mb-1">5000+</p>
              <p className="text-xs text-muted-foreground">Happy Customers</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="font-bold text-2xl mb-1">10,000+</p>
              <p className="text-xs text-muted-foreground">Plants Delivered</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
