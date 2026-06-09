const Joi = require('joi');

const createBannerSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).required(),
  subtitle: Joi.string().max(300).allow('', null).optional(),
  imageUrl: Joi.string().uri().required(),
  imageAlt: Joi.string().max(200).allow('', null).optional(),
  link: Joi.string().uri().allow('', null).optional(),
  sortOrder: Joi.number().integer().default(0),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

const updateBannerSchema = createBannerSchema.fork(['title', 'imageUrl'], (s) => s.optional()).min(1);

const createDeliveryAreaSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),
  city: Joi.string().trim().min(2).max(100).required(),
  pincode: Joi.string().pattern(/^\d{6}$/).required().messages({
    'string.pattern.base': 'Pincode must be exactly 6 digits',
  }),
  deliveryCharge: Joi.number().min(0).precision(2).default(0),
  minOrderForFreeDelivery: Joi.number().min(0).precision(2).default(1000),
  isActive: Joi.boolean().default(true),
});

const updateDeliveryAreaSchema = createDeliveryAreaSchema
  .fork(['name', 'city', 'pincode'], (s) => s.optional())
  .min(1);

module.exports = {
  createBannerSchema,
  updateBannerSchema,
  createDeliveryAreaSchema,
  updateDeliveryAreaSchema,
};
