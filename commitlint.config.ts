import { type UserConfig } from "@commitlint/types";

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "refactor", "style", "docs", "test", "chore"]],
    // 한국어 요약을 쓰므로 영문 대소문자 규칙은 적용하지 않음
    "subject-case": [0],
    "header-max-length": [2, "always", 72],
  },
} satisfies UserConfig;
