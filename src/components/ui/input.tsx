import { Input as InputPrimitive } from "@base-ui/react/input";
import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { type ComponentProps, type ReactNode } from "react";
import { inputStyles, inputVariants } from "@/components/ui/input.styles";

type InputProps = Omit<ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    endAdornment?: ReactNode;
  };

/** @description endAdornment로 오른쪽 버튼·아이콘 전달, 입력 ref는 실제 input에 연결 */
function Input({ className, type, size, endAdornment, ...props }: InputProps) {
  return (
    <div data-slot="input-container" className={cn(inputVariants({ size }), className)}>
      <InputPrimitive type={type} data-slot="input" className={inputStyles.control} {...props} />
      {endAdornment != null && (
        <div
          data-slot="input-adornment"
          className="flex shrink-0 items-center gap-1 pr-3 text-muted-foreground"
        >
          {endAdornment}
        </div>
      )}
    </div>
  );
}

export { Input, inputVariants };
