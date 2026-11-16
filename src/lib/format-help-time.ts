import { UI_MESSAGES } from "@/lib/ui-messages";

/**
 * @description 시간 환산 없이 분 단위 표시, 음수에 유니코드 마이너스 사용
 * @param showPlus 양수의 적립 표시용 + 부호 여부
 * @example formatHelpTime(90) // "90분"
 * @example formatHelpTime(5, { showPlus: true }) // "+5분"
 * @example formatHelpTime(-50) // "−50분"
 */
function formatHelpTime(minutes: number, { showPlus = false }: { showPlus?: boolean } = {}) {
  const formattedMinutes = `${Math.abs(minutes)}${UI_MESSAGES.helpTimeUnit}`;
  if (minutes < 0) return `−${formattedMinutes}`;
  if (showPlus && minutes > 0) return `+${formattedMinutes}`;
  return formattedMinutes;
}

export { formatHelpTime };
