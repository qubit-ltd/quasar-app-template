import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import babelParser from '@babel/eslint-parser';
import qubitConfig from '@qubit-ltd/eslint-config';

export default [
  // Ignore patterns (replaces .eslintignore)
  {
    ignores: [
      'dist/**',
      'src-capacitor/**',
      'src-cordova/**',
      '.quasar/**',
      'node_modules/**',
      '.eslintrc.cjs',
      'quasar.config.*.temporary.compiled*',
    ],
  },

  // Apply to all files
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',

        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',

        // Quasar specific globals
        ga: 'readonly', // Google Analytics
        cordova: 'readonly',
        __statics: 'readonly',
        __QUASAR_SSR__: 'readonly',
        __QUASAR_SSR_SERVER__: 'readonly',
        __QUASAR_SSR_CLIENT__: 'readonly',
        __QUASAR_SSR_PWA__: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly',
      },
    },
  },

  // Base ESLint recommended rules
  js.configs.recommended,

  // Qubit ESLint config
  ...qubitConfig,

  // Vue files configuration
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: babelParser,
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env'],
        },
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
    plugins: {
      vue,
    },
    rules: {
      // Vue 3 essential rules
      'vue/no-unused-vars': 'error',
      'vue/no-unused-components': 'error',
      'vue/require-v-for-key': 'error',
      'vue/valid-v-for': 'error',
      'vue/valid-v-model': 'error',
      'vue/no-parsing-error': 'error',
      'vue/no-dupe-keys': 'error',
      'vue/no-duplicate-attributes': 'error',
    },
  },

  // JavaScript files configuration
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env'],
        },
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
  },

  // Custom rules
  {
    rules: {
      'no-nested-ternary': 'off',
      // Disable import/named for Vue components since defineComponent is available in Vue 3
      'import/named': 'off',
    },
  },
];
