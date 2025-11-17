import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: [
      'eslint.config.*',
      'node_modules',
      'dist',
    ],
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], 
    plugins: { js }, 
    extends: ['js/recommended'], 
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
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }]
    }
  },
  tseslint.configs.recommended,
]);
