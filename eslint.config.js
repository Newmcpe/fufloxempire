import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import perfectionist from 'eslint-plugin-perfectionist';

export default [
  {
    languageOptions: {
      ecmaVersion: 2021,
      parser: typescriptParser,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      perfectionist: perfectionist,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...perfectionist.configs['recommended-natural'].rules,
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      'comma-dangle': 'off',
      'func-call-spacing': 'off',
      indent: 'off',
      'multiline-ternary': 'off',
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          next: '*',
          prev: [
            'block-like',
            'break',
            'case',
            'class',
            'continue',
            'default',
            'directive',
            'do',
            'import',
            'export',
            'expression',
            'for',
            'if',
            'iife',
            'let',
            'multiline-block-like',
            'multiline-const',
            'multiline-expression',
            'multiline-let',
            'return',
            'throw',
            'try',
            'while',
          ],
        },
        {
          blankLine: 'any',
          next: ['import'],
          prev: ['import'],
        },
      ],
      semi: 'off',
      'space-before-function-paren': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      perfectionist: perfectionist,
    },
    rules: {
      ...perfectionist.configs['recommended-natural'].rules,
    },
  },
  js.configs.recommended,
];
