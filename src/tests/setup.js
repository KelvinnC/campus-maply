// Global test setup
import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';

// Determine test environment
const isClientTest = typeof window !== 'undefined';
const isServerTest = !isClientTest;

// ============ SUPPRESS CONSOLE OUTPUT ============
// Store original console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
};

// Suppress all console output during tests
beforeAll(() => {
  console.log = vi.fn();
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
});

// ============ CLIENT TEST SETUP ============
if (isClientTest) {
  // Import jest-dom matchers
  await import('@testing-library/jest-dom');
  
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Create localStorage mock with vi.fn() methods
  const localStorageMock = {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  // Create fetch mock
  const fetchMock = vi.fn();
  global.fetch = fetchMock;
  window.fetch = fetchMock;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    fetchMock.mockReset();
  });
}

// ============ SERVER TEST SETUP ============
let testDb = null;

if (isServerTest) {
  const module = await import('./server-tests/helpers/testDb.js');
  testDb = module.default;
}

beforeAll(async () => {
  if (testDb) {
    await testDb.init();
  }
});

afterAll(async () => {
  if (testDb) {
    testDb.close();
  }
});

beforeEach(async () => {
  if (testDb) {
    await testDb.reset();
  }
});
