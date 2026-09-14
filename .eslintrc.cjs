module.exports = {
  env: { browser: true, es2020: true, node: true },
  globals: {
    __APP_VERSION__: 'readonly',
    __BUILD_NUMBER__: 'readonly'
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    'no-unused-vars': [
      'warn',
      // A leading underscore marks a binding kept for interface/compat reasons
      // (e.g. Express error handlers must keep 4 params; mock signatures mirror
      // the real API). Everything else unused is a genuine smell.
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],
    'react-hooks/set-state-in-effect': 'off'
  },
  overrides: [
    {
      files: ['server/**/*.js'],
      env: { node: true, es2020: true },
      rules: {
        'react-hooks/rules-of-hooks': 'off',
        'react-refresh/only-export-components': 'off'
      }
    }
  ]
}
