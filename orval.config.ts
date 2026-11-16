import { defineConfig } from "orval";

export default defineConfig({
  formasi: {
    input: {
      target: process.env.OPENAPI_URL ?? "http://localhost:8080/v3/api-docs",
    },
    output: {
      mode: "tags-split",
      target: "src/api/generated/endpoints",
      schemas: "src/api/generated/models",
      client: "react-query",
      httpClient: "fetch",
      clean: true,
      override: {
        mutator: {
          path: "src/api/fetcher.ts",
          name: "fetcher",
        },
      },
    },
  },
});
