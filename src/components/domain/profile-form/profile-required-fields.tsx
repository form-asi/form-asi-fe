"use client";

import { LockKeyhole } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { SectionLabel } from "@/components/common/section-label";
import { Input } from "@/components/ui/input";
import { PROFILE_MESSAGES } from "./profile-messages";
import { FIELD_OPTIONS, GENDER_OPTIONS, OCCUPATION_OPTIONS } from "./profile-options";
import { type ProfileValues } from "./profile-schema";
import { ProfileSelectField } from "./profile-select-field";

export function ProfileRequiredFields() {
  const { control } = useFormContext<ProfileValues>();
  return (
    <>
      <SectionLabel>{PROFILE_MESSAGES.required}</SectionLabel>
      <FormField
        control={control}
        name="age"
        label={PROFILE_MESSAGES.age}
        required
        description={PROFILE_MESSAGES.ageHint}
        render={({ field, controlProps }) => (
          <Input
            {...field}
            {...controlProps}
            value={PROFILE_MESSAGES.ageValue(field.value)}
            readOnly
            endAdornment={<LockKeyhole aria-hidden="true" className="size-4" />}
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
        labelHint={PROFILE_MESSAGES.multipleSelection}
        multiple
        required
      />
    </>
  );
}
