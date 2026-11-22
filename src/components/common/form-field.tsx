"use client";

import { type ReactNode, useId } from "react";
import {
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from "react-hook-form";
import { UI_MESSAGES } from "@/lib/ui-messages";

type FieldControlProps = {
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
      <div className="flex flex-wrap items-baseline gap-field-gap">
        <label
          id={labelId}
          htmlFor={fieldId}
          className="flex items-center gap-field-gap text-label-md font-bold"
        >
          {label}
          {required ? (
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
          ) : (
            <span className="text-caption-lg font-normal text-muted-foreground">
              {UI_MESSAGES.optionalField}
            </span>
          )}
        </label>
        {labelHint && (
          <span id={hintId} className="text-caption-lg text-muted-foreground">
            {labelHint}
          </span>
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
      {showDescription && (
        <p id={descriptionId} className="text-caption-lg text-muted-foreground">
          {description}
        </p>
      )}
      {errorMessage && (
        <p id={errorId} role="alert" className="text-caption-lg text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export { FormField };
