import { type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: NonNullable<ComponentProps<typeof Button>["onClick"]>;
    disabled?: boolean;
  };
};

/** @description C-04 목록 없음·검색 결과 없음·불러오기 실패의 공통 틀 */
function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card variant="empty">
      <CardContent>
        <div className="flex flex-col items-center gap-empty-state text-center">
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
          {action && (
            <div className="w-empty-state-action pt-layout-gap">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { EmptyState };
