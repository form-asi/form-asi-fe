"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { UI_MESSAGES } from "@/lib/ui-messages";
import { getHelpTimeBalanceMock, publishSurveyMock } from "../api/survey-register-api.mock";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "../model/survey-register-messages";
import {
  createEmptySurvey,
  isSurveyStepValid,
  SURVEY_STEP_FIELDS,
  SURVEY_STEPS,
  type SurveyRegisterStep,
  type SurveyRegisterValues,
  surveyRegisterSchema,
} from "../model/survey-register-schema";
import { useLeaveGuard } from "./use-leave-guard";

type RegisterDialog = { kind: "leave"; destination: string } | { kind: "publish" } | null;
const BALANCE_QUERY_KEY = ["survey-register", "help-time-balance"] as const;

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
  const balanceQuery = useQuery({ queryKey: BALANCE_QUERY_KEY, queryFn: getHelpTimeBalanceMock });
  const publishMutation = useMutation({ mutationFn: publishSurveyMock });
  const draft = useWatch({ control: form.control });
  const requiredHelpTime = Number(draft.respondentCount) * Number(draft.durationMinutes);
  const validStep = isSurveyStepValid(step, draft);
  const canPublish =
    validStep &&
    Number.isSafeInteger(requiredHelpTime) &&
    requiredHelpTime > 0 &&
    balanceQuery.data !== undefined &&
    balanceQuery.data >= requiredHelpTime;
  const { releaseLeaveGuard } = useLeaveGuard(() => handleRequestLeave("/my-survey"));

  function handleChangeStep(nextStep: SurveyRegisterStep) {
    setStep(nextStep);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  async function leaveRegistration(destination: string) {
    if (leaving.current) return;
    leaving.current = true;
    await releaseLeaveGuard();
    form.reset(createEmptySurvey());
    setStep("info");
    setDialog(null);
    router.replace(destination);
    leaving.current = false;
  }

  function handleRequestLeave(destination: string) {
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
    const published = await publishMutation.mutateAsync(survey);
    queryClient.setQueryData(BALANCE_QUERY_KEY, published.helpTimeBalance);
    await leaveRegistration("/my-survey");
    toast.success(UI_MESSAGES.toast.surveyPublished);
  }

  function handleConfirmError(error: unknown) {
    toast.error(error instanceof Error ? error.message : REGISTER_MESSAGES.unknownError);
  }

  return {
    form,
    step,
    dialog,
    setDialog,
    headingRef,
    balanceQuery,
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
