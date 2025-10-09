// @ts-check

import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import perfectionist from 'eslint-plugin-perfectionist';
import reactDom from 'eslint-plugin-react-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react-x';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist']),
  {
    extends: [
      js.configs.recommended,
      perfectionist.configs['recommended-natural'],
      pluginQuery.configs['flat/recommended'],
      react.configs['recommended-typescript'],
      reactDom.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.js'],
          defaultProject: 'tsconfig.node.json'
        },
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-duplicate-imports': 'error',
      'object-shorthand': 'error',
      'prefer-destructuring': 'error'
    }
  }
]);
