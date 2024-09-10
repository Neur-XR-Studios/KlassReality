module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'standard', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {},
};
