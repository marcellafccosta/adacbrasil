export default {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    moduleDirectories: ['node_modules', 'src'],
    transform: {
      '^.+\\.js$': 'babel-jest',  // Usando babel-jest para transformar arquivos .js
    },
    transformIgnorePatterns: [
      '/node_modules/', // Ignorar transformação de arquivos em node_modules
    ],
  };
  