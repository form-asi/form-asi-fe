import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { type ComponentProps, type ReactNode } from "react";

const inputVariants = cva(
  "flex w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-background text-base transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-[input:disabled]:bg-disabled has-[input:disabled]:text-disabled-foreground has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-destructive/20 has-[input[readonly]]:bg-muted",
  {
    variants: { size: { default: "h-control", sm: "h-control-sm" } },
    defaultVariants: { size: "default" },
  },
);

type InputProps = Omit<ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    endAdornment?: ReactNode;
  };

/** @description endAdornment로 오른쪽 버튼·아이콘 전달, 입력 ref는 실제 input에 연결 */
function Input({ className, type, size, endAdornment, ...props }: InputProps) {
  return (
    <div data-slot="input-container" className={cn(inputVariants({ size }), className)}>
      <InputPrimitive
        type={type}
        data-slot="input"
        className="size-full min-w-0 flex-1 rounded-lg bg-transparent px-2.5 py-1 outline-none file:border-0 file:bg-transparent placeholder:text-muted-foreground disabled:cursor-not-allowed"
        {...props}
      />
      {endAdornment != null && (
        <div
          data-slot="input-adornment"
          className="flex shrink-0 items-center gap-1 pr-2.5 text-muted-foreground"
        >
          {endAdornment}
        </div>
      )}
    </div>
  );
}

export { Input, inputVariants };
