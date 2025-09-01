import bcrypt from 'bcrypt';

const SALT = 10;

export const  encryptPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, SALT, (err, encryptedPassword) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(encryptedPassword);
    });
  });
};

export const checkPassword = async (password: string, encryptedPasswordPassword: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPasswordPassword, (err, isMatch) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(isMatch);
    });
  });
};
