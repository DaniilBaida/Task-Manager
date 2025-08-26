import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jest from "eslint-plugin-jest";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
    {
        ignores: ["dist/"],
    },
    { files: ["src/**/*.{js,ts}"] },
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: "./tsconfig.json",
            },
        },
    },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["src/tests/**/*.{js,ts}"],
        ...jest.configs["flat/recommended"],
        rules: {
            ...jest.configs["flat/recommended"].rules,
            "jest/prefer-expect-assertions": "off",
        },
    },
    {
        rules: {
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "prettier/prettier": [
                "error",
                {
                    endOfLine: "auto",
                },
            ],
        },
    },
    eslintPluginPrettierRecommended,
];
