/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    extends: ["universe/native"],
    rules: {
        "@typescript-eslint/no-unused-vars": [
            "warn",
            { ignoreRestSiblings: true, argsIgnorePattern: "^_$" },
        ],
    },
};
