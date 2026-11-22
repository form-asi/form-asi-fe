"use client";

import { FormProvider } from "react-hook-form";
import { AppHeader } from "@/components/common/app-header";
import { BottomCTA } from "@/components/common/bottom-cta";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { HelpTimeChip } from "@/components/domain/help-time-chip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SurveyInfoStep } from "@/features/my-survey/register/components/survey-info-step";
import { SurveyIntroStep } from "@/features/my-survey/register/components/survey-intro-step";
import { SurveyScaleStep } from "@/features/my-survey/register/components/survey-scale-step";
import { SurveyStepProgress } from "@/features/my-survey/register/components/survey-step-progress";
import { SurveyTargetStep } from "@/features/my-survey/register/components/survey-target-step";
import { useSurveyRegister } from "@/features/my-survey/register/hooks/use-survey-register";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import { SURVEY_STEPS } from "@/features/my-survey/register/survey-register-schema";
import { ROUTES } from "@/lib/routes";
import { UI_MESSAGES } from "@/lib/ui-messages";

export function SurveyRegister() {
  const registration = useSurveyRegister();
  const { form, step, dialog, balanceQuery } = registration;
  const previousStep = SURVEY_STEPS[step].previous;
  return (
    <>
      <AppHeader
        title={REGISTER_MESSAGES.title}
        back={{ onBack: () => registration.handleRequestLeave(ROUTES.mySurvey) }}
        rightSlot={
          balanceQuery.data !== undefined && (
            <div
              onClickCapture={(event) => {
                if (
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                registration.handleRequestLeave(ROUTES.helpTime);
              }}
            >
              <HelpTimeChip helpTimeBalance={balanceQuery.data} />
            </div>
          )
        }
      />
      {balanceQuery.isPending && (
        <p role="status" className="p-page-inset text-body-sm text-muted-foreground">
          {REGISTER_MESSAGES.loading}
        </p>
      )}
      {balanceQuery.isError && (
        <div className="p-page-inset">
          <EmptyState
            title={REGISTER_MESSAGES.loadFailed}
            description={balanceQuery.error.message}
            action={{
              label: UI_MESSAGES.retry,
              onClick: () => balanceQuery.refetch(),
              disabled: balanceQuery.isFetching,
            }}
          />
        </div>
      )}
      {balanceQuery.isSuccess && (
        <FormProvider {...form}>
          {balanceQuery.data < 0 && (
            <div className="p-page-inset">
              <Alert variant="destructive">
                <AlertDescription>{REGISTER_MESSAGES.negativeHelpTime}</AlertDescription>
              </Alert>
            </div>
          )}
          <div className="flex flex-col gap-8 px-page-inset pt-2 pb-10">
            <SurveyStepProgress step={step} headingRef={registration.headingRef} />
            <form
              id="survey-register"
              onSubmit={(event) => {
                event.preventDefault();
                void registration.handleContinue();
              }}
            >
              {step === "info" && <SurveyInfoStep />}
              {step === "target" && <SurveyTargetStep />}
              {step === "intro" && <SurveyIntroStep />}
              {step === "scale" && <SurveyScaleStep helpTimeBalance={balanceQuery.data} />}
            </form>
          </div>
          <BottomCTA
            primaryAction={{
              label: step === "scale" ? REGISTER_MESSAGES.register : REGISTER_MESSAGES.next,
              type: "submit",
              form: "survey-register",
              disabled: step === "scale" ? !registration.canPublish : !registration.validStep,
            }}
            secondaryAction={
              previousStep
                ? {
                    label: REGISTER_MESSAGES.previous,
                    onClick: () => registration.handleChangeStep(previousStep),
                  }
                : undefined
            }
          />
        </FormProvider>
      )}
      <ConfirmDialog
        open={dialog?.kind === "leave"}
        onOpenChange={(open) => {
          if (!open) registration.setDialog(null);
        }}
        title={REGISTER_MESSAGES.leaveTitle}
        description={REGISTER_MESSAGES.leaveDescription}
        confirmLabel={REGISTER_MESSAGES.discard}
        cancelLabel={REGISTER_MESSAGES.cancel}
        tone="negative"
        onConfirm={registration.handleConfirmLeave}
        onConfirmError={registration.handleConfirmError}
      />
      <ConfirmDialog
        open={dialog?.kind === "publish"}
        onOpenChange={(open) => {
          if (!open) registration.setDialog(null);
        }}
        title={REGISTER_MESSAGES.publishTitle}
        description={REGISTER_MESSAGES.publishDescription(registration.requiredHelpTime)}
        confirmLabel={REGISTER_MESSAGES.register}
        cancelLabel={REGISTER_MESSAGES.cancel}
        onConfirm={registration.handleConfirmPublish}
        onConfirmError={registration.handleConfirmError}
      />
    </>
  );
}
