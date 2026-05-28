module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['babel-preset-expo'],
    },
  },
  env: {
    browser: true,
    es2021: true,
    'react-native/react-native': true,
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      'babel-module': {},
    },
    'boundaries/elements': [
      { type: 'core', pattern: 'src/core/**' },
      { type: 'shared', pattern: 'src/shared/**' },
      {
        type: 'feature',
        pattern: 'src/features/*',
        capture: ['featureName'],
        mode: 'folder',
      },
      { type: 'screens', pattern: 'src/screens/**' },
      { type: 'navigation', pattern: 'src/navigation/**' },
      { type: 'theme', pattern: 'src/theme/**' },
    ],
    'boundaries/ignore': ['**/node_modules/**', '**/__tests__/**'],
  },
  plugins: ['react', 'react-hooks', 'react-native', 'import', 'boundaries'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    // ─── Vars ────────────────────────────────────────────────────────────────
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

    // ─── React ───────────────────────────────────────────────────────────────
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',

    // ─── React Hooks ─────────────────────────────────────────────────────────
    'react-hooks/exhaustive-deps': 'warn',

    // ─── No hardcoded colors ─────────────────────────────────────────────────
    'react-native/no-color-literals': 'error',

    // ─── Import order: react → external → @core → @shared → @features → relative
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        pathGroups: [
          { pattern: 'react', group: 'external', position: 'before' },
          { pattern: 'react-native', group: 'external', position: 'before' },
          { pattern: 'expo', group: 'external', position: 'before' },
          { pattern: 'expo-*', group: 'external', position: 'before' },
          { pattern: '@react-navigation/**', group: 'external', position: 'before' },
          { pattern: '@core/**', group: 'internal', position: 'before' },
          { pattern: '@shared/**', group: 'internal' },
          { pattern: '@features/**', group: 'internal', position: 'after' },
          { pattern: '@navigation/**', group: 'internal', position: 'after' },
          { pattern: '@screens/**', group: 'internal', position: 'after' },
          { pattern: '@theme/**', group: 'internal', position: 'after' },
        ],
        pathGroupsExcludedImportTypes: ['builtin', 'external'],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      },
    ],

    // ─── Alias paths wajib untuk cross-module imports ─────────────────────────
    // Blokir relative imports yang menembus batas modul (../core, ../../shared, dll)
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../core/**', '../../core/**', '../../../core/**', '../../../../core/**'],
            message: "Gunakan alias '@core/' bukan relative import ke core/",
          },
          {
            group: ['../shared/**', '../../shared/**', '../../../shared/**', '../../../../shared/**'],
            message: "Gunakan alias '@shared/' bukan relative import ke shared/",
          },
          {
            group: ['../features/**', '../../features/**', '../../../features/**'],
            message: "Gunakan alias '@features/' bukan relative import ke features/",
          },
          {
            group: ['../theme/**', '../../theme/**', '../../../theme/**'],
            message: "Gunakan alias '@theme/' bukan relative import ke theme/",
          },
        ],
      },
    ],

    // ─── Cross-feature import restriction ────────────────────────────────────
    // features/kas TIDAK BOLEH import dari features/materi atau feature lain
    // mode:'folder' → seluruh src/features/kas/ dianggap satu elemen,
    // sehingga relative imports dalam kas/ sendiri tidak kena rule ini
    'boundaries/dependencies': [
      'error',
      {
        default: 'allow',
        rules: [
          {
            from: { type: 'feature' },
            disallow: { to: { type: 'feature' } },
            message:
              "Feature '{{from.captured.featureName}}' tidak boleh import dari feature '{{to.captured.featureName}}'. Gunakan '@shared/' atau '@core/' sebagai gantinya.",
          },
        ],
      },
    ],
  },
};
