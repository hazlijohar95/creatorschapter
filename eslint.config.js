import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

// Basic configuration without complex TypeScript rules that cause conflicts
export default tseslint.config(
  { ignores: ["dist", "node_modules", "*.config.*"] },
  {
    extends: [js.configs.recommended],
    files: ["**/*.{ts,tsx,js,jsx}"],
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
        }
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "react": reactPlugin,
      "import": importPlugin,
      "@typescript-eslint": tseslint.plugin
    },
    rules: {
      // Error prevention
      "no-unused-vars": "off", // TypeScript handles this
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      
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
      
      // Import organization - simplified to avoid resolver issues
      "import/no-duplicates": "error",
      
      // Performance
      "react/no-array-index-key": "warn",
      "react/jsx-no-bind": ["warn", { "allowArrowFunctions": true }],
      
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
    settings: {
      react: {
        version: "detect",
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