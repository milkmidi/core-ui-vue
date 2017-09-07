module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  globals: {
    'FB': false,
    'ga': false,
    'device': false,
  },
  plugins: [
    'html',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
  rules: {
    'global-require': 0,
    'import/no-extraneous-dependencies': 0,
    'no-extraneous-dependencies': 'off',
    'import/extensions': ['error', 'always', {
      js: 'never'
    }],
    'no-param-reassign': ['error', {
      props: false
    }],
    'no-plusplus': ['error', {
      allowForLoopAfterthoughts: true
    }],
  },
};