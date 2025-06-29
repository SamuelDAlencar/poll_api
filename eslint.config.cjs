module.exports = [
  {
    ...require("eslint-config-love"),
    files: ["**/*.js", "**/*.ts"],
    rules: {
      semi: "error",
      "prefer-const": "error",
      indent: ["error", 2],
    },
    parserOptions: {
      project: './tsconfig.eslint.json'
    },
  },
];
