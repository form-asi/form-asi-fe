// Next 기본 선언(*.svg → any)보다 구체적인 경로가 우선 적용된다
declare module "@/assets/icons/*.svg" {
  import { type FC, type SVGProps } from "react";

  const Icon: FC<SVGProps<SVGSVGElement>>;
  export default Icon;
}
