const Joi = require('joi');

const imageSchema = Joi.object({
  imageUrl: Joi.string().uri().required(),
  imageAlt: Joi.string().max(200).allow('', null).optional(),
  isPrimary: Joi.boolean().default(false),
  sortOrder: Joi.number().integer().default(0),
});

const createProductSchema = Joi.object({
  categoryId: Joi.number().integer().positive().required(),
  name: Joi.string().trim().min(2).max(255).required(),
  slug: Joi.string().trim().lowercase().pattern(/^[a-z0-9-]+$/).optional(),
  shortDescription: Joi.string().max(500).allow('', null).optional(),
  description: Joi.string().allow('', null).optional(),

  price: Joi.number().positive().precision(2).required(),
  comparePrice: Joi.number().positive().precision(2).allow(null).optional(),

  sku: Joi.string().max(100).allow('', null).optional(),
  stockAvailable: Joi.number().integer().min(0).default(0),
  stockStatus: Joi.string().valid('in_stock', 'out_of_stock', 'low_stock').default('in_stock'),

  size: Joi.string().max(100).allow('', null).optional(),
  potIncluded: Joi.boolean().default(false),
  plantType: Joi.string().max(100).allow('', null).optional(),
  height: Joi.string().max(100).allow('', null).optional(),
  potSize: Joi.string().max(100).allow('', null).optional(),
  wateringFrequency: Joi.string().max(100).allow('', null).optional(),
  sunlightRequirement: Joi.string().max(100).allow('', null).optional(),
  location: Joi.string().max(100).allow('', null).optional(),
  maintenanceLevel: Joi.string().max(100).allow('', null).optional(),
  petFriendly: Joi.boolean().default(false),

  featured: Joi.boolean().default(false),
  bestSeller: Joi.boolean().default(false),
  newArrival: Joi.boolean().default(false),

  seoTitle: Joi.string().max(160).allow('', null).optional(),
  seoDescription: Joi.string().max(300).allow('', null).optional(),
  seoKeywords: Joi.string().max(500).allow('', null).optional(),
  ogImage: Joi.string().uri().allow('', null).optional(),

  status: Joi.string().valid('active', 'inactive', 'draft').default('active'),

  images: Joi.array().items(imageSchema).default([]),
  tags: Joi.array().items(Joi.string().max(50)).default([]),
});

const updateProductSchema = createProductSchema.fork(
  ['categoryId', 'name', 'price'],
  (schema) => schema.optional()
).min(1);

module.exports = { createProductSchema, updateProductSchema };
