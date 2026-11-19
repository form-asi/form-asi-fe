"use client";

import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/common/empty-state";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";

export function MySurvey() {
  const router = useRouter();
  return (
    <div className="p-page-inset">
      <EmptyState
        title={REGISTER_MESSAGES.emptyTitle}
        description={REGISTER_MESSAGES.emptyDescription}
        action={{
          label: REGISTER_MESSAGES.newSurvey,
          onClick: () => router.push("/my-survey/new"),
        }}
      />
    </div>
  );
}
