import {
  type SurveyCreateRequest,
  SurveyCreateRequestMethod,
  SurveyCreateRequestPurpose,
} from "@/api/generated/models";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import { type SurveyRegisterValues } from "@/features/my-survey/register/survey-register-schema";

/** @description 검증된 폼 값을 등록 요청으로 변환하고 숨겨진 조건·기타 입력을 제외한다. */
export function toSurveyCreateRequest(survey: SurveyRegisterValues): SurveyCreateRequest {
  const { purpose, format, respondentCount, durationMinutes, target } = survey;
  if (
    purpose.code === "" ||
    format.code === "" ||
    respondentCount === "" ||
    durationMinutes === ""
  ) {
    throw new Error(REGISTER_MESSAGES.requiredError);
  }
  const request: SurveyCreateRequest = {
    externalUrl: survey.surveyUrl,
    purpose: purpose.code,
    ...(purpose.code === SurveyCreateRequestPurpose.OTHER ? { purposeOther: purpose.etcText } : {}),
    method: format.code,
    ...(format.code === SurveyCreateRequestMethod.OTHER ? { methodOther: format.etcText } : {}),
    title: survey.title,
    introduction: survey.description,
    ...(survey.reward ? { rewardDescription: survey.reward } : {}),
    targetCount: respondentCount,
    durationMinutes,
  };
  if (target.audience === "ANYONE") return request;

  const targetConditions = Object.fromEntries(
    Object.entries({
      GENDER: target.gender,
      OCCUPATION: target.occupation,
      FIELD: target.fields,
      REGION: target.region,
      HOUSEHOLD_COMPOSITION: target.household,
      HOUSEHOLD_SIZE: target.householdSize,
      MARITAL_STATUS: target.maritalStatus,
      CHILDREN_COUNT: target.children,
      PET_EXPERIENCE: target.petExperience,
      PET_TYPE: target.petTypes,
      DRIVER_LICENSE: target.drivingLicense,
    }).filter(([, codes]) => codes.length > 0),
  );
  return {
    ...request,
    ...(target.minimumAge !== "" ? { minAge: target.minimumAge } : {}),
    ...(target.maximumAge !== "" ? { maxAge: target.maximumAge } : {}),
    ...(Object.keys(targetConditions).length > 0 ? { targetConditions } : {}),
    ...(target.description ? { targetDescription: target.description } : {}),
  };
}
