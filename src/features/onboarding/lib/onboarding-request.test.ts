import { test } from "bun:test";
import assert from "node:assert/strict";
import {
  createEmptyProfile,
  type ProfileValues,
} from "@/components/domain/profile-form/profile-schema";
import { toOnboardingRequest } from "./onboarding-request";

const profile: ProfileValues = {
  ...createEmptyProfile(),
  age: undefined,
  nickname: "폼앗이",
  birthDate: "2000-02-29",
  gender: "FEMALE",
  occupation: "EMPLOYEE",
  fields: ["SOFTWARE_DEVELOPMENT"],
};

test("온보딩 요청은 생년월일과 서버 코드를 보내고 나이·숨긴 입력은 제외", () => {
  const request = toOnboardingRequest({
    ...profile,
    occupationOther: "숨긴 내용",
    fieldsOther: "숨긴 내용",
    petExperience: "NEVER",
    petTypes: ["DOG"],
  });
  assert.deepEqual(JSON.parse(JSON.stringify(request)), {
    nickname: "폼앗이",
    birthDate: "2000-02-29",
    gender: "FEMALE",
    occupation: "EMPLOYEE",
    fields: ["SOFTWARE_DEVELOPMENT"],
    petExperience: "NEVER",
    pets: [],
  });
});

test("기타·선택 항목은 API 필드명에 맞춰 전송", () => {
  const request = toOnboardingRequest({
    ...profile,
    occupation: "OTHER",
    occupationOther: "직업 설명",
    fields: ["OTHER"],
    fieldsOther: "분야 설명",
    household: "OTHER",
    householdOther: "가구 설명",
    maritalStatus: "OTHER",
    maritalStatusOther: "결혼 설명",
    children: "ONE",
    drivingLicense: "CLASS_2",
    petExperience: "CURRENT",
    petTypes: ["CAT"],
  });
  assert.equal(request.occupationOther, "직업 설명");
  assert.equal(request.fieldOther, "분야 설명");
  assert.equal(request.householdCompositionOther, "가구 설명");
  assert.equal(request.maritalStatusOther, "결혼 설명");
  assert.equal(request.childrenCount, "ONE");
  assert.equal(request.driverLicense, "CLASS_2");
  assert.deepEqual(request.pets, ["CAT"]);
});
