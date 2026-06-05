# TokenDisplay Component Tests

## Overview
Comprehensive Jest test suite for the TokenDisplay React component using React Testing Library.

## Test Coverage Summary

### Total Test Cases: 47

#### Test Categories:
1. **Rendering with valid props** (5 tests)
   - All four stat cards render correctly
   - Token count displays with Korean label
   - Character count with spaces displays correctly
   - Character count without spaces displays correctly
   - Byte size displays with "B" suffix

2. **Number formatting** (4 tests)
   - Large token counts formatted with commas
   - Large character counts formatted with commas
   - Large byte sizes formatted with commas
   - Small numbers without commas

3. **Edge cases - zero values** (3 tests)
   - All zero values handled
   - Individual zero values handled
   - Zero byte size handled

4. **Edge cases - null/undefined** (3 tests)
   - Null values behavior documented
   - Undefined values behavior documented
   - Valid default values work correctly

5. **Visual styling and layout** (5 tests)
   - Highlight styling on token count card
   - Non-highlight styling on other cards
   - Grid layout structure
   - Icons rendered for each stat
   - Rounded corners applied

6. **Large numbers handling** (3 tests)
   - Very large token counts
   - Billions in byte size
   - Maximum safe integer handling

7. **Decimal number handling** (2 tests)
   - Decimal token counts
   - Decimal byte sizes

8. **Negative number handling** (2 tests)
   - Negative numbers displayed
   - Negative large numbers formatted

9. **Component structure** (3 tests)
   - Stats in correct order
   - Proper text size classes
   - Transition classes applied

10. **Props updates and re-rendering** (3 tests)
    - Token count updates
    - All values update together
    - Rapid prop changes

11. **Locale integration** (1 test)
    - Locale-specific number formatting

12. **Snapshot tests** (3 tests)
    - Typical values snapshot
    - Zero values snapshot
    - Large values snapshot

## Prerequisites

Before running these tests, ensure the following packages are installed:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## Running the Tests

Run all tests:
```bash
npm test
```

Run only TokenDisplay tests:
```bash
npm test TokenDisplay
```

Run tests in watch mode:
```bash
npm test -- --watch TokenDisplay
```

Run with coverage:
```bash
npm test -- --coverage TokenDisplay
```

## Test Configuration

The tests use:
- **Test Environment**: `jsdom` (configured via `@jest-environment jsdom` comment)
- **React Testing Library**: For component rendering and queries
- **Jest DOM Matchers**: For enhanced assertions (toBeInTheDocument, etc.)

## Known Issues & Recommendations

### Null/Undefined Props
The component currently does not handle null or undefined props gracefully. The tests document this behavior with tests that expect errors to be thrown. Consider adding:
- PropTypes validation
- Default props
- Runtime checks for null/undefined values

### Suggested Component Improvements
```javascript
import PropTypes from 'prop-types';

TokenDisplay.propTypes = {
  tokenCount: PropTypes.number.isRequired,
  charCount: PropTypes.number.isRequired,
  charCountNoSpace: PropTypes.number.isRequired,
  byteSize: PropTypes.number.isRequired,
};

TokenDisplay.defaultProps = {
  tokenCount: 0,
  charCount: 0,
  charCountNoSpace: 0,
  byteSize: 0,
};
```

## Test Patterns Used

### Arrange-Act-Assert (AAA)
All tests follow the AAA pattern for clarity and maintainability.

### Descriptive Test Names
Test names clearly describe what is being tested and the expected outcome.

### Edge Case Coverage
Comprehensive edge case testing including:
- Zero values
- Null/undefined values
- Very large numbers
- Decimal numbers
- Negative numbers

### Visual Regression
Snapshot tests ensure the component structure remains consistent.

## File Location
`token-calculator/src/components/Calculator/__tests__/TokenDisplay.test.jsx`

## Dependencies
- React 19.2.0
- @testing-library/react (to be installed)
- @testing-library/jest-dom (to be installed)
- lucide-react 0.555.0 (for icons)
