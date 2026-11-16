"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const radioVariants = cva(
  "relative flex shrink-0 items-center border border-input outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-disabled:cursor-not-allowed data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "size-4 rounded-full",
        card: "min-h-control w-full rounded-lg bg-background px-2.5 py-2 text-left text-sm",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

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
