import { createCn } from "cn/config";

/**
 * 프로젝트 타이포 토큰(`text-label-md` 등)을 글자 크기로 알려 준다.
 * 모르면 색 클래스(`text-destructive`)와 같은 그룹으로 보고 둘 중 하나를 지운다.
 * 역할·크기 이름은 tokens.generated.css의 `--text-*`와 같다.
 */
const TEXT_SCALE_PATTERN =
  /^(display|heading|title|body|label|caption|emphasis-(heading|label|caption))-(lg|md|sm)$/;

export const cn = createCn({
  extend: {
    classGroups: { "font-size": [{ text: [(value: string) => TEXT_SCALE_PATTERN.test(value)] }] },
  },
});
