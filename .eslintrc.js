module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: ['plugin:vue/essential', 'airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: 'off',
    'comma-dangle': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off'
  }
}
