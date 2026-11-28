import { defineConfig } from "orval";

// Swagger가 Basic 인증 뒤에 있어 URL의 계정 정보를 헤더로 옮긴다 (Orval fetch는 URL 계정 정보를 보내지 않음)
const specUrl = new URL(process.env.OPENAPI_URL ?? "http://localhost:8080/v3/api-docs");
const basicAuth = specUrl.username
  ? `Basic ${btoa(`${decodeURIComponent(specUrl.username)}:${decodeURIComponent(specUrl.password)}`)}`
  : undefined;
specUrl.username = "";
specUrl.password = "";

export default defineConfig({
  formasi: {
    input: {
      target: specUrl.toString(),
      parserOptions: basicAuth
        ? { headers: [{ domains: [specUrl.hostname], headers: { Authorization: basicAuth } }] }
        : undefined,
    },
    output: {
      mode: "tags-split",
      target: "src/api/generated/endpoints",
      schemas: "src/api/generated/models",
      client: "react-query",
      httpClient: "fetch",
      clean: true,
      override: {
        // 응답 본문(BaseResponse)만 돌려받고 HTTP 오류는 fetcher가 ApiError로 던진다
        fetch: { includeHttpResponseReturnType: false },
        mutator: {
          path: "src/api/fetcher.ts",
          name: "fetcher",
        },
      },
    },
  },
});
