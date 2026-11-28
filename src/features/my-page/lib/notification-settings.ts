import { type BaseResponseNotificationSettingsResponse } from "@/api/generated/models";
import { MY_PAGE_MESSAGES } from "@/features/my-page/my-page-messages";

export function parseNotificationEnabled(response: BaseResponseNotificationSettingsResponse) {
  const notificationEnabled = response?.data?.notificationEnabled;
  if (typeof notificationEnabled !== "boolean") throw new Error(MY_PAGE_MESSAGES.unknownError);
  return notificationEnabled;
}
