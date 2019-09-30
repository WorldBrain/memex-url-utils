module.exports = {
    rootDir: '.',
    testMatch: ['<rootDir>/ts/**/*.test.ts'],
    moduleFileExtensions: ['js', 'ts'],
    transform: {
        '^.+\\.ts$': '<rootDir>/node_modules/ts-jest',
    },
}
