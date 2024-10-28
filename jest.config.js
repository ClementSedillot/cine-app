// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Gère les fichiers CSS
    },
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Gère les fichiers TypeScript
    },
  };
  