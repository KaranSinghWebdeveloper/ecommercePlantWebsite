const Joi = require('joi');

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).allow('', null).optional().messages({
    'string.pattern.base': 'Please enter a valid 10-digit Indian mobile number'
  }),
}).min(1);

const addressSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  addressLine1: Joi.string().trim().min(5).max(300).required(),
  addressLine2: Joi.string().max(300).allow('', null).optional(),
  city: Joi.string().trim().min(2).max(100).required(),
  state: Joi.string().trim().min(2).max(100).required(),
  pincode: Joi.string().pattern(/^\d{6}$/).required(),
  landmark: Joi.string().max(200).allow('', null).optional(),
  isDefault: Joi.boolean().default(false),
});

module.exports = { updateProfileSchema, addressSchema };
