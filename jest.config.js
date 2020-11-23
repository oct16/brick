module.exports = {
    preset: 'ts-jest',
    rootDir: __dirname,
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'lcov', 'text'],
    watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
    // testRegex: '(/unit/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    moduleNameMapper: {
        '^@timecat/(.*?)$': '<rootDir>/packages/$1/src',
        'packages/(.*)$': '<rootDir>/packages/$1'
    },
    testMatch: ['<rootDir>/__tests__/**/*.spec.[jt]s?(x)'],
    testPathIgnorePatterns: ['/node_modules/'],
    verbose: true,
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/jest-setup.js'],
    globals: {
        'ts-jest': {
            tsconfig: {
                lib: ['ES2019'],
                module: 'commonjs',
                target: 'ES2019'
            }
        }
    },
    testTimeout: 30000
}
