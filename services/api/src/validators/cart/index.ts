import { validate } from '../validate';
import { postCartSchema, putCartSchema, deleteCartSchema } from './schema';

const CartValidator = {
  validatePostCartPayload: (payload: { coffeeId: number, quantity: number }) => {
    validate(postCartSchema, payload);
  },

  validatePutCartPayload: (payload: { cartItemId: number, quantity: number }) => {
    validate(putCartSchema, payload);
  },

  validateDeleteCartPayload: (payload: { cartItemId: number }) => {
    validate(deleteCartSchema, payload);
  },
};

export default CartValidator;
