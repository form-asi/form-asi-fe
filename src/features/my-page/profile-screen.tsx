"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppHeader } from "@/components/common/app-header";
import { EmptyState } from "@/components/common/empty-state";
import {
  checkNicknameMock,
  getCurrentProfileMock,
  saveProfileMock,
} from "@/components/domain/profile-form/profile-api.mock";
import { ProfileForm } from "@/components/domain/profile-form/profile-form";
import { PROFILE_MESSAGES } from "@/components/domain/profile-form/profile-messages";
import { type ProfileValues } from "@/components/domain/profile-form/profile-schema";
import { UI_MESSAGES } from "@/lib/ui-messages";

export function EditProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentProfileQuery = useQuery({
    queryKey: ["profile", "current"],
    queryFn: getCurrentProfileMock,
  });
  const saveProfile = useMutation({ mutationFn: saveProfileMock });

  async function handleSaveProfile(profile: ProfileValues) {
    const savedProfile = await saveProfile.mutateAsync(profile);
    queryClient.setQueryData(["profile", "current"], savedProfile);
    toast.success(UI_MESSAGES.toast.saved);
    router.back();
  }

  const header = (
    <AppHeader title={PROFILE_MESSAGES.editTitle} back={{ onBack: () => router.back() }} />
  );
  if (currentProfileQuery.isPending) {
    return (
      <>
        {header}
        <p role="status" className="p-page-inset text-body-sm text-muted-foreground">
          {PROFILE_MESSAGES.loading}
        </p>
      </>
    );
  }
  if (currentProfileQuery.isError) {
    return (
      <>
        {header}
        <div className="p-page-inset">
          <EmptyState
            title={PROFILE_MESSAGES.loadFailed}
            description={currentProfileQuery.error.message}
            action={{
              label: UI_MESSAGES.retry,
              onClick: () => currentProfileQuery.refetch(),
              disabled: currentProfileQuery.isFetching,
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
        initialProfile={currentProfileQuery.data}
        confirmedNickname={currentProfileQuery.data.nickname}
        requireChanges
        submitLabel={PROFILE_MESSAGES.save}
        checkNickname={checkNicknameMock}
        onSaveProfile={handleSaveProfile}
      />
    </>
  );
}
