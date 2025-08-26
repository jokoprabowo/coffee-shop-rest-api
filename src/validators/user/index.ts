import { ClientError } from '../../exceptions';
import { putUserSchema } from './schema';

const UserValidator = {
  validatePutPayload: (payload: any) => {
    const validationResult = putUserSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(detail => detail.message);
      throw new ClientError(errorMessages.join(', '));
    }
  }
}

export default UserValidator;
