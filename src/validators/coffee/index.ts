import { ClientError } from '../../exceptions';
import { coffeePayloadSchema } from './schema';

export const CoffeeValidator = {
  validateCoffeePayload: (payload: any) => {
    const validationResult = coffeePayloadSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(detail => detail.message);
      throw new ClientError(errorMessages.join(', '));
    }
  }
};
