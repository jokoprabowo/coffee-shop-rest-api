// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
    'no-console': 'off',
    'linebreak-style': [
      'error', 'windows'
    ],
    'no-underscore-dangle': 'off',
    'camelcase': 'off',
    'object-curly-spacing': ['error', 'always'],
    'prefer-const': ['error'],
    'semi': ['error', 'always'],
    'indent': ['error', 2],
    'quotes': ['error', 'single']
  }
  }
);
