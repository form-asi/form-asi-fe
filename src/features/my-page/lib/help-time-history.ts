import { z } from "zod";
import { type BaseResponseHelpTimeHistoryResponse } from "@/api/generated/models";
import {
  HELP_TIME_HISTORY_MESSAGES,
  HELP_TIME_REASON_LABELS,
  HELP_TIME_REASONS,
} from "@/features/my-page/help-time-history-messages";
import { MY_PAGE_MESSAGES } from "@/features/my-page/my-page-messages";
import dayjs from "@/lib/dayjs";
import { formatHelpTime } from "@/lib/format-help-time";

const historySchema = z.object({
  helpTimeMinutes: z.number().int(),
  items: z.array(
    z.object({
      createdAt: z.iso.datetime({ offset: true }),
      reason: z.string().min(1),
      surveyTitle: z.string().nullish(),
      changeMinutes: z.number().int(),
      balanceAfter: z.number().int(),
      expiresAt: z.iso.datetime({ offset: true }).nullish(),
    }),
  ),
});

export function parseHelpTimeHistory(response: BaseResponseHelpTimeHistoryResponse) {
  const result = historySchema.safeParse(response?.data);
  if (!result.success) throw new Error(MY_PAGE_MESSAGES.unknownError);
  return {
    helpTimeBalance: result.data.helpTimeMinutes,
    entries: result.data.items.map((transaction) => ({
      occurredAt: transaction.createdAt,
      dateLabel: dayjs(transaction.createdAt).format("YYYY.MM.DD HH:mm"),
      reasonLabel: HELP_TIME_REASON_LABELS.get(transaction.reason) ?? transaction.reason,
      surveyTitle: transaction.surveyTitle || null,
      changeLabel: formatHelpTime(transaction.changeMinutes, { showPlus: true }),
      balanceLabel: formatHelpTime(transaction.balanceAfter),
      expiryLabel:
        transaction.reason === HELP_TIME_REASONS.signupBonus && transaction.expiresAt
          ? HELP_TIME_HISTORY_MESSAGES.expiresOn(dayjs(transaction.expiresAt).format("YYYY.MM.DD"))
          : null,
    })),
  };
}

export type HelpTimeHistoryData = ReturnType<typeof parseHelpTimeHistory>;
