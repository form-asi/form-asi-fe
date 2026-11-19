"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/common/app-header";
import { EmptyState } from "@/components/common/empty-state";
import {
  checkNicknameMock,
  getProfileAgeMock,
  saveProfileMock,
} from "@/components/domain/profile-form/profile-api.mock";
import { ProfileForm } from "@/components/domain/profile-form/profile-form";
import { PROFILE_MESSAGES } from "@/components/domain/profile-form/profile-messages";
import {
  createEmptyProfile,
  type ProfileValues,
} from "@/components/domain/profile-form/profile-schema";
import { UI_MESSAGES } from "@/lib/ui-messages";

export function OnboardingProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const profileAgeQuery = useQuery({ queryKey: ["profile", "age"], queryFn: getProfileAgeMock });
  const saveProfile = useMutation({ mutationFn: saveProfileMock });

  async function handleStartWithProfile(profile: ProfileValues) {
    const savedProfile = await saveProfile.mutateAsync(profile);
    queryClient.setQueryData(["profile", "current"], savedProfile);
    router.replace("/explore");
  }

  const header = <AppHeader title={PROFILE_MESSAGES.createTitle} />;
  if (profileAgeQuery.isPending) {
    return (
      <>
        {header}
        <p role="status" className="p-page-inset text-body-sm text-muted-foreground">
          {PROFILE_MESSAGES.loading}
        </p>
      </>
    );
  }
  if (profileAgeQuery.isError) {
    return (
      <>
        {header}
        <div className="p-page-inset">
          <EmptyState
            title={PROFILE_MESSAGES.loadFailed}
            description={profileAgeQuery.error.message}
            action={{
              label: UI_MESSAGES.retry,
              onClick: () => profileAgeQuery.refetch(),
              disabled: profileAgeQuery.isFetching,
            }}
          />
        </div>
      </>
    );
  }
  return (
    <>
      {header}
      <ProfileForm
        initialProfile={createEmptyProfile(profileAgeQuery.data)}
        intro={PROFILE_MESSAGES.createIntro}
        submitLabel={PROFILE_MESSAGES.start}
        checkNickname={checkNicknameMock}
        onSaveProfile={handleStartWithProfile}
      />
    </>
  );
}
