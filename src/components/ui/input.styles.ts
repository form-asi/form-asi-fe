import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "flex w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-background text-base transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-[input:disabled]:bg-disabled has-[input:disabled]:text-disabled-foreground has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-destructive/20 has-[input[readonly]]:bg-muted",
  {
    variants: { size: { default: "h-control", sm: "h-control-sm" } },
    defaultVariants: { size: "default" },
  },
);

export const inputStyles = {
  control:
    "size-full min-w-0 flex-1 rounded-lg bg-transparent px-2.5 py-1 outline-none file:border-0 file:bg-transparent placeholder:text-muted-foreground disabled:cursor-not-allowed",
} as const;
