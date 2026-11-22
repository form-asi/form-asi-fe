"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { type VariantProps } from "class-variance-authority";
import { radioVariants } from "@/components/ui/radio-group.styles";
import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  variant = "default",
  children,
  ...props
}: RadioPrimitive.Root.Props & VariantProps<typeof radioVariants>) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(radioVariants({ variant }), className)}
      {...props}
    >
      {variant === "card" ? (
        children
      ) : (
        <RadioPrimitive.Indicator
          data-slot="radio-group-indicator"
          className="flex size-4 items-center justify-center"
        >
          <span className="size-2 rounded-full bg-primary-foreground" />
        </RadioPrimitive.Indicator>
      )}
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem, radioVariants };
