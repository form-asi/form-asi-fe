"use client";

import { type ReactNode, useState } from "react";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UI_MESSAGES } from "@/lib/ui-messages";

/** 접고 펼치는 선택 묶음(expansion-panel). 값이 있을 때만 요약을 보여 준다 */
export function SurveySection({
  title,
  summary,
  children,
}: {
  title: string;
  summary?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible variant="section" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="flex items-center gap-1">
            <span className="font-medium">{title}</span>
            <span className="text-caption-lg text-muted-foreground">
              {UI_MESSAGES.optionalField}
            </span>
          </span>
          {summary && <span className="text-caption-lg text-foreground-secondary">{summary}</span>}
        </span>
        <ChevronDownIcon className={open ? "size-6 shrink-0 rotate-180" : "size-6 shrink-0"} />
      </CollapsibleTrigger>
      <CollapsibleContent keepMounted>
        <div className="flex flex-col gap-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
