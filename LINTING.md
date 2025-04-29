
# Code Quality Standards

This project uses ESLint to enforce code quality standards. This document explains our linting setup and how to work with it.

## ESLint Configuration

Our ESLint configuration focuses on several key areas:

1. **TypeScript Integration**: Strict type checking and preventing unsafe practices
2. **React Best Practices**: Ensuring components follow React patterns and performance considerations
3. **Accessibility**: Making our application accessible to all users
4. **Code Style**: Consistent formatting and structure
5. **Performance**: Preventing common React performance issues
6. **Import Organization**: Keeping imports clean and organized

## Available Scripts

- Run `npm run lint` to check your code for issues
- Run `npm run lint:fix` to automatically fix fixable issues

## Key Rules

### TypeScript

- Avoid using `any` type
- Document any TypeScript directive suppressions
- No unused variables (except those prefixed with `_`)

### React

- Proper hook usage and dependencies
- JSX only in `.tsx` files
- No array indices as keys (performance/correctness issue)
- Avoid inline function definitions in JSX (when possible)

### Performance

- Use memoization for expensive calculations
- Avoid unnecessary re-renders

### Accessibility

- Images must have alt text
- Interactive elements must be accessible via keyboard
- ARIA attributes must be used correctly

### Code Style

- 100 character line length (flexible for strings, URLs)
- Consistent import ordering
- Console logging limited to warn/error/info in production code

## Editor Integration

This project includes an `.editorconfig` file for basic editor settings.

For the best development experience:

1. Use VSCode with the ESLint and Prettier extensions installed
2. Enable "Format on Save" in your editor
3. Set ESLint as the default formatter for TypeScript/JavaScript files

## CI Integration

Our CI pipeline runs linting checks on all pull requests and commits to main. Code that doesn't pass linting will fail the build.
