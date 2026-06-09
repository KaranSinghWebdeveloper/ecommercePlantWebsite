const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  slug: Joi.string().trim().lowercase().pattern(/^[a-z0-9-]+$/).optional(),
  imageUrl: Joi.string().uri().allow('', null).optional(),
  imageAlt: Joi.string().max(200).allow('', null).optional(),
  description: Joi.string().max(1000).allow('', null).optional(),
  seoTitle: Joi.string().max(160).allow('', null).optional(),
  seoDescription: Joi.string().max(300).allow('', null).optional(),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  slug: Joi.string().trim().lowercase().pattern(/^[a-z0-9-]+$/).optional(),
  imageUrl: Joi.string().uri().allow('', null).optional(),
  imageAlt: Joi.string().max(200).allow('', null).optional(),
  description: Joi.string().max(1000).allow('', null).optional(),
  seoTitle: Joi.string().max(160).allow('', null).optional(),
  seoDescription: Joi.string().max(300).allow('', null).optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
}).min(1);

module.exports = { createCategorySchema, updateCategorySchema };
