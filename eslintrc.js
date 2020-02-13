module.exports = {
    globals: {
        __PATH_PREFIX__: true
    },
    env: {
        browser: true,
        jest: true
    },
    extends: ['airbnb', 'prettier', 'prettier/react'],
    plugins: ['prettier', 'react', 'react-hooks'],
    rules: {
        'prettier/prettier': 'error',
        'no-unused-vars': 'warn',
        'prefer-promise-reject-errors': ['off'],

        'react/jsx-filename-extension': ['off'],
        'react/prop-types': ['warn'],

        'no-return-assign': ['off'],
        'no-undef': 'error',

        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
    }
};
