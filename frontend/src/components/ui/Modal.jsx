import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

/**
 * A sheet laid over the document. Hairline-bordered paper on a dimmed ground — no
 * shadow, no radius, no blur, because none of those exist here. The ground is ink
 * at low opacity, which is the only way this world says "behind".
 *
 * Escape closes it and the page underneath does not move while it is open. The
 * close control is the word `Close`: the icon set was retired, and a word is
 * unambiguous in a way a glyph never is.
 */
const SIZES = {
    sm: 'max-w-md',
    default: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
};

const Modal = ({ isOpen, onClose, title, children, className, size = 'default', ...props }) => {
    const titleId = React.useId();
    const panelRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const previouslyFocused = document.activeElement;
        const panel = panelRef.current;

        /* Only what a keyboard can actually reach, and only what is on screen — a
           button in a collapsed branch is not a tab stop. */
        const focusablesIn = () =>
            Array.from(
                panel?.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
                ) ?? [],
            ).filter((el) => el.offsetParent !== null);

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
                return;
            }
            /* Tab cannot leave the sheet: the document behind it is inert while it
               is open, so focus wraps at the two ends rather than falling out. */
            if (event.key !== 'Tab') return;
            const focusables = focusablesIn();
            if (focusables.length === 0) {
                event.preventDefault();
                panel?.focus();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeyDown);
        /* Focus lands on the sheet itself, so a screen reader reads the dialog's
           name before its contents, and Tab starts inside. */
        panel?.focus();

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKeyDown);
            if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    /* Portalled to the document body: `position: fixed` is measured from the
       viewport only when no ancestor carries a transform, and the app's feed
       columns keep a settled `translateY(0)` from their entrance. Rendered inline
       the sheet would pin to the top of that column instead of the screen; at the
       body it cannot. */
    return createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto" {...props}>
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="modal-ground fixed inset-0 h-full w-full cursor-default bg-ink/25"
            />

            <div className="relative flex min-h-full items-center justify-center p-4 sm:p-8">
                <div
                    ref={panelRef}
                    tabIndex={-1}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? titleId : undefined}
                    className={cn(
                        'modal-sheet w-full border border-ink bg-paper outline-none',
                        SIZES[size] ?? SIZES.default,
                        className,
                    )}
                >
                    {title && (
                        <header className="flex items-baseline justify-between gap-6 border-b border-rule px-6 py-4">
                            <h2 id={titleId} className="t-subject">
                                {title}
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="t-label -mr-2 shrink-0 px-2 py-2 transition-colors hover:text-ink"
                            >
                                Close
                            </button>
                        </header>
                    )}
                    {children}
                </div>
            </div>
        </div>,
        document.body,
    );
};

const ModalHeader = ({ className, children, ...props }) => (
    <div className={cn('border-b border-rule px-6 py-4', className)} {...props}>
        {children}
    </div>
);

const ModalBody = ({ className, children, ...props }) => (
    <div className={cn('px-6 py-5', className)} {...props}>
        {children}
    </div>
);

const ModalFooter = ({ className, children, ...props }) => (
    <div
        className={cn('flex flex-wrap items-center justify-end gap-3 border-t border-rule px-6 py-4', className)}
        {...props}
    >
        {children}
    </div>
);

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
