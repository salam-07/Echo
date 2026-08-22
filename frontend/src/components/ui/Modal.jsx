import React, { useEffect } from 'react';
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

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose?.();
        };
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" {...props}>
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="fixed inset-0 h-full w-full cursor-default bg-ink/25"
            />

            <div className="relative flex min-h-full items-start justify-center p-4 sm:p-8">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? titleId : undefined}
                    className={cn('w-full border border-ink bg-paper', SIZES[size] ?? SIZES.default, className)}
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
        </div>
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
