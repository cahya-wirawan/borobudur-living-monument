'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Thin wrapper around the native modal <dialog>. The browser supplies the
 * focus trap, Escape handling, inert background and focus restoration to the
 * control that opened it. `fallbackFocus` covers the case where there was no
 * opener, e.g. a deep link that starts with the dialog open.
 */
export function ModalDialog({
  open,
  onClose,
  labelledBy,
  className,
  fallbackFocus,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  className?: string;
  fallbackFocus?: () => HTMLElement | null;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={() => {
        onClose();
        const active = document.activeElement;
        if (!active || active === document.body) fallbackFocus?.()?.focus();
      }}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget) onClose();
      }}
      className={className}
    >
      {children}
    </dialog>
  );
}
