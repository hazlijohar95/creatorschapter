# 🤝 Contributing to Creator Chapter

We love your input! We want to make contributing to Creator Chapter as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 📋 **Table of Contents**

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## 📜 **Code of Conduct**

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 **Getting Started**

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/creator-chapter.git
   cd creator-chapter
   ```
3. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```
4. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   # Fill in your Supabase credentials
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🔄 **Development Process**

We use GitHub Flow, so all code changes happen through Pull Requests:

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** following our code style guidelines
3. **Test your changes** thoroughly
4. **Commit your changes** using semantic commit messages
5. **Push to your fork** and create a Pull Request

### **Branch Naming Convention**
- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring
- `test/description` - for adding tests

### **Commit Message Format**
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add social login support
fix(dashboard): resolve data loading issue
docs(readme): update installation instructions
```

## 🔀 **Pull Request Process**

1. **Update documentation** if you've changed APIs or added features
2. **Add tests** for new functionality
3. **Ensure all tests pass**:
   ```bash
   npm test
   npm run lint
   ```
4. **Update the changelog** if needed
5. **Request review** from maintainers
6. **Address feedback** and update your PR

### **PR Requirements**
- ✅ All tests pass
- ✅ ESLint rules pass
- ✅ TypeScript compiles without errors
- ✅ Code coverage doesn't decrease
- ✅ Documentation is updated
- ✅ Semantic commit messages
- ✅ No merge conflicts

## 🎨 **Code Style**

We use ESLint and TypeScript to enforce code style:

### **TypeScript Guidelines**
- Use strict mode (configured in `tsconfig.json`)
- Avoid `any` types - use proper interfaces
- Use meaningful variable and function names
- Add type annotations for complex types

### **React Guidelines**
- Use functional components with hooks
- Follow React best practices for performance
- Use proper error boundaries
- Implement accessibility features

### **File Organization**
- Group related files in directories
- Use barrel exports (`index.ts`) for clean imports
- Separate concerns (components, hooks, services)
- Keep components small and focused

### **Styling Guidelines**
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use shadcn/ui components when possible

## 🧪 **Testing**

We use Vitest and Testing Library for testing:

### **Running Tests**
```bash
npm test                # Run all tests
npm run test:ui         # Run tests with UI
npm run test:coverage   # Run tests with coverage
```

### **Writing Tests**
- Write tests for all new features
- Test user interactions, not implementation details
- Use descriptive test names
- Mock external dependencies

### **Test Structure**
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

## 🐛 **Reporting Bugs**

We use GitHub Issues to track bugs. When reporting a bug:

### **Bug Report Template**
```markdown
## Bug Description
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]
- Node.js Version: [e.g. 18.0.0]

## Additional Context
Any other context about the problem.
```

### **Before Reporting**
- Check existing issues to avoid duplicates
- Try to reproduce the bug
- Provide minimal reproduction code if possible

## ✨ **Feature Requests**

We welcome feature requests! Use GitHub Issues with the "enhancement" label:

### **Feature Request Template**
```markdown
## Feature Description
A clear description of the feature you'd like to see.

## Problem it Solves
What problem does this feature solve?

## Proposed Solution
How would you like this feature to work?

## Alternative Solutions
Other solutions you've considered.

## Additional Context
Any other context about the feature.
```

## 🏷️ **Issue Labels**

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation needs improvement
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested
- `wontfix` - This will not be worked on

## 📖 **Documentation**

Help us improve our documentation:

- Fix typos and grammatical errors
- Add examples and clarifications
- Update outdated information
- Add missing documentation

## 🏆 **Recognition**

Contributors will be:
- Listed in our README.md
- Added to our contributors page
- Mentioned in release notes
- Invited to our contributors Discord

## 💬 **Community**

Join our community discussions:
- [GitHub Discussions](https://github.com/yourusername/creator-chapter/discussions)
- [Discord Server](https://discord.gg/creator-chapter)
- [Twitter](https://twitter.com/creatorchapter)

## ❓ **Questions?**

If you have questions about contributing:
- Check our [FAQ](https://docs.creatorchapter.com/faq)
- Ask in [GitHub Discussions](https://github.com/yourusername/creator-chapter/discussions)
- Reach out to maintainers

---

Thank you for contributing to Creator Chapter! 🎉