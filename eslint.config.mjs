import pluginQuery from "@tanstack/eslint-plugin-query";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import betterTailwind from "eslint-plugin-better-tailwindcss";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  ...pluginQuery.configs["flat/recommended"],
  {
    files: ["**/*.{ts,tsx}"],
    ...betterTailwind.configs.recommended,
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/app/globals.css",
        selectors: {
          extends: [{ kind: "variable", name: ".*Styles$", match: [{ type: "objectValues" }] }],
        },
      },
    },
    rules: {
      ...betterTailwind.configs.recommended.rules,
      // Biome이 줄바꿈을 담당하므로 충돌 방지
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "src/api/generated/**"]),
]);
