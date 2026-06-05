# Footer Component Tests

## Current Status

The Footer component test file has been created with comprehensive test coverage. However, the tests currently fail because Jest needs additional configuration to handle JSX syntax in test files.

## Setup Required

To run these tests, you need to configure Jest to transform JSX. Here are two options:

### Option 1: Install and Configure Babel (Recommended)

1. Install the necessary Babel packages:

```bash
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-jest
```

2. Create a `babel.config.js` file in the project root:

```javascript
export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
};
```

3. Update `jest.config.js` to use Babel:

```javascript
export default {
  testEnvironment: 'jsdom',  // Changed from 'node' to 'jsdom' for React components
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',  // Use babel-jest for .js and .jsx files
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
  ],
};
```

4. Run the tests:

```bash
npm test -- Footer.test.js
```

### Option 2: Use SWC (Faster Alternative)

1. Install SWC packages:

```bash
npm install --save-dev @swc/core @swc/jest
```

2. Create a `.swcrc` file in the project root:

```json
{
  "jsc": {
    "parser": {
      "syntax": "ecmascript",
      "jsx": true
    },
    "transform": {
      "react": {
        "runtime": "automatic"
      }
    }
  }
}
```

3. Update `jest.config.js`:

```javascript
export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': '@swc/jest',
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
  ],
};
```

## Test Coverage

Once configured, the test suite provides comprehensive coverage:

- **Rendering Tests** (4 tests): Verifies component renders correctly
- **Text Content Tests** (4 tests): Validates all text content
- **CSS Classes Tests** (4 tests): Checks Tailwind styling
- **Structure Tests** (5 tests): Validates DOM structure
- **Props Handling Tests** (3 tests): Tests component behavior
- **Accessibility Tests** (7 tests): Ensures a11y compliance
- **Edge Cases Tests** (4 tests): Tests unusual scenarios
- **Component Type Tests** (3 tests): Validates exports
- **Dark Mode Tests** (4 tests): Checks theme support
- **Snapshot Tests** (2 tests): Regression testing
- **Integration Tests** (3 tests): Tests with other components

**Total: 43 comprehensive test cases**

## Running Tests After Setup

Run all Footer tests:
```bash
npm test -- Footer.test.js
```

Run in watch mode:
```bash
npm test -- --watch Footer.test.js
```

Generate coverage report:
```bash
npm test -- --coverage Footer.test.js
```
