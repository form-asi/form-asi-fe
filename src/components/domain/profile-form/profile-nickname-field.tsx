"use client";

import { useId } from "react";
import { useFormContext } from "react-hook-form";
import { FieldMessage, FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROFILE_MESSAGES } from "./profile-messages";
import { nicknameSchema, type ProfileValues } from "./profile-schema";
import { type useNicknameCheck } from "./use-nickname-check";

type ProfileNicknameFieldProps = {
  nicknameVerification: ReturnType<typeof useNicknameCheck>;
  isNicknameConfirmed: boolean;
};

export function ProfileNicknameField({
  nicknameVerification,
  isNicknameConfirmed,
}: ProfileNicknameFieldProps) {
  const { control, formState } = useFormContext<ProfileValues>();
  const statusId = useId();
  const { nicknameCheck, invalidateNicknameCheck, handleCheckNickname } = nicknameVerification;
  const isChecking = nicknameCheck.status === "checking";
  const hasCheckError = nicknameCheck.status === "taken" || nicknameCheck.status === "error";
  let statusMessage: string | undefined;
  if (nicknameCheck.status === "available") statusMessage = PROFILE_MESSAGES.nicknameAvailable;
  if (nicknameCheck.status === "taken") statusMessage = PROFILE_MESSAGES.nicknameTaken;
  if (nicknameCheck.status === "error") statusMessage = nicknameCheck.code;

  return (
    <FormField
      control={control}
      name="nickname"
      label={PROFILE_MESSAGES.nickname}
      required
      render={({ field, controlProps }) => (
        <>
          <Input
            {...field}
            {...controlProps}
            autoComplete="nickname"
            placeholder={PROFILE_MESSAGES.nicknamePlaceholder}
            aria-invalid={controlProps["aria-invalid"] || hasCheckError}
            aria-describedby={
              [controlProps["aria-describedby"], statusMessage ? statusId : undefined]
                .filter(Boolean)
                .join(" ") || undefined
            }
            onChange={(event) => {
              invalidateNicknameCheck();
              field.onChange(event);
            }}
            endAdornment={
              <Button
                type="button"
                variant="inverse"
                size="xs"
                className="rounded-sm px-2.5"
                disabled={
                  isChecking ||
                  isNicknameConfirmed ||
                  formState.isSubmitting ||
                  !nicknameSchema.safeParse(field.value).success
                }
                onClick={() => handleCheckNickname(field.value)}
              >
                {isChecking ? PROFILE_MESSAGES.checkingNickname : PROFILE_MESSAGES.checkNickname}
              </Button>
            }
          />
          {statusMessage && (
            <FieldMessage id={statusId} tone={hasCheckError ? "error" : "success"}>
              {statusMessage}
            </FieldMessage>
          )}
        </>
      )}
    />
  );
}
