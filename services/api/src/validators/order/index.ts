import { validate } from '../validate';
import { getOrderDetailsSchema, putOrderStatusSchema, delOrderSchema, getMonthlyOrderStatsSchema } from './schema';

const OrderValidator = {
  validateGetOrderDetails: (payload: { id: number }) => {
    validate(getOrderDetailsSchema, payload);
  },

  validatePutOrderStatus: (payload: { id: number, status: string }) => {
    validate(putOrderStatusSchema, payload);
  },

  validateDelOrder: (payload: { id: number }) => {
    validate(delOrderSchema, payload);
  },

  validateGetMonthlyOrderStats: (payload: { month: number, year: number, statuses: string[] }) => {
    validate(getMonthlyOrderStatsSchema, payload);
  }
};

export default OrderValidator;
