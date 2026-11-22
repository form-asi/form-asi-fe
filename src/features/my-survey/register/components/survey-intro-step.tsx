import { SurveyTextField } from "@/features/my-survey/register/components/survey-text-field";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";

export function SurveyIntroStep() {
  return (
    <div className="flex flex-col gap-4">
      <SurveyTextField name="title" label={REGISTER_MESSAGES.surveyTitle} limit={100} required />
      <SurveyTextField
        name="description"
        label={REGISTER_MESSAGES.description}
        limit={700}
        multiline
        required
      />
      <SurveyTextField
        name="reward"
        label={REGISTER_MESSAGES.reward}
        description={REGISTER_MESSAGES.rewardHint}
        placeholder={REGISTER_MESSAGES.rewardPlaceholder}
        limit={100}
      />
    </div>
  );
}
