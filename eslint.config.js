import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default {
  root: true,
  parser: tsParser,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ["dist", "node_modules"],
  plugins: ["@typescript-eslint", "react-hooks", "react-refresh"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-refresh/recommended",
  ],
  rules: {
    // TypeScript
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    
    // React Hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // React Refresh
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

    // JS / general
    "no-console": "warn",
    "no-debugger": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        // règles spécifiques TypeScript ici
      },
    },
  ],
};
