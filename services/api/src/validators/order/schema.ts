import joi from 'joi';

export const getOrderDetailsSchema = joi.object({
  id: joi.number().integer().positive().required()
    .messages({
      'number.base': 'Order ID must be a number.',
      'number.integer': 'Order ID must be an integer.',
      'number.positive': 'Order ID must be a positive number.',
      'any.required': 'Order ID is required.',
    })
});

export const putOrderStatusSchema = joi.object({
  id: joi.number().integer().positive().required()
    .messages({
      'number.base': 'Order ID must be a number.',
      'number.integer': 'Order ID must be an integer.',
      'number.positive': 'Order ID must be a positive number.',
      'any.required': 'Order ID is required.',
    }),
  status: joi.string().valid('pending', 'paid', 'failed', 'canceled', 'expired', 'refunded', 'partially_refunded', 'unknown')
    .required()
    .messages({
      'string.base': 'Status must be a string.',
      'any.only': 'Status must be one of the following: pending, paid, failed, canceled, expired, refunded, partially_refunded, unknown.',
      'any.required': 'Status is required.',
    }),
});

export const delOrderSchema = joi.object({
  id: joi.number().integer().positive().required()
    .messages({
      'number.base': 'Order ID must be a number.',
      'number.integer': 'Order ID must be an integer.',
      'number.positive': 'Order ID must be a positive number.',
      'any.required': 'Order ID is required.',
    }),
});

export const getMonthlyOrderStatsSchema = joi.object({
  month: joi.number().integer().min(1).max(12).required()
    .messages({
      'number.base': 'Month must be a number.',
      'number.integer': 'Month must be an integer.',
      'number.min': 'Month must be at least 1.',
      'number.max': 'Month must be at most 12.',
      'any.required': 'Month is required.',
    }),
  year: joi.number().integer().min(2026).max(new Date().getFullYear()).required()
    .messages({
      'number.base': 'Year must be a number.',
      'number.integer': 'Year must be an integer.',
      'number.min': 'Year must be at least 2026.',
      'number.max': 'Year must be at most the current year.',
      'any.required': 'Year is required.',
    }),
  statuses: joi.array().items(joi.string().valid('pending', 'paid', 'failed', 'canceled', 'expired', 'refunded', 'partially_refunded', 'unknown'))
    .messages({
      'array.base': 'Statuses must be an array.',
      'array.includes': 'Each status must be one of the following: pending, paid, failed, canceled, expired, refunded, partially_refunded, unknown.',
    })
});