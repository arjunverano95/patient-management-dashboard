import {FlatCompat} from '@eslint/eslintrc';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1) Global ignores FIRST so nothing ever lints .next/
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      'next-env.d.ts',
    ],
  },

  // 2) Next.js presets
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // 3) Your project rules (optionally scope files & TS project)
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        // If you’re doing type-aware linting, point to your tsconfig:
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

export default eslintConfig;
