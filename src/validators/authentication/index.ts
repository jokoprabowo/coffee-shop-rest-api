import { ClientError } from '../../exceptions';
import { registerPayloadSchema, loginPayloadSchema } from './schema';

const AuthenticateValidator = {
  validateRegisterPayload: (payload: any) => {
    const validationResult = registerPayloadSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(detail => detail.message);
      throw new ClientError(errorMessages.join(', '));
    }
  },
  
  validateLoginPayload: (payload: any) => {
    const validationResult = loginPayloadSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(detail => detail.message);
      throw new ClientError(errorMessages.join(', '));
    }
  }
}

export default AuthenticateValidator;
