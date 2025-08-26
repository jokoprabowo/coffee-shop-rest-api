import { ClientError } from '../../exceptions';
import { putUserSchema } from './schema';
import { userDto } from '../../dto';

const UserValidator = {
  validatePutPayload: (payload: userDto) => {
    const validationResult = putUserSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(detail => detail.message);
      throw new ClientError(errorMessages.join(', '));
    }
  }
};

export default UserValidator;
