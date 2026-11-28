"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import dayjs from "@/lib/dayjs";
import { PROFILE_MESSAGES } from "./profile-messages";
import { type ProfileOptions } from "./profile-options-schema";
import { type ProfileValues } from "./profile-schema";
import { ProfileSelectField } from "./profile-select-field";

export function ProfileRequiredFields({ options }: { options: ProfileOptions }) {
  const { control } = useFormContext<ProfileValues>();
  const age = useWatch({ control, name: "age" });
  return (
    <>
      {typeof age === "number" ? (
        <FormField
          control={control}
          name="age"
          label={PROFILE_MESSAGES.age}
          required
          render={({ field, controlProps }) => (
            <Input
              {...field}
              {...controlProps}
              value={PROFILE_MESSAGES.ageValue(age)}
              disabled
              className="border-border has-[input:disabled]:bg-muted has-[input:disabled]:text-foreground"
            />
          )}
        />
      ) : (
        <FormField
          control={control}
          name="birthDate"
          label={PROFILE_MESSAGES.birthDate}
          required
          render={({ field, controlProps }) => (
            <Input
              {...field}
              {...controlProps}
              value={field.value ?? ""}
              type="date"
              autoComplete="bday"
              max={dayjs().format("YYYY-MM-DD")}
            />
          )}
        />
      )}
      <ProfileSelectField
        name="gender"
        label={PROFILE_MESSAGES.gender}
        options={options.genders}
        required
      />
      <ProfileSelectField
        name="occupation"
        label={PROFILE_MESSAGES.occupation}
        options={options.occupations}
        otherFieldName="occupationOther"
        required
      />
      <ProfileSelectField
        name="fields"
        label={PROFILE_MESSAGES.fields}
        options={options.fields}
        otherFieldName="fieldsOther"
        multiple
        required
      />
    </>
  );
}
