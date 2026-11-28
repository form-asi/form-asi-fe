import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  label: string;
  className?: string;
};

/** @description 안내 문구는 스크린 리더에만 제공하는 공용 로딩 표시. */
function LoadingSpinner({ label, className }: LoadingSpinnerProps) {
  return (
    <span role="status" className={cn("flex items-center justify-center py-4", className)}>
      <Loader2Icon aria-hidden="true" className="size-6 animate-spin text-muted-foreground" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export { LoadingSpinner };
