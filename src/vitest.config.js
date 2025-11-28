import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientModules = path.resolve(__dirname, 'client/node_modules');

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    testTimeout: 10000,
    hookTimeout: 10000,
    include: ['tests/**/*.test.{js,jsx}'],
    environment: 'node',
    environmentMatchGlobs: [
      ['tests/client-tests/**', 'jsdom'],
    ],
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['server/routes/**/*.js', 'client/src/**/*.jsx'],
    },
  },
  resolve: {
    alias: {
      // Force all React-related packages to use the client's versions
      'react': path.join(clientModules, 'react'),
      'react-dom': path.join(clientModules, 'react-dom'),
      'react-dom/client': path.join(clientModules, 'react-dom/client'),
      'react-router-dom': path.join(clientModules, 'react-router-dom'),
      'react-router': path.join(clientModules, 'react-router'),
      'react/jsx-runtime': path.join(clientModules, 'react/jsx-runtime'),
      'react/jsx-dev-runtime': path.join(clientModules, 'react/jsx-dev-runtime'),
    },
  },
});
