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
    "group-data-[variant=section]/collapsible:flex group-data-[variant=section]/collapsible:w-full group-data-[variant=section]/collapsible:items-center group-data-[variant=section]/collapsible:justify-between group-data-[variant=section]/collapsible:gap-layout-gap group-data-[variant=section]/collapsible:p-page-inset group-data-[variant=section]/collapsible:text-left group-data-[variant=section]/collapsible:text-label-md group-data-[variant=section]/collapsible:focus-visible:outline-ring group-data-[variant=section]/collapsible:data-panel-open:bg-muted",
  content: "group-data-[variant=section]/collapsible:p-page-inset",
} as const;
