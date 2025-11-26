import Joi from 'joi';

export const registerPayloadSchema = Joi.object({
  fullname: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.min': 'Full name must be at least 3 characters long',
      'string.max': 'Full name must not exceed 50 characters',
      'any.required': 'Full name is required',
    }),
  address: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      'string.min': 'Address must be at least 5 characters long',
      'string.max': 'Address must not exceed 100 characters',
      'any.required': 'Address is required',
    }),
  phone: Joi.string()
    .pattern(/^(?:62|0)8[1-9][0-9]{6,9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must start with 62 or 08 and be followed by 10-12 digits',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/)
    .max(30)
    .required()
    .messages({
      'string.pattern.base': 'Password must have 10 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
      'string.max': 'Password must not exceed 30 characters',
      'any.required': 'Password is required',
    }),
  role: Joi.string()
    .valid('admin', 'customer')
    .optional()
    .messages({
      'any.only': 'Role must be either admin or customer',
    }),
  deviceInfo: Joi.string()
    .max(255)
    .optional()
    .messages({
      'string.max': 'Device info must not exceed 255 characters',
    }),
  ipAddress: Joi.string()
    .ip({ version: ['ipv4', 'ipv6'] })
    .optional()
    .messages({
      'string.ip': 'IP address must be a valid IPv4 or IPv6 address',
    }),
});

export const loginPayloadSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/)
    .max(30)
    .required()
    .messages({
      'string.pattern.base': 'Password must have 10 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
      'string.max': 'Password must not exceed 30 characters',
      'any.required': 'Password is required',
    }),
  deviceInfo: Joi.string()
    .max(255)
    .optional()
    .messages({
      'string.max': 'Device info must not exceed 255 characters',
    }),
  ipAddress: Joi.string()
    .ip({ version: ['ipv4', 'ipv6'] })
    .optional()
    .messages({
      'string.ip': 'IP address must be a valid IPv4 or IPv6 address',
    }),
});
