# Testing Setup Guide for React Components

## Overview

This guide provides instructions for setting up and running comprehensive test suites for React components in the token-calculator project, including ControlBar and ModelSelector components.

## Required Dependencies

Install the following testing libraries:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### Package Details

- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements
- **@testing-library/user-event**: Simulates user interactions
- **jest-environment-jsdom**: Provides DOM environment for Jest tests

## Jest Configuration Updates

Update your `jest.config.js` to support React component testing:

```javascript
export default {
  testEnvironment: 'jsdom', // Changed from 'node' to 'jsdom'
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/__tests__/**/*.test.jsx', '**/?(*.)+(spec|test).js', '**/?(*.)+(spec|test).jsx'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

## Jest Setup File

Create a `jest.setup.js` file in the project root:

```javascript
import '@testing-library/jest-dom';

// Mock window.matchMedia for dark mode support
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

## Running the Tests

After installing dependencies and updating configuration:

```bash
# Run all tests
npm test

# Run specific component tests
npm test ControlBar.test.jsx
npm test ModelSelector.test.jsx

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run tests with verbose output
npm test -- --verbose
```

## Test Coverage

### ControlBar Component
- **54 total test cases**
- Component Rendering: 7 tests
- Copy Button Success Cases: 8 tests
- Copy Button Error Cases: 6 tests
- Clear Button Success Cases: 4 tests
- Clear Button Error Cases: 3 tests
- Button Disabled States: 12 tests
- Accessibility: 6 tests
- Props Validation: 6 tests
- Edge Cases: 9 tests
- Integration Tests: 3 tests

### What's Tested

#### Functionality
- Copy to clipboard functionality
- Clear button functionality
- State management (copied state)
- Timer-based state resets
- Error handling

#### User Interactions
- Button clicks
- Keyboard navigation
- Rapid clicking
- Multiple operations

#### Edge Cases
- Empty text
- Null/undefined values
- Very long text
- Unicode characters
- Component unmounting
- Dynamic prop updates

#### Accessibility
- Button roles
- Screen reader support
- Disabled state indication
- Keyboard accessibility

## Test File Locations

```
token-calculator/src/components/Calculator/__tests__/ControlBar.test.jsx
token-calculator/src/components/Calculator/__tests__/ModelSelector.test.jsx
```

## Troubleshooting

### Common Issues

**Issue**: `ReferenceError: document is not defined`
**Solution**: Make sure `testEnvironment: 'jsdom'` is set in jest.config.js

**Issue**: `Cannot find module '@testing-library/react'`
**Solution**: Run `npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event`

**Issue**: `toBeInTheDocument is not a function`
**Solution**: Make sure you created jest.setup.js and added it to setupFilesAfterEnv

**Issue**: Clipboard API not working in tests
**Solution**: The tests include a mock for `navigator.clipboard` - this is already handled in the test files

**Issue**: Timeout errors
**Solution**: The tests use `jest.useFakeTimers()` to control setTimeout behavior

**Issue**: ES module errors
**Solution**: The project uses ES modules, ensure package.json has "type": "module" and use --experimental-vm-modules flag (already in package.json scripts)

## Additional Notes

- Tests use fake timers to control asynchronous behavior
- The Clipboard API is mocked in tests to avoid browser permission issues
- Console errors are suppressed during error handling tests
- All tests are independent and can run in any order
- Tests follow the Arrange-Act-Assert (AAA) pattern
