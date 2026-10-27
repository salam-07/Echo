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
    const dialogRef = useRef(null);
    const backdropPress = useRef(false);

    useEffect(() => {
        if (!isOpen) return;
        const previouslyFocused = document.activeElement;
        const dialog = dialogRef.current;
        const previousOverflow = document.body.style.overflow;
        // Native modal behavior makes the background inert, including to
        // assistive technology, and keeps new/disabled controls out of its trap.
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        panelRef.current?.focus({ preventScroll: true });

        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
            if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
                previouslyFocused.focus({ preventScroll: true });
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Keep sheets outside the feed's stacking contexts; showModal places them
    // in the browser's top layer, above the document and its floating controls.
    return createPortal(
        <dialog
            {...props}
            ref={dialogRef}
            aria-labelledby={title ? titleId : undefined}
            aria-label={title ? undefined : 'Dialog'}
            className="modal-viewport"
            onCancel={(event) => { event.preventDefault(); onClose?.(); }}
            onPointerDown={(event) => { backdropPress.current = event.target === event.currentTarget; }}
            onClick={(event) => {
                // Selecting text inside and releasing outside must not dismiss.
                if (backdropPress.current && event.target === event.currentTarget) onClose?.();
                backdropPress.current = false;
            }}
        >
            <div className="pointer-events-none relative flex min-h-full items-center justify-center p-4 sm:p-8">
                <div
                    ref={panelRef}
                    tabIndex={-1}
                    className={cn(
                        'modal-sheet pointer-events-auto w-full border border-ink bg-paper outline-none',
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
                                className="t-label -mr-2 min-h-11 shrink-0 px-2 py-2 transition-colors hover:text-ink"
                            >
                                Close
                            </button>
                        </header>
                    )}
                    {children}
                </div>
            </div>
        </dialog>,
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
