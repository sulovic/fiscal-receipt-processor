import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  // Apply to all TS files
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser, // Use the actual parser object
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
        project: "./tsconfig.json", // optional type-aware linting
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // Node / JS
      "no-console": "off",
      "no-empty-function": "warn",
      "no-var": "error",
      "prefer-const": "warn",

      // Backend / Express
      "consistent-return": "off",
    },
  },

  // Apply to JS files if needed
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
    },
    rules: {
      "no-console": "off",
      "no-var": "error",
      "prefer-const": "warn",
      "no-empty-function": "warn",
      "consistent-return": "warn",
    },
  },

  // Ignore build and dependencies
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
