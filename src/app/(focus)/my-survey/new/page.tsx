import { AppHeader } from "@/components/common/app-header";
import { HelpTimeChip } from "@/components/domain/help-time-chip";

export default function NewSurveyPage() {
  // shortcut: 잔액 API 연결 전 임시 값
  const helpTimeBalance = 30;

  return (
    <AppHeader
      title="설문 등록"
      back={{ href: "/my-survey" }}
      rightSlot={<HelpTimeChip helpTimeBalance={helpTimeBalance} />}
    />
  );
}
