module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ['prettier', 'plugin:node/recommended', 'eslint:recommended'],
  plugins: ['prettier'],
  rules: { 'no-console': 'off', 'no-unused-vars': 'warn' }
};
