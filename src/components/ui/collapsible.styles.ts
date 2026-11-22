import { cva } from "class-variance-authority";

export const collapsibleVariants = cva("group/collapsible", {
  variants: {
    variant: {
      default: "",
      section: "overflow-hidden rounded-lg border border-border bg-card",
    },
  },
  defaultVariants: { variant: "default" },
});

export const collapsibleStyles = {
  trigger:
    "group-data-[variant=section]/collapsible:flex group-data-[variant=section]/collapsible:min-h-12 group-data-[variant=section]/collapsible:w-full group-data-[variant=section]/collapsible:items-center group-data-[variant=section]/collapsible:justify-between group-data-[variant=section]/collapsible:gap-layout-gap group-data-[variant=section]/collapsible:bg-muted group-data-[variant=section]/collapsible:px-4 group-data-[variant=section]/collapsible:py-3 group-data-[variant=section]/collapsible:text-left group-data-[variant=section]/collapsible:text-label-lg group-data-[variant=section]/collapsible:focus-visible:outline-ring",
  content:
    "group-data-[variant=section]/collapsible:border-t group-data-[variant=section]/collapsible:border-line-subtle group-data-[variant=section]/collapsible:p-4",
} as const;
