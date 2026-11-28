import { test } from "bun:test";
import assert from "node:assert/strict";
import { type ProfileOptionsResponse } from "@/api/generated/models";
import { parseProfileOptions } from "./profile-options-schema";

const options: ProfileOptionsResponse = {
  genders: [{ code: "FEMALE", label: "서버 성별 라벨" }],
  occupations: [{ code: "EMPLOYEE", label: "직장인" }],
  fields: [{ code: "SOFTWARE_DEVELOPMENT", label: "개발" }],
  regions: [{ code: "SEOUL", label: "서울" }],
  householdCompositions: [{ code: "LIVING_ALONE", label: "1인 가구" }],
  householdSizes: [{ code: "ONE", label: "1명" }],
  maritalStatuses: [{ code: "UNMARRIED", label: "미혼" }],
  childrenCounts: [{ code: "NONE", label: "없음" }],
  petExperiences: [{ code: "NEVER", label: "없음" }],
  petTypes: [{ code: "DOG", label: "강아지" }],
  driverLicenses: [{ code: "NONE", label: "없음" }],
};

test("프로필 선택지는 서버 코드와 라벨을 유지하고 누락·알 수 없는 코드를 거부", () => {
  assert.deepEqual(parseProfileOptions({ data: options }).genders, [
    { value: "FEMALE", label: "서버 성별 라벨" },
  ]);
  for (const invalidOptions of [
    undefined,
    {},
    { ...options, genders: [] },
    {
      ...options,
      occupations: [{ code: "EMPLOYED", label: "이전 코드" }],
    },
    { ...options, fields: [{ code: "DESIGN" }] },
  ]) {
    assert.throws(() => parseProfileOptions({ data: invalidOptions }), /UNKNOWN_ERROR/);
  }
});
