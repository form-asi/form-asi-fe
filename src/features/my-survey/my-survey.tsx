"use client";

import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { MySurveyCard } from "@/features/my-survey/components/my-survey-card";
import { MY_SURVEYS_MOCK } from "@/features/my-survey/mocks/my-surveys.mock";
import { MY_SURVEY_MESSAGES } from "@/features/my-survey/my-survey-messages";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import { ROUTES } from "@/lib/routes";

export function MySurvey() {
  const router = useRouter();
  const handleStartSurveyRegister = () => router.push(ROUTES.surveyRegister);

  return (
    <div className="flex flex-col gap-4 p-page-inset">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-title-md font-semibold">{MY_SURVEY_MESSAGES.title}</h1>
        <Button type="button" variant="outline" size="sm" onClick={handleStartSurveyRegister}>
          {REGISTER_MESSAGES.newSurvey}
        </Button>
      </div>
      {MY_SURVEYS_MOCK.length === 0 ? (
        <EmptyState
          title={REGISTER_MESSAGES.emptyTitle}
          description={REGISTER_MESSAGES.emptyDescription}
          action={{ label: REGISTER_MESSAGES.newSurvey, onClick: handleStartSurveyRegister }}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {MY_SURVEYS_MOCK.map((survey) => (
            <li key={survey.surveyId}>
              <MySurveyCard survey={survey} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
