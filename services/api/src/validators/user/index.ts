import { validate } from '../validate';
import { putUserSchema } from './schema';
import { UserDto } from '../../dto';

const UserValidator = {
  validatePutPayload: (payload: UserDto) => {
    validate(putUserSchema, payload);
  }
};

export default UserValidator;
