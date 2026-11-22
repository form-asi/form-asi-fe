"use client";

import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  emphasis?: "confirm" | "cancel";
  dismissOnBackdrop?: boolean;
  onConfirm: () => void | Promise<void>;
  onConfirmError: (error: unknown) => void;
};

/**
 * @description 확인 작업 중 중복 실행·닫기 차단, 성공 시 닫힘
 * @param onConfirm 완료까지 기다릴 확인 작업. 실패 시 throw/reject로 오류 전달
 * @param onConfirmError 호출부의 오류 안내 처리. 실패 시 모달 유지
 */
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  emphasis = "confirm",
  dismissOnBackdrop = false,
  onConfirm,
  onConfirmError,
}: ConfirmDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const confirmationInFlight = useRef(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  async function handleConfirm() {
    if (confirmationInFlight.current) return;
    confirmationInFlight.current = true;
    setIsPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      onConfirmError(error);
    } finally {
      confirmationInFlight.current = false;
      setIsPending(false);
    }
  }

  const cancelButton = (
    <AlertDialogCancel
      ref={cancelButtonRef}
      variant={emphasis === "cancel" ? "default" : "secondary"}
      size="lg"
      disabled={isPending}
    >
      {cancelLabel}
    </AlertDialogCancel>
  );
  const confirmButton = (
    <AlertDialogAction
      type="button"
      variant={emphasis === "confirm" ? "default" : "secondary"}
      size="lg"
      disabled={isPending}
      onClick={handleConfirm}
    >
      {confirmLabel}
    </AlertDialogAction>
  );

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen, details) => {
        if (confirmationInFlight.current) {
          details.cancel();
          return;
        }
        onOpenChange(nextOpen);
      }}
    >
      <AlertDialogContent
        initialFocus={cancelButtonRef}
        aria-busy={isPending}
        onBackdropClick={() => {
          if (dismissOnBackdrop && !confirmationInFlight.current) onOpenChange(false);
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {emphasis === "confirm" ? cancelButton : confirmButton}
          {emphasis === "confirm" ? confirmButton : cancelButton}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ConfirmDialog };
