"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getMeQueryKey,
  getMyProfileQueryKey,
  useMyProfile,
  useProfileOptions,
  useUpdateMyProfile,
} from "@/api/generated/endpoints/user/user";
import {
  type ProfileOptions,
  parseProfileOptions,
} from "@/components/domain/profile-form/profile-options-schema";
import { toProfileUpdateRequest } from "@/components/domain/profile-form/profile-request";
import { type ProfileValues } from "@/components/domain/profile-form/profile-schema";
import { useNicknameAvailability } from "@/components/domain/profile-form/use-nickname-availability";
import { parseCurrentProfile } from "@/features/my-page/lib/current-profile";
import { UI_MESSAGES } from "@/lib/ui-messages";

export function useEditProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentProfileQuery = useMyProfile<ProfileValues, Error>({
    query: { select: parseCurrentProfile },
  });
  const profileOptionsQuery = useProfileOptions<ProfileOptions, Error>({
    query: { select: parseProfileOptions },
  });
  const updateProfile = useUpdateMyProfile<Error>();
  const checkNickname = useNicknameAvailability();

  async function handleSaveProfile(profile: ProfileValues) {
    await updateProfile.mutateAsync({ data: toProfileUpdateRequest(profile) });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getMyProfileQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getMeQueryKey() }),
    ]);
    toast.success(UI_MESSAGES.toast.saved);
    router.back();
  }

  return { currentProfileQuery, profileOptionsQuery, checkNickname, handleSaveProfile };
}
