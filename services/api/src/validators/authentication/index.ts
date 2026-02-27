import { validate } from '../validate';
import { registerPayloadSchema, loginPayloadSchema } from './schema';
import { UserDto, LoginUserDto } from '../../dto';

const AuthenticateValidator = {
  validateRegisterPayload: (payload: UserDto) => {
    validate(registerPayloadSchema, payload);
  },
  
  validateLoginPayload: (payload: LoginUserDto) => {
    validate(loginPayloadSchema, payload);
  }
};

export default AuthenticateValidator;
