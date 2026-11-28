import { test } from "bun:test";
import assert from "node:assert/strict";
import { type ProfileOptions } from "@/components/domain/profile-form/profile-options-schema";
import { getSurveyTargetOptions } from "./survey-target-options";

test("대상 선택지는 서버 코드·라벨을 유지하면서 기타만 제외", () => {
  const options: ProfileOptions = {
    genders: [{ value: "FEMALE", label: "서버 성별" }],
    occupations: [
      { value: "EMPLOYEE", label: "서버 직업" },
      { value: "OTHER", label: "기타" },
    ],
    fields: [
      { value: "SOFTWARE_DEVELOPMENT", label: "서버 분야" },
      { value: "OTHER", label: "기타" },
    ],
    regions: [],
    householdCompositions: [{ value: "OTHER", label: "기타" }],
    householdSizes: [],
    maritalStatuses: [{ value: "OTHER", label: "기타" }],
    childrenCounts: [],
    petExperiences: [],
    petTypes: [{ value: "OTHER", label: "기타" }],
    driverLicenses: [],
  };
  const targetOptions = getSurveyTargetOptions(options);
  assert.deepEqual(targetOptions.gender, options.genders);
  assert.deepEqual(targetOptions.occupation, [{ value: "EMPLOYEE", label: "서버 직업" }]);
  assert.deepEqual(targetOptions.fields, [{ value: "SOFTWARE_DEVELOPMENT", label: "서버 분야" }]);
  assert.deepEqual(targetOptions.household, []);
  assert.deepEqual(targetOptions.maritalStatus, []);
  assert.deepEqual(targetOptions.petTypes, []);
  assert.equal(options.occupations.length, 2);
});
