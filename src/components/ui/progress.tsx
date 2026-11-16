"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "cn";

/** @description secondaryValue는 현재 값 뒤에 표시할 보조 구간의 양이며, 남은 범위를 넘으면 잘립니다. */
function Progress({
  className,
  children,
  value,
  secondaryValue,
  min = 0,
  max = 100,
  ...props
}: ProgressPrimitive.Root.Props & { secondaryValue?: number }) {
  const range = max - min;
  const primaryValue = Math.min(max, Math.max(min, value ?? min));
  const secondaryWidth =
    range > 0 && value != null && Number.isFinite(value) && Number.isFinite(secondaryValue)
      ? (Math.max(0, Math.min(secondaryValue ?? 0, max - primaryValue)) / range) * 100
      : 0;
  return (
    <ProgressPrimitive.Root
      value={value}
      min={min}
      max={max}
      data-slot="progress"
      className={cn("flex flex-wrap gap-3", className)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
        <span
          aria-hidden="true"
          data-slot="progress-secondary"
          className="h-full shrink-0 bg-progress-secondary transition-all"
          style={{ width: `${secondaryWidth}%` }}
        />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  );
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-progress w-full items-center overflow-x-hidden rounded-full bg-muted",
        className,
      )}
      data-slot="progress-track"
      {...props}
    />
  );
}

function ProgressIndicator({ className, ...props }: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn("h-full shrink-0 bg-primary transition-all", className)}
      {...props}
    />
  );
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  );
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn("ml-auto text-sm text-muted-foreground tabular-nums", className)}
      data-slot="progress-value"
      {...props}
    />
  );
}

export { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue };
