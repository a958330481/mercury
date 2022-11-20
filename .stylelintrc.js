module.exports = {
    plugins: ['stylelint-prettier'],
    extends: ['stylelint-config-standard', 'stylelint-config-rational-order'],
    ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
        'prettier/prettier': true,
        indentation: 4,
        'no-descending-specificity': null,
        'font-family-no-missing-generic-family-keyword': null,
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: ['function', 'if', 'each', 'include', 'mixin', 'for']
            }
        ]
    }
};