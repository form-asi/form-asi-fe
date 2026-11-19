import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getHelpTimeBalanceMock,
  publishSurveyMock,
} from "@/features/my-survey/register/mocks/survey-register-api.mock";
import {
  createEmptySurvey,
  isSurveyStepValid,
  SURVEY_DURATION_MINUTES,
  type SurveyRegisterValues,
  surveyRegisterSchema,
} from "@/features/my-survey/register/survey-register-schema";

const validSurvey: SurveyRegisterValues = {
  ...createEmptySurvey(),
  surveyUrl: "https://example.com/survey",
  purposes: ["ACADEMIC_RESEARCH"],
  title: "테스트 설문",
  respondentCount: 5,
  durationMinutes: 3,
};

test("단계 검증은 뒤 단계의 미입력과 독립적", () => {
  const draft = { ...createEmptySurvey(), surveyUrl: "https://", purposes: ["ETC"] };
  assert.ok(isSurveyStepValid("info", draft));
  assert.ok(isSurveyStepValid("target", draft));
  assert.equal(isSurveyStepValid("intro", draft), false);
  assert.equal(isSurveyStepValid("scale", draft), false);
  assert.equal(isSurveyStepValid("info", { ...draft, surveyUrl: "http://example.com" }), false);
  assert.equal(isSurveyStepValid("info", { ...draft, purposes: [] }), false);
});

test("나이 범위·한쪽 입력·역전 검증과 오류 경로", () => {
  for (const [minimumAge, maximumAge] of [
    ["", ""],
    [14, ""],
    ["", 100],
    [14, 100],
    [29, 29],
  ]) {
    assert.ok(
      isSurveyStepValid("target", {
        target: { ...validSurvey.target, minimumAge, maximumAge },
      }),
    );
  }
  for (const [minimumAge, maximumAge] of [
    [13, ""],
    ["", 101],
    [14.5, 30],
    [30, 20],
  ]) {
    assert.equal(
      isSurveyStepValid("target", {
        target: { ...validSurvey.target, minimumAge, maximumAge },
      }),
      false,
    );
  }
  const invalidRange = surveyRegisterSchema.safeParse({
    ...validSurvey,
    target: { ...validSurvey.target, minimumAge: 30, maximumAge: 20 },
  });
  assert.equal(invalidRange.success, false);
  if (!invalidRange.success) {
    assert.ok(
      invalidRange.error.issues.some((issue) => issue.path.join(".") === "target.minimumAge"),
    );
  }
});

test("공백을 포함한 글자 수 제한과 공백뿐인 제목 거부", () => {
  for (const [field, limit] of [
    ["title", 100],
    ["description", 700],
    ["reward", 100],
  ] as const) {
    assert.ok(
      surveyRegisterSchema.safeParse({ ...validSurvey, [field]: `${"가".repeat(limit - 1)} ` })
        .success,
    );
    assert.equal(
      surveyRegisterSchema.safeParse({ ...validSurvey, [field]: `${"가".repeat(limit)} ` }).success,
      false,
    );
  }
  assert.equal(surveyRegisterSchema.safeParse({ ...validSurvey, title: "   " }).success, false);
  assert.ok(
    isSurveyStepValid("target", {
      target: { ...validSurvey.target, description: "가".repeat(200) },
    }),
  );
  assert.equal(
    isSurveyStepValid("target", {
      target: { ...validSurvey.target, description: "가".repeat(201) },
    }),
    false,
  );
});

test("소요 시간 선택지와 알 수 없는 대상 코드 검증", () => {
  for (const durationMinutes of SURVEY_DURATION_MINUTES) {
    assert.ok(surveyRegisterSchema.safeParse({ ...validSurvey, durationMinutes }).success);
  }
  for (const durationMinutes of ["", 0, 4, 61]) {
    assert.equal(
      surveyRegisterSchema.safeParse({ ...validSurvey, durationMinutes }).success,
      false,
    );
  }
  assert.equal(
    surveyRegisterSchema.safeParse({
      ...validSurvey,
      target: { ...validSurvey.target, fields: ["UNKNOWN"] },
    }).success,
    false,
  );
});

test("등록 mock의 잔액 차감·부족 재검증·실패 시 잔액 유지", async () => {
  const startingBalance = await getHelpTimeBalanceMock();
  await assert.rejects(publishSurveyMock({ ...validSurvey, title: "" }), /SURVEY_INVALID/);
  await assert.rejects(
    publishSurveyMock({ ...validSurvey, respondentCount: startingBalance + 1 }),
    /HELP_TIME_INSUFFICIENT/,
  );
  assert.equal(await getHelpTimeBalanceMock(), startingBalance);
  assert.deepEqual(await publishSurveyMock(validSurvey), { helpTimeBalance: startingBalance - 15 });
  await assert.rejects(
    publishSurveyMock({ ...validSurvey, respondentCount: startingBalance }),
    /HELP_TIME_INSUFFICIENT/,
  );
  assert.equal(await getHelpTimeBalanceMock(), startingBalance - 15);
});

test("응답 수 최소 1명·정수 제한과 대상 기타 제외", () => {
  for (const respondentCount of ["", 0, -1, 1.5, Number.POSITIVE_INFINITY]) {
    assert.equal(
      surveyRegisterSchema.safeParse({ ...validSurvey, respondentCount }).success,
      false,
    );
  }
  for (const respondentCount of [1, 100000]) {
    assert.ok(surveyRegisterSchema.safeParse({ ...validSurvey, respondentCount }).success);
  }
  for (const targetField of ["occupation", "fields", "household", "maritalStatus", "petTypes"]) {
    assert.equal(
      surveyRegisterSchema.safeParse({
        ...validSurvey,
        target: { ...validSurvey.target, [targetField]: ["ETC"] },
      }).success,
      false,
    );
  }
  assert.ok(surveyRegisterSchema.safeParse({ ...validSurvey, purposes: ["ETC"] }).success);
});
