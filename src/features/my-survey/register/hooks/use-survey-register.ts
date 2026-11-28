"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ApiError } from "@/api/fetcher";
import { useRegister } from "@/api/generated/endpoints/survey/survey";
import { getMeQueryKey, useMe, useProfileOptions } from "@/api/generated/endpoints/user/user";
import { parseProfileOptions } from "@/components/domain/profile-form/profile-options-schema";
import { useLeaveGuard } from "@/features/my-survey/register/hooks/use-leave-guard";
import { toSurveyCreateRequest } from "@/features/my-survey/register/lib/survey-create-request";
import { getHelpTimeCost } from "@/features/my-survey/register/lib/survey-help-time-cost";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import {
  createEmptySurvey,
  isSurveyStepValid,
  SURVEY_STEP_FIELDS,
  SURVEY_STEPS,
  type SurveyRegisterStep,
  type SurveyRegisterValues,
  surveyRegisterSchema,
} from "@/features/my-survey/register/survey-register-schema";
import {
  getSurveyTargetOptions,
  type SurveyTargetOptions,
} from "@/features/my-survey/register/survey-target-options";
import { type AppRoute, ROUTES } from "@/lib/routes";
import { UI_MESSAGES } from "@/lib/ui-messages";

type RegisterDialog = { kind: "leave"; destination: AppRoute } | { kind: "publish" } | null;
const INSUFFICIENT_HELP_TIME = "INSUFFICIENT_HELP_TIME";

export function useSurveyRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<SurveyRegisterValues>({
    resolver: zodResolver(surveyRegisterSchema),
    defaultValues: createEmptySurvey(),
    mode: "onChange",
  });
  const { isDirty } = form.formState;
  const [step, setStep] = useState<SurveyRegisterStep>("info");
  const [dialog, setDialog] = useState<RegisterDialog>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leaving = useRef(false);
  const balanceQuery = useMe<number, Error>({
    query: {
      select: (response) => {
        const helpTimeBalance = response.data?.helpTimeMinutes;
        if (typeof helpTimeBalance !== "number" || !Number.isFinite(helpTimeBalance)) {
          throw new Error(REGISTER_MESSAGES.unknownError);
        }
        return helpTimeBalance;
      },
    },
  });
  const targetOptionsQuery = useProfileOptions<SurveyTargetOptions, Error>({
    query: { select: (response) => getSurveyTargetOptions(parseProfileOptions(response)) },
  });
  const publishMutation = useRegister<Error>();
  const draft = useWatch({ control: form.control });
  const validStep = isSurveyStepValid(step, draft);
  const helpTimeCost =
    balanceQuery.data === undefined ? null : getHelpTimeCost(draft, balanceQuery.data);
  const canPublish = validStep && helpTimeCost?.status === "affordable";
  const requiredHelpTime =
    helpTimeCost && helpTimeCost.status !== "incomplete" ? helpTimeCost.requiredHelpTime : 0;
  const { releaseLeaveGuard } = useLeaveGuard(() => handleRequestLeave(ROUTES.mySurvey));

  function handleChangeStep(nextStep: SurveyRegisterStep) {
    setStep(nextStep);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  async function leaveRegistration(destination: AppRoute) {
    if (leaving.current) return;
    leaving.current = true;
    await releaseLeaveGuard();
    form.reset(createEmptySurvey());
    setStep("info");
    setDialog(null);
    router.replace(destination);
    leaving.current = false;
  }

  function handleRequestLeave(destination: AppRoute) {
    if (publishMutation.isPending || leaving.current) return;
    if (step === "info" && !isDirty) {
      void leaveRegistration(destination);
      return;
    }
    setDialog({ kind: "leave", destination });
  }

  async function handleContinue() {
    if (step === "scale") {
      if (canPublish) await form.handleSubmit(() => setDialog({ kind: "publish" }))();
      return;
    }
    const valid = await form.trigger([...SURVEY_STEP_FIELDS[step]], { shouldFocus: true });
    const nextStep = SURVEY_STEPS[step].next;
    if (valid && nextStep) handleChangeStep(nextStep);
  }

  async function handleConfirmPublish() {
    const survey = form.getValues();
    await publishMutation.mutateAsync({ data: toSurveyCreateRequest(survey) });
    await queryClient.invalidateQueries({ queryKey: getMeQueryKey() });
    await leaveRegistration(ROUTES.mySurvey);
    toast.success(UI_MESSAGES.toast.surveyPublished);
  }

  function handleConfirmError(error: unknown) {
    if (dialog?.kind === "publish") setDialog(null);
    if (error instanceof ApiError && error.message === INSUFFICIENT_HELP_TIME) {
      void queryClient.invalidateQueries({ queryKey: getMeQueryKey() });
    }
    toast.error(error instanceof Error ? error.message : REGISTER_MESSAGES.unknownError);
  }

  return {
    form,
    step,
    dialog,
    setDialog,
    headingRef,
    balanceQuery,
    targetOptionsQuery,
    requiredHelpTime,
    validStep,
    canPublish,
    handleChangeStep,
    handleRequestLeave,
    handleContinue,
    handleConfirmPublish,
    handleConfirmError,
    handleConfirmLeave: () =>
      dialog?.kind === "leave" ? leaveRegistration(dialog.destination) : undefined,
  };
}
