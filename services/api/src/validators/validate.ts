import { ObjectSchema } from 'joi';
import { ClientError } from '../exceptions';

export const validate = <T>(schema: ObjectSchema<T>, payload: T): void => {
  const validationResult = schema.validate(payload, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (validationResult.error) {
    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(detail => detail.message);
      throw new ClientError(errorMessages.join(', '));
    }
  }
};
