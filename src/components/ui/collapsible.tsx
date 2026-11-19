"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { collapsibleStyles, collapsibleVariants } from "./collapsible.styles";

function Collapsible({
  variant = "default",
  className,
  ...props
}: CollapsiblePrimitive.Root.Props & VariantProps<typeof collapsibleVariants>) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      data-variant={variant}
      className={cn(collapsibleVariants({ variant }), className)}
      {...props}
    />
  );
}

function CollapsibleTrigger({ className, ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(collapsibleStyles.trigger, className)}
      {...props}
    />
  );
}

function CollapsibleContent({ className, ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className={cn(collapsibleStyles.content, className)}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
