"use client";

import { ChevronDownIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function SurveySection({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible variant="section" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <span className="font-bold">{title}</span>
        <span className="ml-auto text-caption-lg text-muted-foreground">{summary}</span>
        <ChevronDownIcon className={open ? "size-4 rotate-180" : "size-4"} aria-hidden />
      </CollapsibleTrigger>
      <CollapsibleContent keepMounted>
        <div className="flex flex-col gap-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
