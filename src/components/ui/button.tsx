import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button.styles";

function Button({
  className,
  variant = "default",
  size = "default",
  fullWidth = false,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
