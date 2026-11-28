"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type FormEvent, useId, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { BottomCTA } from "@/components/common/bottom-cta";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PROFILE_MESSAGES } from "./profile-messages";
import { ProfileNicknameField } from "./profile-nickname-field";
import { ProfileOptionalFields } from "./profile-optional-fields";
import { type ProfileOptions } from "./profile-options-schema";
import { ProfileRequiredFields } from "./profile-required-fields";
import { type ProfileValues, profileSchema } from "./profile-schema";
import { useNicknameCheck } from "./use-nickname-check";

type ProfileFormProps = {
  initialProfile: ProfileValues;
  options: ProfileOptions;
  confirmedNickname?: string;
  requireChanges?: boolean;
  submitLabel: string;
  checkNickname: (nickname: string) => Promise<{ available: boolean }>;
  onSaveProfile: (profile: ProfileValues) => Promise<void>;
};

/** @description S-02·S-43 공용 입력 폼. 조회·저장과 이후 이동은 호출 화면에서 처리 */
export function ProfileForm({
  initialProfile,
  options,
  confirmedNickname,
  requireChanges = false,
  submitLabel,
  checkNickname,
  onSaveProfile,
}: ProfileFormProps) {
  const formId = useId();
  const submissionInFlight = useRef(false);
  const [saveError, setSaveError] = useState<string>();
  const form = useForm<ProfileValues>({
    defaultValues: initialProfile,
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  });
  const nickname = useWatch({ control: form.control, name: "nickname" });
  const nicknameVerification = useNicknameCheck(checkNickname);
  const { nicknameCheck } = nicknameVerification;
  const isNicknameConfirmed =
    nickname === confirmedNickname ||
    (nicknameCheck.status === "available" && nicknameCheck.nickname === nickname);
  const { isValid, isDirty, isSubmitting } = form.formState;
  const canSaveProfile = isValid && isNicknameConfirmed && (!requireChanges || isDirty);

  async function handleSaveProfile(profile: ProfileValues) {
    if (!canSaveProfile) return;
    setSaveError(undefined);
    try {
      await onSaveProfile(profile);
      form.reset(profile);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : PROFILE_MESSAGES.unknownError);
    }
  }

  async function handleSubmitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionInFlight.current) return;
    submissionInFlight.current = true;
    try {
      await form.handleSubmit(handleSaveProfile)(event);
    } finally {
      submissionInFlight.current = false;
    }
  }

  return (
    <FormProvider {...form}>
      <form id={formId} onSubmit={handleSubmitProfile} noValidate>
        <fieldset
          disabled={isSubmitting}
          className="flex min-w-0 flex-col gap-4 px-page-inset pt-2 pb-10"
        >
          <p
            role="note"
            className="rounded-sm bg-cautionary-subtle p-3 text-caption-lg font-medium text-cautionary"
          >
            {PROFILE_MESSAGES.intro}
          </p>
          <ProfileNicknameField
            nicknameVerification={nicknameVerification}
            isNicknameConfirmed={isNicknameConfirmed}
          />
          <ProfileRequiredFields options={options} />
          <ProfileOptionalFields options={options} />
          {saveError && (
            <Alert variant="destructive">
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}
        </fieldset>
      </form>
      <BottomCTA
        primaryAction={{
          label: submitLabel,
          type: "submit",
          form: formId,
          disabled: !canSaveProfile || isSubmitting,
        }}
      />
    </FormProvider>
  );
}
