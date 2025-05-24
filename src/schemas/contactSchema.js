import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 20 characters long',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Phone number must be at least 3 characters long',
    'string.max': 'Phone number must be at most 20 characters long',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().min(3).max(20).email().optional().messages({
    'string.min': 'Email must be at least 3 characters long',
    'string.max': 'Email must be at most 20 characters long',
    'string.email': 'Email must be a valid email address',
  }),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.only': 'Contact type must be one of work, home, personal',
      'any.required': 'Contact type is required',
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional().messages({
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 20 characters long',
  }),
  phoneNumber: Joi.string().min(3).max(20).optional().messages({
    'string.min': 'Phone number must be at least 3 characters long',
    'string.max': 'Phone number must be at most 20 characters long',
  }),
  email: Joi.string().min(3).max(20).email().optional().messages({
    'string.min': 'Email must be at least 3 characters long',
    'string.max': 'Email must be at most 20 characters long',
    'string.email': 'Email must be a valid email address',
  }),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .optional()
    .messages({
      'any.only': 'Contact type must be one of work, home, personal',
    }),
})
  .min(1)
  .message('At least one field must be provided for update');
