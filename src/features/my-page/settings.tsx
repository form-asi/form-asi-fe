"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppHeader } from "@/components/common/app-header";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/features/my-page/hooks/use-settings";
import { SETTINGS_MESSAGES as MESSAGES } from "@/features/my-page/settings-messages";
import { UI_MESSAGES } from "@/lib/ui-messages";

export function Settings() {
  const router = useRouter();
  const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const {
    notificationQuery,
    isBusy,
    isLoggingOut,
    handleChangeNotifications,
    handleLogout,
    handleLogoutError,
  } = useSettings();
  return (
    <>
      <AppHeader title={MESSAGES.title} back={{ onBack: () => router.back() }} />
      <div className="px-page-inset pt-2 pb-10">
        {notificationQuery.isPending && <LoadingSpinner label={MESSAGES.loading} />}
        {notificationQuery.isError && (
          <EmptyState
            title={MESSAGES.loadFailed}
            description={notificationQuery.error.message}
            action={{
              label: UI_MESSAGES.retry,
              onClick: () => notificationQuery.refetch(),
              disabled: notificationQuery.isFetching || isBusy,
            }}
          />
        )}
        {notificationQuery.isSuccess && (
          <div className="flex min-h-control-lg items-center justify-between gap-3 border-b border-line-subtle p-3">
            <label htmlFor="notification-enabled" className="text-label-lg">
              {MESSAGES.notifications}
            </label>
            <Switch
              id="notification-enabled"
              checked={notificationQuery.data}
              disabled={isBusy}
              onCheckedChange={handleChangeNotifications}
              className="border-2 [--switch-height:--spacing(6)] [--switch-thumb-offset:--spacing(4)] [--switch-width:--spacing(10)] **:data-[slot=switch-thumb]:size-5 data-unchecked:bg-(--surface-neutral-primary-pressed)"
            />
          </div>
        )}
        <Button
          variant="ghost"
          size="lg"
          fullWidth
          className="justify-start rounded-none px-3 text-label-lg font-normal"
          onClick={() => setLogoutConfirmOpen(true)}
          disabled={isBusy}
          aria-label={MESSAGES.logout}
          aria-busy={isLoggingOut}
        >
          {isLoggingOut ? (
            <LoadingSpinner label={MESSAGES.loggingOut} className="py-0" />
          ) : (
            MESSAGES.logout
          )}
        </Button>
      </div>
      <ConfirmDialog
        open={isLogoutConfirmOpen}
        onOpenChange={setLogoutConfirmOpen}
        title={MESSAGES.logoutConfirmTitle}
        description={MESSAGES.logoutConfirmDescription}
        confirmLabel={
          isLoggingOut ? (
            <>
              <LoadingSpinner label={MESSAGES.loggingOut} className="py-0" />
              <span className="sr-only">{MESSAGES.logout}</span>
            </>
          ) : (
            MESSAGES.logout
          )
        }
        cancelLabel={MESSAGES.cancelLogout}
        onConfirm={handleLogout}
        onConfirmError={handleLogoutError}
      />
    </>
  );
}
