import bcrypt from 'bcrypt';

const SALT = 10;

export const  encryptInput = async (input: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(input, SALT, (err, encryptedInput) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(encryptedInput);
    });
  });
};

export const checkInput = async (input: string, encryptedInput: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(input, encryptedInput, (err, isMatch) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(isMatch);
    });
  });
};
