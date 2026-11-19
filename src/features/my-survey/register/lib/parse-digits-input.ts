const DIGITS_ONLY = /^\d*$/;

type DigitsInputResult = { accepted: true; fieldValue: number | "" } | { accepted: false };

/**
 * @description 숫자만 받는 입력 칸의 글자를 폼 값으로 바꾼다. 숫자가 아닌 글자가 섞이면 입력을 받지 않는다.
 * @example parseDigitsInput("20") // { accepted: true, fieldValue: 20 }
 */
export function parseDigitsInput(input: string): DigitsInputResult {
  if (!DIGITS_ONLY.test(input)) return { accepted: false };
  return { accepted: true, fieldValue: input === "" ? "" : Number(input) };
}
