"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "cn";
import { switchStyles } from "@/components/ui/switch.styles";

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
