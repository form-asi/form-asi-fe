"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { PROFILE_MESSAGES } from "./profile-messages";
import { FIELD_OPTIONS, GENDER_OPTIONS, OCCUPATION_OPTIONS } from "./profile-options";
import { type ProfileValues } from "./profile-schema";
import { ProfileSelectField } from "./profile-select-field";

export function ProfileRequiredFields() {
  const { control } = useFormContext<ProfileValues>();
  return (
    <>
      <FormField
        control={control}
        name="age"
        label={PROFILE_MESSAGES.age}
        required
        render={({ field, controlProps }) => (
          <Input
            {...field}
            {...controlProps}
            value={PROFILE_MESSAGES.ageValue(field.value)}
            disabled
            className="border-border has-[input:disabled]:bg-muted has-[input:disabled]:text-foreground"
          />
        )}
      />
      <ProfileSelectField
        name="gender"
        label={PROFILE_MESSAGES.gender}
        options={GENDER_OPTIONS}
        required
      />
      <ProfileSelectField
        name="occupation"
        label={PROFILE_MESSAGES.occupation}
        options={OCCUPATION_OPTIONS}
        otherFieldName="occupationOther"
        required
      />
      <ProfileSelectField
        name="fields"
        label={PROFILE_MESSAGES.fields}
        options={FIELD_OPTIONS}
        otherFieldName="fieldsOther"
        multiple
        required
      />
    </>
  );
}
