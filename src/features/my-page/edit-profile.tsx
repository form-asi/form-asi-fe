"use client";

import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/common/app-header";
import { EmptyState } from "@/components/common/empty-state";
import { ProfileForm } from "@/components/domain/profile-form/profile-form";
import { PROFILE_MESSAGES } from "@/components/domain/profile-form/profile-messages";
import { useEditProfile } from "@/features/my-page/hooks/use-edit-profile";
import { UI_MESSAGES } from "@/lib/ui-messages";

export function EditProfile() {
  const router = useRouter();
  const { currentProfileQuery, profileOptionsQuery, checkNickname, handleSaveProfile } =
    useEditProfile();

  const header = (
    <AppHeader title={PROFILE_MESSAGES.editTitle} back={{ onBack: () => router.back() }} />
  );
  if (currentProfileQuery.isPending || profileOptionsQuery.isPending) {
    return (
      <>
        {header}
        <p role="status" className="p-page-inset text-body-sm text-muted-foreground">
          {PROFILE_MESSAGES.loading}
        </p>
      </>
    );
  }
  if (currentProfileQuery.isError || profileOptionsQuery.isError) {
    return (
      <>
        {header}
        <div className="p-page-inset">
          <EmptyState
            title={PROFILE_MESSAGES.loadFailed}
            description={
              currentProfileQuery.error?.message ??
              profileOptionsQuery.error?.message ??
              PROFILE_MESSAGES.unknownError
            }
            action={{
              label: UI_MESSAGES.retry,
              onClick: () =>
                Promise.all([currentProfileQuery.refetch(), profileOptionsQuery.refetch()]),
              disabled: currentProfileQuery.isFetching || profileOptionsQuery.isFetching,
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
        options={profileOptionsQuery.data}
        confirmedNickname={currentProfileQuery.data.nickname}
        requireChanges
        submitLabel={PROFILE_MESSAGES.save}
        checkNickname={checkNickname}
        onSaveProfile={handleSaveProfile}
      />
    </>
  );
}
