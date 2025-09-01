import { ClientError } from '../../exceptions';
import { registerPayloadSchema, loginPayloadSchema } from './schema';
import { UserDto, LoginUserDto } from '../../dto';

const AuthenticateValidator = {
  validateRegisterPayload: (payload: UserDto) => {
    const validationResult = registerPayloadSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(detail => detail.message);
      throw new ClientError(errorMessages.join(', '));
    }
  },
  
  validateLoginPayload: (payload: LoginUserDto) => {
    const validationResult = loginPayloadSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(detail => detail.message);
      throw new ClientError(errorMessages.join(', '));
    }
  }
};

export default AuthenticateValidator;
