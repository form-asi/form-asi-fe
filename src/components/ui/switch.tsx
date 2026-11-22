"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { switchStyles } from "@/components/ui/switch.styles";
import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(switchStyles.root, className)}
      {...props}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb" className={switchStyles.thumb} />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
