// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import headerPlugin from '@tony.ganchev/eslint-plugin-header';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

const licenseHeader = [
  '',
  ' * This file is part of WPPConnect.',
  ' *',
  ' * WPPConnect is free software: you can redistribute it and/or modify',
  ' * it under the terms of the GNU Lesser General Public License as published by',
  ' * the Free Software Foundation, either version 3 of the License, or',
  ' * (at your option) any later version.',
  ' *',
  ' * WPPConnect is distributed in the hope that it will be useful,',
  ' * but WITHOUT ANY WARRANTY; without even the implied warranty of',
  ' * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the',
  ' * GNU Lesser General Public License for more details.',
  ' *',
  ' * You should have received a copy of the GNU Lesser General Public License',
  ' * along with WPPConnect.  If not, see <https://www.gnu.org/licenses/>.',
  ' ',
];

export default tseslint.config(
  // ─── Global ignores ────────────────────────────────────────────────────────
  {
    ignores: ['dist/**', 'node_modules/**', 'tokens/**'],
  },

  // ─── Base rules for all files ──────────────────────────────────────────────
  {
    extends: [js.configs.recommended],
    plugins: {
      header: headerPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'no-async-promise-executor': 'off',
      'no-constant-condition': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': 'off',
      'no-useless-assignment': 'off',
      'no-useless-catch': 'off',
      'no-useless-escape': 'off',
      'prefer-const': 'off',
      'preserve-caught-error': 'off',
      'header/header': [2, 'block', licenseHeader, 1],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },

  // ─── TypeScript source files ───────────────────────────────────────────────
  {
    files: ['src/**/*.ts'],
    extends: [...tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/prefer-namespace-keyword': 'off',
      'prefer-const': 'off',
    },
  },

  // ─── Lib JS files (browser + custom globals) ──────────────────────────────
  {
    files: ['src/lib/**/*.js'],
    ignores: ['src/lib/**/webpack.*.js', 'src/lib/**/gulpfile.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.amd,
        ...globals.es2015,
        axios: 'readonly',
        Debug: 'readonly',
        Store: 'readonly',
        WAPI: 'readonly',
        WPP: 'readonly',
        webpackJsonp: 'readonly',
        WWebJS: 'readonly',
      },
    },
    rules: {
      'no-array-constructor': 'off',
      'no-prototype-builtins': 'off',
      'no-redeclare': 'off',
    },
  },

  // ─── Webpack / gulpfile (Node env, no browser globals) ────────────────────
  {
    files: ['src/lib/**/webpack.*.js', 'src/lib/**/gulpfile.js'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // ─── Examples ──────────────────────────────────────────────────────────────
  {
    files: ['examples/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2015,
      },
    },
  },

  // ─── Prettier (disable conflicting rules — must be last) ───────────────────
  prettierConfig
);
