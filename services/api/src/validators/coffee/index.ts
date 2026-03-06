import { validate } from '../validate';
import { postCoffeeSchema, putCoffeeSchema } from './schema';
import { CoffeeDto } from '../../dto';

const CoffeeValidator = {
  validatePostCoffeePayload: (payload: CoffeeDto) => {
    validate(postCoffeeSchema, payload);
  },

  validatePutCoffeePayload: (payload: CoffeeDto) => {
    validate(putCoffeeSchema, payload);
  }
};

export default CoffeeValidator;
