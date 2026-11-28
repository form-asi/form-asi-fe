import { test } from "bun:test";
import assert from "node:assert/strict";
import { type UserProfileResponse } from "@/api/generated/models";
import { toProfileUpdateRequest } from "@/components/domain/profile-form/profile-request";
import { parseCurrentProfile } from "./current-profile";

const profile: UserProfileResponse = {
  nickname: "테스트1",
  age: 29,
  gender: "FEMALE",
  occupation: "EMPLOYEE",
  fields: ["DESIGN"],
};

test("저장된 프로필의 선택 항목·기타 입력을 왕복하며 나이는 수정 요청에서 제외", () => {
  const { age, ...savedProfile } = {
    ...profile,
    occupation: "OTHER",
    occupationOther: "직업 설명",
    fields: ["DESIGN", "OTHER"],
    fieldOther: "분야 설명",
    region: "SEOUL",
    householdComposition: "OTHER",
    householdCompositionOther: "가구 설명",
    householdSize: "TWO",
    maritalStatus: "OTHER",
    maritalStatusOther: "결혼 설명",
    childrenCount: "ONE",
    petExperience: "CURRENT",
    pets: ["CAT"],
    driverLicense: "CLASS_2",
  } satisfies UserProfileResponse;
  const form = parseCurrentProfile({ data: { ...savedProfile, age } });
  assert.equal(form.age, 29);
  assert.equal(form.birthDate, undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(toProfileUpdateRequest(form))), savedProfile);
});

test("선택 항목 누락은 빈 폼 값으로 채우고 숨겨진 기타·반려동물 입력은 저장하지 않는다", () => {
  const form = parseCurrentProfile({ data: profile });
  assert.equal(form.region, "");
  assert.deepEqual(form.petTypes, []);
  const request = toProfileUpdateRequest({
    ...form,
    occupationOther: "이전 값",
    fieldsOther: "이전 값",
    householdOther: "이전 값",
    maritalStatusOther: "이전 값",
    petExperience: "NEVER",
    petTypes: ["DOG"],
  });
  assert.deepEqual(JSON.parse(JSON.stringify(request)), {
    nickname: "테스트1",
    gender: "FEMALE",
    occupation: "EMPLOYEE",
    fields: ["DESIGN"],
    petExperience: "NEVER",
    pets: [],
  });
});

test("응답 누락·필수 값 누락·유효하지 않은 나이를 UNKNOWN_ERROR로 처리", () => {
  assert.throws(() => parseCurrentProfile({}), /UNKNOWN_ERROR/);
  for (const invalid of [
    { nickname: undefined },
    { nickname: "" },
    { age: undefined },
    { age: NaN },
    { age: -1 },
    { age: 1.5 },
  ]) {
    assert.throws(() => parseCurrentProfile({ data: { ...profile, ...invalid } }), /UNKNOWN_ERROR/);
  }
});
