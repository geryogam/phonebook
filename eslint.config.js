import eslint from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  eslint.configs.all,
  prettier,
  {
    languageOptions: {
      globals: {...globals.node},
    },
    rules: {
      "func-names": ["error", "as-needed"],
      "lines-between-class-members": [
        "error",
        "always",
        {exceptAfterSingleLine: true},
      ],
      "newline-per-chained-call": "off",
      "no-console": "off",
      "no-magic-numbers": ["error", {ignoreClassFieldInitialValues: true}],
      "one-var": ["error", "never"],
      "radix": ["error", "as-needed"],
      "sort-imports": ["error", {allowSeparatedGroups: true}],
      "sort-keys": "off",
    },
  },
  {
    files: ["test/**/*.js"],
    rules: {
      "max-lines": "off",
    },
  },
];
