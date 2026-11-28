"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getMeQueryKey,
  useCompleteOnboarding,
  useMe,
  useProfileOptions,
} from "@/api/generated/endpoints/user/user";
import {
  type BaseResponseCurrentUserResponse,
  OnboardingResponseStatus,
} from "@/api/generated/models";
import { EmptyState } from "@/components/common/empty-state";
import { ProfileForm } from "@/components/domain/profile-form/profile-form";
import { PROFILE_MESSAGES } from "@/components/domain/profile-form/profile-messages";
import {
  type ProfileOptions,
  parseProfileOptions,
} from "@/components/domain/profile-form/profile-options-schema";
import {
  createEmptyProfile,
  type ProfileValues,
} from "@/components/domain/profile-form/profile-schema";
import { useNicknameAvailability } from "@/components/domain/profile-form/use-nickname-availability";
import { toOnboardingRequest } from "@/features/onboarding/lib/onboarding-request";
import { ROUTES } from "@/lib/routes";
import { UI_MESSAGES } from "@/lib/ui-messages";

export function OnboardingProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUserQuery = useMe<BaseResponseCurrentUserResponse, Error>();
  const profileOptionsQuery = useProfileOptions<ProfileOptions, Error>({
    query: { select: parseProfileOptions },
  });
  const completeOnboarding = useCompleteOnboarding<Error>();
  const checkNickname = useNicknameAvailability();

  async function handleStartWithProfile(profile: ProfileValues) {
    const response = await completeOnboarding.mutateAsync({ data: toOnboardingRequest(profile) });
    const completedUser = response.data;
    if (completedUser?.status !== OnboardingResponseStatus.ACTIVE)
      throw new Error(PROFILE_MESSAGES.unknownError);
    queryClient.setQueryData<BaseResponseCurrentUserResponse>(getMeQueryKey(), (currentResponse) =>
      currentResponse?.data
        ? { ...currentResponse, data: { ...currentResponse.data, ...completedUser } }
        : currentResponse,
    );
    void queryClient.invalidateQueries({ queryKey: getMeQueryKey() });
    router.replace(ROUTES.explore);
  }

  const header = (
    <header className="flex min-h-header items-center gap-2 bg-background pr-3 pl-5">
      <h1 className="min-w-0 flex-1 truncate text-title-md font-semibold">
        {PROFILE_MESSAGES.createTitle}
      </h1>
    </header>
  );
  if (currentUserQuery.isPending || profileOptionsQuery.isPending) {
    return (
      <>
        {header}
        <p role="status" className="p-page-inset text-body-sm text-muted-foreground">
          {PROFILE_MESSAGES.loading}
        </p>
      </>
    );
  }
  if (currentUserQuery.isError || profileOptionsQuery.isError) {
    return (
      <>
        {header}
        <div className="p-page-inset">
          <EmptyState
            title={PROFILE_MESSAGES.loadFailed}
            description={
              currentUserQuery.error?.message ??
              profileOptionsQuery.error?.message ??
              PROFILE_MESSAGES.unknownError
            }
            action={{
              label: UI_MESSAGES.retry,
              onClick: () =>
                Promise.all([currentUserQuery.refetch(), profileOptionsQuery.refetch()]),
              disabled: currentUserQuery.isFetching || profileOptionsQuery.isFetching,
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
        initialProfile={createEmptyProfile(currentUserQuery.data?.data?.age ?? undefined)}
        options={profileOptionsQuery.data}
        submitLabel={PROFILE_MESSAGES.start}
        checkNickname={checkNickname}
        onSaveProfile={handleStartWithProfile}
      />
    </>
  );
}
