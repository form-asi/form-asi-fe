import { test } from "bun:test";
import assert from "node:assert/strict";
import {
  createEmptySurvey,
  type SurveyRegisterValues,
} from "@/features/my-survey/register/survey-register-schema";
import { toSurveyCreateRequest } from "./survey-create-request";

const survey: SurveyRegisterValues = {
  ...createEmptySurvey(),
  surveyUrl: "https://example.com/survey",
  purpose: { code: "ACADEMIC_RESEARCH", etcText: "" },
  format: { code: "MULTIPLE_CHOICE", etcText: "" },
  title: "설문 제목",
  description: "설문 소개",
  respondentCount: 5,
  durationMinutes: 3,
};

test("누구나 대상은 숨겨진 조건과 선택하지 않은 기타 입력을 전송하지 않는다", () => {
  const request = toSurveyCreateRequest({
    ...survey,
    purpose: { ...survey.purpose, etcText: "이전 목적" },
    format: { ...survey.format, etcText: "이전 형식" },
    target: {
      ...survey.target,
      minimumAge: 20,
      maximumAge: 30,
      occupation: ["EMPLOYEE"],
      description: "이전 조건",
    },
  });
  assert.deepEqual(request, {
    externalUrl: "https://example.com/survey",
    purpose: "ACADEMIC_RESEARCH",
    method: "MULTIPLE_CHOICE",
    title: "설문 제목",
    introduction: "설문 소개",
    targetCount: 5,
    durationMinutes: 3,
  });
});

test("조건 대상의 모든 항목을 서버 키와 코드로 매핑", () => {
  const request = toSurveyCreateRequest({
    ...survey,
    target: {
      audience: "CONDITIONAL",
      minimumAge: 20,
      maximumAge: 30,
      gender: ["FEMALE"],
      occupation: ["EMPLOYEE"],
      fields: ["SOFTWARE_DEVELOPMENT", "DESIGN"],
      region: ["SEOUL"],
      household: ["WITH_SPOUSE_ONLY"],
      householdSize: ["TWO"],
      maritalStatus: ["MARRIED"],
      children: ["ONE"],
      petExperience: ["CURRENT"],
      petTypes: ["DOG"],
      drivingLicense: ["CLASS_1"],
      description: "서비스 이용자",
    },
  });
  assert.equal(request.minAge, 20);
  assert.equal(request.maxAge, 30);
  assert.equal(request.targetDescription, "서비스 이용자");
  assert.deepEqual(request.targetConditions, {
    GENDER: ["FEMALE"],
    OCCUPATION: ["EMPLOYEE"],
    FIELD: ["SOFTWARE_DEVELOPMENT", "DESIGN"],
    REGION: ["SEOUL"],
    HOUSEHOLD_COMPOSITION: ["WITH_SPOUSE_ONLY"],
    HOUSEHOLD_SIZE: ["TWO"],
    MARITAL_STATUS: ["MARRIED"],
    CHILDREN_COUNT: ["ONE"],
    PET_EXPERIENCE: ["CURRENT"],
    PET_TYPE: ["DOG"],
    DRIVER_LICENSE: ["CLASS_1"],
  });
});

test("기타 목적·형식과 보상은 보존하고 비어 있는 나이·선택 조건은 생략", () => {
  const request = toSurveyCreateRequest({
    ...survey,
    purpose: { code: "OTHER", etcText: "졸업 프로젝트" },
    format: { code: "OTHER", etcText: "현장 참여" },
    reward: "추첨 보상",
    target: { ...survey.target, audience: "CONDITIONAL", maximumAge: 60 },
  });
  assert.equal(request.purposeOther, "졸업 프로젝트");
  assert.equal(request.methodOther, "현장 참여");
  assert.equal(request.rewardDescription, "추첨 보상");
  assert.equal(request.maxAge, 60);
  for (const omitted of ["minAge", "targetConditions", "targetDescription"]) {
    assert.equal(omitted in request, false, omitted);
  }
  const singleCondition = toSurveyCreateRequest({
    ...survey,
    target: { ...survey.target, audience: "CONDITIONAL", gender: ["MALE"] },
  });
  assert.deepEqual(singleCondition.targetConditions, { GENDER: ["MALE"] });
});

test("미입력 코드·숫자를 요청으로 변환하지 않는다", () => {
  for (const incomplete of [
    { ...survey, purpose: { code: "", etcText: "" } },
    { ...survey, format: { code: "", etcText: "" } },
    { ...survey, respondentCount: "" },
    { ...survey, durationMinutes: "" },
  ] satisfies SurveyRegisterValues[]) {
    assert.throws(() => toSurveyCreateRequest(incomplete), /필수 항목/);
  }
});
