const Joi = require('joi');

const getProductsSchema = Joi.object({
  q: Joi.string().allow('', null).optional(), // Search query
  category: Joi.string().allow('', null).optional(), // Category slug or comma-separated
  
  // Price
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  
  // Stock
  stock: Joi.string().valid('in_stock', 'low_stock', 'out_of_stock').optional(),
  
  // Attributes
  size: Joi.string().optional(),
  location: Joi.string().optional(),
  plantType: Joi.string().optional(),
  maintenanceLevel: Joi.string().optional(),
  sunlightRequirement: Joi.string().optional(),
  wateringFrequency: Joi.string().optional(),
  
  // Booleans
  petFriendly: Joi.boolean().optional(),
  potIncluded: Joi.boolean().optional(),
  
  // Badges
  featured: Joi.boolean().optional(),
  bestSeller: Joi.boolean().optional(),
  newArrival: Joi.boolean().optional(),
  discounted: Joi.boolean().optional(),
  
  // Rating
  minRating: Joi.number().min(0).max(5).optional(),
  
  // Pagination
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  
  // Sorting
  sort: Joi.string().valid(
    'featured', 'newest', 'price_asc', 'price_desc', 'popular', 'rating', 'discount'
  ).default('newest')
});

module.exports = {
  getProductsSchema
};
