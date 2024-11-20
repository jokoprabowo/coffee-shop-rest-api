const { validateEmail, validatePassword } = require('../utilities/validate');

test('Returns false for empty email', () => {
  expect(validateEmail('')).toBe(false);
});
test('Returns false for random sentence', () => {
  expect(validateEmail('kasudghaiksd')).toBe(false);
});
test('Returns false for email without @', () => {
  expect(validateEmail('testemail.com')).toBe(false);
});
test('Returns true for email', () => {
  expect(validateEmail('test@email.com')).toBe(true);
});

test('Returns false for empty password', () => {
  expect(validatePassword('')).toBe(false);
});
test('Returns false for password with less than 8 characters', () => {
  expect(validatePassword('test')).toBe(false);
});
test('Returns false for password with alphabet only', () => {
  expect(validatePassword('testtest')).toBe(false);
});
test('Returns false for password with numbers only', () => {
  expect(validatePassword('12345678')).toBe(false);
});
test('Returns true for password with the minimum requirements', () => {
  expect(validatePassword('test1234')).toBe(true);
});
