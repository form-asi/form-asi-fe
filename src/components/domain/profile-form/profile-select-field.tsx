"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { SelectSheet } from "@/components/common/select-sheet";
import { Input } from "@/components/ui/input";
import { PROFILE_MESSAGES } from "./profile-messages";
import { type ProfileValues } from "./profile-schema";

type ProfileOption = { value: string; label: string };
type OtherFieldName = "occupationOther" | "fieldsOther" | "householdOther" | "maritalStatusOther";
type SingleSelectName =
  | "gender"
  | "occupation"
  | "region"
  | "household"
  | "householdSize"
  | "maritalStatus"
  | "children"
  | "petExperience"
  | "drivingLicense";

type ProfileSelectFieldProps = {
  label: string;
  options: readonly ProfileOption[];
  required?: boolean;
  otherFieldName?: OtherFieldName;
} & (
  | { name: SingleSelectName; multiple?: false }
  | { name: "fields" | "petTypes"; multiple: true }
);

/** @description 프로필 선택값과 조건부 직접 입력의 연결 */
export function ProfileSelectField(props: ProfileSelectFieldProps) {
  const { control, setValue, formState } = useFormContext<ProfileValues>();
  const selection = useWatch({ control, name: props.name });
  const hasOtherSelection = Array.isArray(selection)
    ? selection.includes("ETC")
    : selection === "ETC";
  const { otherFieldName } = props;

  function clearHiddenFields(nextSelection: string | string[]) {
    const keepsOther = Array.isArray(nextSelection)
      ? nextSelection.includes("ETC")
      : nextSelection === "ETC";
    if (otherFieldName && !keepsOther) {
      setValue(otherFieldName, "", { shouldDirty: true, shouldValidate: true });
    }
    if (props.name === "petExperience" && nextSelection !== "PAST" && nextSelection !== "CURRENT") {
      setValue("petTypes", [], { shouldDirty: true, shouldValidate: true });
    }
  }

  const options =
    props.required || props.multiple
      ? props.options
      : [{ value: "", label: PROFILE_MESSAGES.clearSelection }, ...props.options];

  return (
    <div className="flex flex-col gap-layout-gap">
      {props.multiple ? (
        <FormField
          control={control}
          name={props.name}
          label={props.label}
          required={props.required}
          showOptionalTag={false}
          render={({ field, controlProps }) => (
            <SelectSheet
              {...controlProps}
              ref={field.ref}
              onBlur={field.onBlur}
              disabled={formState.isSubmitting}
              multiple
              title={props.label}
              options={options}
              value={field.value}
              onValueChange={(selectedCodes) => {
                const orderedCodes = options
                  .filter((option) => selectedCodes.includes(option.value))
                  .map((option) => option.value);
                field.onChange(orderedCodes);
                clearHiddenFields(orderedCodes);
              }}
            />
          )}
        />
      ) : (
        <FormField
          control={control}
          name={props.name}
          label={props.label}
          required={props.required}
          showOptionalTag={false}
          render={({ field, controlProps }) => (
            <SelectSheet
              {...controlProps}
              ref={field.ref}
              onBlur={field.onBlur}
              disabled={formState.isSubmitting}
              title={props.label}
              options={options}
              value={field.value}
              onValueChange={(selectedCode) => {
                field.onChange(selectedCode);
                clearHiddenFields(selectedCode);
              }}
            />
          )}
        />
      )}
      {hasOtherSelection && otherFieldName && (
        <FormField
          control={control}
          name={otherFieldName}
          label={PROFILE_MESSAGES.otherLabel(props.label)}
          required
          render={({ field, controlProps }) => (
            <Input {...field} {...controlProps} placeholder={PROFILE_MESSAGES.otherPlaceholder} />
          )}
        />
      )}
    </div>
  );
}
