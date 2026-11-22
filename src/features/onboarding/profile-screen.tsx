"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { UI_MESSAGES } from "@/lib/ui-messages";

export function OnboardingProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const profileAgeQuery = useQuery({ queryKey: ["profile", "age"], queryFn: getProfileAgeMock });
  const saveProfile = useMutation({ mutationFn: saveProfileMock });

  async function handleStartWithProfile(profile: ProfileValues) {
    const savedProfile = await saveProfile.mutateAsync(profile);
    queryClient.setQueryData(["profile", "current"], savedProfile);
    router.replace(ROUTES.explore);
  }

  const header = (
    <header className="flex min-h-header items-center gap-2 bg-background pr-3 pl-5">
      <h1 className="min-w-0 flex-1 truncate text-title-md font-semibold">
        {PROFILE_MESSAGES.createTitle}
      </h1>
      <Button
        type="button"
        variant="ghost"
        className="h-10 px-2 text-foreground-secondary"
        onClick={() => router.replace(ROUTES.explore)}
      >
        {PROFILE_MESSAGES.skip}
      </Button>
    </header>
  );
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
        submitLabel={PROFILE_MESSAGES.start}
        checkNickname={checkNicknameMock}
        onSaveProfile={handleStartWithProfile}
      />
    </>
  );
}
