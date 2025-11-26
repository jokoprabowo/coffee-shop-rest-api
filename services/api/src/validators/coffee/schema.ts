import joi from 'joi';

export const postCoffeeSchema = joi.object({
  name: joi.string()
    .min(5)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least 5 characters long',
      'string.max': 'Name must not exceed 50 characters',
      'any.required': 'Name is required',
    }),
  price: joi.number()
    .min(10000)
    .required()
    .messages({
      'number.min': 'Price must be at least 10000',
      'any.required': 'Price is required',
    }),
  description: joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Description must be at least 5 characters long',
      'string.max': 'Description must not exceed 1000 characters',
      'any.required': 'Description is required',
    }),
  image: joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'Image must be a valid URL',
      'any.required': 'Image is required',
    }),
});

export const putCoffeeSchema = joi.object({
  name: joi.string()
    .min(5)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Name must be at least 5 characters long',
      'string.max': 'Name must not exceed 50 characters',
    }),
  price: joi.number()
    .min(10000)
    .optional()
    .messages({
      'number.min': 'Price must be at least 10000',
    }),
  description: joi.string()
    .min(10)
    .max(1000)
    .optional()
    .messages({
      'string.min': 'Description must be at least 5 characters long',
      'string.max': 'Description must not exceed 1000 characters',
    }),
  image: joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Image must be a valid URL',
    }),
});
