import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    'node_modules',
    '**/dist',
    '**/node_modules',
  ]),
  tseslint.configs.recommended,
  {
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
      'quotes': ['error', 'single'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  },
]);