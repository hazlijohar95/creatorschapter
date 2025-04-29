
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import a11yPlugin from "eslint-plugin-jsx-a11y";
import tailwindPlugin from "eslint-plugin-tailwindcss";
import tseslint from "typescript-eslint";

// Rules shared across multiple configurations
const sharedRules = {
  // Error prevention
  "no-unused-vars": "off", // TypeScript handles this
  "@typescript-eslint/no-unused-vars": ["warn", { 
    "argsIgnorePattern": "^_",
    "varsIgnorePattern": "^_",
    "caughtErrorsIgnorePattern": "^_"
  }],
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/ban-ts-comment": ["error", { 
    "ts-ignore": "allow-with-description" 
  }],
  
  // Code style and readability
  "max-len": ["warn", { "code": 100, "ignoreComments": true, "ignoreStrings": true, "ignoreUrls": true }],
  "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
  
  // React specific rules
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "warn",
  "react/prop-types": "off", // TypeScript handles this
  "react/react-in-jsx-scope": "off", // Not needed in React 17+
  "react/jsx-filename-extension": ["warn", { "extensions": [".tsx"] }],
  "react/jsx-no-target-blank": "error",
  
  // Import organization
  "import/order": ["warn", {
    "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
    "newlines-between": "always",
    "alphabetize": { "order": "asc", "caseInsensitive": true }
  }],
  "import/no-duplicates": "error",
  
  // Performance
  "react/no-array-index-key": "warn",
  "react/jsx-no-bind": ["warn", { "allowArrowFunctions": true }],
  
  // Accessibility
  "jsx-a11y/alt-text": "error",
  "jsx-a11y/anchor-has-content": "error",
  "jsx-a11y/anchor-is-valid": "error",
  "jsx-a11y/aria-props": "error",
  "jsx-a11y/aria-role": "error",
  "jsx-a11y/role-has-required-aria-props": "error",
  
  // Tailwind
  "tailwindcss/no-custom-classname": "warn",
  "tailwindcss/classnames-order": "warn"
};

export default tseslint.config(
  { ignores: ["dist", "node_modules", "*.config.*"] },
  {
    extends: [
      js.configs.recommended, 
      ...tseslint.configs.recommended,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        project: "./tsconfig.json"
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "react": reactPlugin,
      "import": importPlugin,
      "jsx-a11y": a11yPlugin,
      "tailwindcss": tailwindPlugin,
      "@typescript-eslint": tseslint.plugin
    },
    rules: {
      ...sharedRules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json"
        }
      }
    }
  },
  // Configuration for test files
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "**/tests/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      // Relaxed rules for test files
      "max-len": "off",
      "no-console": "off"
    }
  }
);
