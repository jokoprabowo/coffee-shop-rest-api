import Joi from 'joi';

export const putUserSchema = Joi.object({
  fullname: Joi.string()
    .min(3)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Full name must be at least 3 characters long.',
      'string.max': 'Full name must not exceed 50 characters.',
    }),
  address: Joi.string()
    .min(5)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Address must be at least 5 characters long.',
      'string.max': 'Address must not exceed 100 characters.',
    }),
  phone: Joi.string()
    .pattern(/^(?:\+62|0)8[1-9][0-9]{6,9}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must start with +62 or 08 and be followed by 10-12 digits',
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Email must be a valid email address.',
    }),
  password: Joi.string()
    .min(8)
    .max(30)
    .optional()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password must not exceed 30 characters.',
    }),
});
