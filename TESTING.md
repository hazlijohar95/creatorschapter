
# Testing Guide

This project uses Vitest for testing. This document provides guidance on how to write and run tests.

## Test Structure

Tests are organized according to the following structure:

- Unit tests are placed next to the files they test with a `.test.ts` or `.test.tsx` extension
- Integration tests are placed in the `src/test/integration` directory
- E2E tests are placed in the `src/test/e2e` directory

## Running Tests

The following commands are available:

- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run test:ui` - Run tests with the Vitest UI

## Writing Tests

### Unit Tests

For unit tests, we use Vitest's test functions:

```typescript
import { describe, it, expect } from 'vitest';

describe('My function', () => {
  it('should work correctly', () => {
    expect(myFunction()).toBe(true);
  });
});
```

### Component Tests

For React component tests, we use React Testing Library:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Mocking Supabase

Use the Supabase mocking utilities to test components and services that use Supabase:

```typescript
import { mockSupabaseModule } from 'src/test/mocks/supabase';

const supabaseMock = mockSupabaseModule();
supabaseMock.mockDataResponse([{ id: 1, name: 'Test' }]);

// Your test here
```

## Test Standards

- Every component should have tests for:
  - Rendering with default props
  - Rendering with different props
  - User interactions
  - Error states

- Every service should have tests for:
  - Success paths
  - Error handling
  - Edge cases

- Every utility function should have tests for:
  - Expected outputs
  - Edge cases
  - Error handling
