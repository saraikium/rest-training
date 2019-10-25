module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'import/newline-after-import': ['error', { count: 1 }],
    quotes: ['error', 'single'],
    'import/no-dynamic-require': 0,
    'no-unused-vars': 'warn',
    'consistent-return': 'warn',
    'consistent-return': 0,
    'no-use-before-define': 1
  }
};
