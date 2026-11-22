import { cn } from "cn";
import { type ComponentProps } from "react";
import { textareaVariants } from "./textarea.styles";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(textareaVariants(), className)} {...props} />;
}

export { Textarea };
