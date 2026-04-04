module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(chevrotain|harmony-protocol-js)).+\\.js$',
    ],
    testMatch: [
        '**/tests/**/*.test.js',
    ],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/cli.js',
    ],
    coverageThreshold: {
        global: {
            branches: 20,
            functions: 30,
            lines: 50,
            statements: 50,
        },
    },
    verbose: true,
};
