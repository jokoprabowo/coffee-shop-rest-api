import { ClientError } from '../../exceptions';
import { postCoffeeSchema, putCoffeeSchema } from './schema';
import { coffeeDto } from '../../dto';

const CoffeeValidator = {
  validatePostCoffeePayload: (payload: coffeeDto) => {
    const validationResult = postCoffeeSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(detail => detail.message);
      throw new ClientError(errorMessages.join(', '));
    }
  },

  validatePutCoffeePayload: (payload: coffeeDto) => {
    const validationResult = putCoffeeSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(detail => detail.message);
      throw new ClientError(errorMessages.join(', '));
    }
  }
};

export default CoffeeValidator;
