"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setAccessToken } from "@/api/fetcher";
import { useLogout } from "@/api/generated/endpoints/auth/auth";
import {
  getMeQueryKey,
  useMe,
  useUpdateNotificationSettings,
} from "@/api/generated/endpoints/user/user";
import { type BaseResponseCurrentUserResponse } from "@/api/generated/models";
import { parseNotificationEnabled } from "@/features/my-page/lib/notification-settings";
import { MY_PAGE_MESSAGES } from "@/features/my-page/my-page-messages";
import { isUnauthorized } from "@/lib/auth-session";
import { ROUTES } from "@/lib/routes";

export function useSettings() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const notificationQuery = useMe<boolean, Error>({ query: { select: parseNotificationEnabled } });
  const updateNotifications = useUpdateNotificationSettings<Error>();
  const logout = useLogout<Error>();
  const isBusy = updateNotifications.isPending || logout.isPending;

  async function handleChangeNotifications(notificationEnabled: boolean) {
    if (isBusy) return;
    try {
      const response = await updateNotifications.mutateAsync({ data: { notificationEnabled } });
      const savedNotificationEnabled = parseNotificationEnabled(response);
      await queryClient.cancelQueries({ queryKey: getMeQueryKey() });
      queryClient.setQueryData<BaseResponseCurrentUserResponse>(getMeQueryKey(), (current) =>
        current?.data
          ? { ...current, data: { ...current.data, notificationEnabled: savedNotificationEnabled } }
          : current,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : MY_PAGE_MESSAGES.unknownError);
    }
  }

  function handleLogoutError(error: unknown) {
    if (!isUnauthorized(error))
      toast.error(error instanceof Error ? error.message : MY_PAGE_MESSAGES.unknownError);
  }

  async function handleLogout() {
    if (isBusy) return;
    try {
      await logout.mutateAsync();
    } catch (error) {
      handleLogoutError(error);
    } finally {
      setAccessToken(null);
      queryClient.clear();
      router.replace(ROUTES.login);
    }
  }

  return {
    notificationQuery,
    isBusy,
    isLoggingOut: logout.isPending,
    handleChangeNotifications,
    handleLogout,
    handleLogoutError,
  };
}
