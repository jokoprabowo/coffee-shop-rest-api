import joi from 'joi';

export const postCartSchema = joi.object({
  coffeeId: joi.number()
    .min(1)
    .required()
    .messages({
      'number.base': 'Coffee ID must be a number',
      'number.min': 'Coffee ID must be at least 1',
      'any.required': 'Coffee ID is required',
    }),
  quantity: joi.number()
    .min(1)
    .required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity must be at leat 1',
      'any.required': 'Quantity is required',
    }),
});

export const putCartSchema = joi.object({
  cartItemId: joi.number()
    .min(1)
    .required()
    .messages({
      'number.base': 'Cart item ID must be a number',
      'number.min': 'Cart item ID must be at least 1',
      'any.required': 'Cart item ID is required',
    }),
  quantity: joi.number()
    .min(1)
    .required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity must be at leat 1',
      'any.required': 'Quantity is required',
    }),
});

export const deleteCartSchema = joi.object({
  cartItemId: joi.number()
    .min(1)
    .required()
    .messages({
      'number.base': 'Cart item ID must be a number',
      'number.min': 'Cart item ID must be at least 1',
      'any.required': 'Cart item ID is required',
    }),
});