import { type ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type CTAAction = Omit<
  ComponentProps<typeof Button>,
  "children" | "className" | "variant" | "size" | "fullWidth"
> & { label: string };

type BottomCTAProps = {
  primaryAction: CTAAction;
  secondaryAction?: CTAAction;
};

/** @description 본문 공간 확보 및 탭 바 위 고정. action의 form/type으로 폼 제출 연결 */
function BottomCTA({ primaryAction, secondaryAction }: BottomCTAProps) {
  const { label: primaryLabel, ...primaryButtonProps } = primaryAction;
  const { label: secondaryLabel, ...secondaryButtonProps } = secondaryAction ?? {};
  return (
    <div data-slot="bottom-cta" className="mt-auto h-bottom-cta shrink-0">
      <div className="fixed bottom-cta-offset left-1/2 z-10 w-full max-w-app -translate-x-1/2 border-t bg-background pr-safe-right pb-cta-safe-bottom pl-safe-left">
        <div className="grid auto-cols-fr grid-flow-col gap-layout-gap px-page-inset py-cta-inset">
          {secondaryAction && (
            <Button type="button" variant="secondary" size="lg" fullWidth {...secondaryButtonProps}>
              {secondaryLabel}
            </Button>
          )}
          <Button type="button" size="lg" fullWidth {...primaryButtonProps}>
            {primaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { BottomCTA };
