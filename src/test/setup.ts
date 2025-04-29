
import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { setupServer } from 'msw/node';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Export MSW server for global usage in tests
export const server = setupServer();

// Set up server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Clean up after tests
afterAll(() => server.close());

// Reset handlers between tests
afterEach(() => server.resetHandlers());
