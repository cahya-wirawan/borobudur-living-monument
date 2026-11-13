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

  // True from showModal() until the browser reports the dialog closed.
  const shown = useRef(false);

  // Runs after every render on purpose: `open` alone cannot tell us whether the
  // element is really showing. If the browser closes the dialog itself and the
  // visitor opens another before React has processed that close, `open` never
  // turns false. `shown` stops us from re-opening a dialog the browser has just
  // closed but not yet reported.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open && !shown.current) {
      dialog.showModal();
      shown.current = true;
    }
    if (!open && dialog.open) dialog.close();
  });

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        // Escape: close through state so the element and the state never disagree.
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        shown.current = false;
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
