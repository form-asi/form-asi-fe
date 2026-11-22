"use client";

import { type ReactNode, useId } from "react";
import {
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from "react-hook-form";
import CircleCheckFillIcon from "@/assets/icons/circle-check-fill.svg";
import CircleExclamationFillIcon from "@/assets/icons/circle-exclamation-fill.svg";
import { UI_MESSAGES } from "@/lib/ui-messages";
import { cn } from "@/lib/utils";

export type FieldControlProps = {
  id: string;
  "aria-labelledby": string;
  "aria-describedby": string | undefined;
  "aria-invalid": boolean;
  "aria-required": boolean;
};

type FormFieldProps<
  FormValues extends FieldValues,
  FieldName extends FieldPath<FormValues>,
  TransformedValues,
> = Pick<
  UseControllerProps<FormValues, FieldName, TransformedValues>,
  "name" | "disabled" | "shouldUnregister"
> & {
  control: NonNullable<UseControllerProps<FormValues, FieldName, TransformedValues>["control"]>;
  label: string;
  labelHint?: string;
  required?: boolean;
  /** 라벨을 화면에서 숨기고 스크린 리더에만 읽힘 (예: 기타 직접 입력칸) */
  hideLabel?: boolean;
  /** 선택 항목 옆 "선택" 표시. 묶음 제목에 이미 "선택"이 있으면 끈다 */
  showOptionalTag?: boolean;
  description?: string;
  render: (props: {
    field: ControllerRenderProps<FormValues, FieldName>;
    controlProps: FieldControlProps;
  }) => ReactNode;
};

/**
 * @description RHF 상태와 라벨·설명·오류의 접근성 연결. required는 표시용, 검증은 폼의 zod 스키마 담당
 * @example <FormField control={form.control} name="nickname" label="닉네임" required render={({ field, controlProps }) => <Input {...field} {...controlProps} />} />
 */
function FormField<
  FormValues extends FieldValues,
  FieldName extends FieldPath<FormValues>,
  TransformedValues = FormValues,
>({
  control,
  name,
  disabled,
  shouldUnregister,
  label,
  labelHint,
  required = false,
  hideLabel = false,
  showOptionalTag = true,
  description,
  render,
}: FormFieldProps<FormValues, FieldName, TransformedValues>) {
  const { field, fieldState } = useController({ control, name, disabled, shouldUnregister });
  const fieldId = useId();
  const labelId = `${fieldId}-label`;
  const hintId = `${fieldId}-hint`;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const errorMessage = fieldState.invalid
    ? fieldState.error?.message || UI_MESSAGES.invalidField
    : undefined;
  const showDescription = Boolean(description) && description !== errorMessage;
  const describedBy =
    [
      labelHint ? hintId : undefined,
      showDescription ? descriptionId : undefined,
      errorMessage ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="flex flex-col gap-field-gap">
      <div className={cn("flex flex-col gap-0.5 pl-0.5", hideLabel && "sr-only")}>
        <div className="flex flex-wrap items-baseline gap-field-gap">
          <label
            id={labelId}
            htmlFor={fieldId}
            className="flex items-center gap-0.75 text-label-md font-semibold"
          >
            {label}
            {required ? (
              <span aria-hidden="true" className="font-medium text-destructive">
                *
              </span>
            ) : (
              showOptionalTag && (
                <span className="text-caption-lg font-normal text-muted-foreground">
                  {UI_MESSAGES.optionalField}
                </span>
              )
            )}
          </label>
          {labelHint && (
            <span id={hintId} className="text-caption-lg text-muted-foreground">
              {labelHint}
            </span>
          )}
        </div>
        {showDescription && (
          <p id={descriptionId} className="text-caption-lg text-foreground-secondary">
            {description}
          </p>
        )}
      </div>
      {render({
        field,
        controlProps: {
          id: fieldId,
          "aria-labelledby": labelId,
          "aria-describedby": describedBy,
          "aria-invalid": fieldState.invalid,
          "aria-required": required,
        },
      })}
      {errorMessage && (
        <FieldMessage id={errorId} tone="error">
          {errorMessage}
        </FieldMessage>
      )}
    </div>
  );
}

type FieldMessageProps = { id: string; tone: "error" | "success"; children: ReactNode };

/** @description 입력칸 아래 오류·성공 문구. FormField 밖에서 확인 결과(예: 닉네임 중복 확인)를 보여줄 때도 사용 */
function FieldMessage({ id, tone, children }: FieldMessageProps) {
  const isError = tone === "error";
  const Icon = isError ? CircleExclamationFillIcon : CircleCheckFillIcon;
  return (
    <p
      id={id}
      role={isError ? "alert" : "status"}
      className={cn(
        "flex items-start gap-1 text-caption-lg",
        isError ? "text-destructive" : "text-positive",
      )}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      {children}
    </p>
  );
}

export { FieldMessage, FormField };
