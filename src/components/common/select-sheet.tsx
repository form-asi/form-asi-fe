"use client";

import { Drawer } from "@base-ui/react/drawer";
import { cn } from "cn";
import { type ComponentProps, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { UI_MESSAGES } from "@/lib/ui-messages";

type SelectSheetOption<OptionValue extends string> = { value: OptionValue; label: string };

type SelectSheetSelection<OptionValue extends string> =
  | { multiple?: false; value: OptionValue | ""; onValueChange: (value: OptionValue) => void }
  | {
      multiple: true;
      value: readonly OptionValue[];
      onValueChange: (value: OptionValue[]) => void;
    };

type SelectSheetProps<OptionValue extends string> = SelectSheetSelection<OptionValue> &
  Omit<ComponentProps<"button">, "value" | "onChange" | "children"> & {
    title: string;
    options: readonly SelectSheetOption<OptionValue>[];
    placeholder?: string;
  };

/**
 * @description 누르면 아래에서 선택 시트가 올라오는 드롭다운. 단일 선택은 고르면 닫히고, 여러 개 선택은 [완료]로 닫는다.
 * 나머지 props(id, aria-*, ref)는 트리거 버튼에 전달되어 FormField의 controlProps를 그대로 받을 수 있다.
 * @example <SelectSheet title="목적" options={PURPOSE_OPTIONS} value={field.value} onValueChange={field.onChange} {...controlProps} />
 */
function SelectSheet<OptionValue extends string>(props: SelectSheetProps<OptionValue>) {
  const {
    title,
    options,
    placeholder = UI_MESSAGES.selectPlaceholder,
    multiple,
    value,
    onValueChange: _onValueChange,
    className,
    ...triggerProps
  } = props;
  const [open, setOpen] = useState(false);
  const selectedValues: readonly string[] = multiple ? value : value === "" ? [] : [value];
  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label)
    .join(", ");

  function handleSelectOption(optionValue: OptionValue) {
    if (props.multiple) {
      const isSelected = props.value.includes(optionValue);
      props.onValueChange(
        isSelected
          ? props.value.filter((selectedValue) => selectedValue !== optionValue)
          : [...props.value, optionValue],
      );
      return;
    }
    props.onValueChange(optionValue);
    setOpen(false);
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger
        type="button"
        data-slot="select-sheet-trigger"
        className={cn(
          "group/select-sheet flex h-control-lg w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-left text-body-lg outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:bg-disabled disabled:text-disabled-foreground aria-invalid:border-destructive data-popup-open:border-ring",
          className,
        )}
        {...triggerProps}
      >
        <span
          className={cn("min-w-0 flex-1 truncate", !selectedLabels && "text-foreground-quaternary")}
        >
          {selectedLabels || placeholder}
        </span>
        <ChevronDownIcon className="size-6 shrink-0 text-foreground-secondary transition-transform group-data-popup-open/select-sheet:rotate-180" />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-overlay transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
          <Drawer.Popup className="flex max-h-[80dvh] w-full max-w-app translate-y-(--drawer-swipe-movement-y) flex-col gap-2 rounded-t-2xl bg-popover pt-2 pb-[max(env(safe-area-inset-bottom),1rem)] text-popover-foreground transition-transform duration-200 outline-none data-ending-style:translate-y-full data-starting-style:translate-y-full">
            <div
              aria-hidden="true"
              className="mx-auto h-1 w-9 shrink-0 rounded-full bg-secondary"
            />
            <Drawer.Title className="px-4 py-2 text-title-md font-semibold">{title}</Drawer.Title>
            <ul className="min-h-0 overflow-y-auto">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <li key={option.value} className="border-b border-line-subtle last:border-b-0">
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleSelectOption(option.value)}
                      className={cn(
                        "flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left text-label-lg hover:bg-muted active:bg-secondary",
                        isSelected && "font-medium",
                      )}
                    >
                      {multiple && <SelectSheetCheckbox checked={isSelected} />}
                      <span className="flex-1">{option.label}</span>
                      {!multiple && isSelected && <CheckIcon className="size-6 text-brand" />}
                    </button>
                  </li>
                );
              })}
            </ul>
            {multiple && (
              <div className="px-4 pt-2">
                <Drawer.Close render={<Button fullWidth />}>{UI_MESSAGES.done}</Drawer.Close>
              </div>
            )}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function SelectSheetCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-sm",
        checked ? "bg-brand text-primary-foreground" : "border-2 border-input",
      )}
    >
      {checked && <CheckIcon className="size-5" />}
    </span>
  );
}

export { SelectSheet, type SelectSheetOption };
