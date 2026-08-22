import React from 'react';
import { cn } from '../../lib/utils';

/**
 * A field is a hairline with a name over it. No box, no fill, no radius: the line
 * is where you write, and the label above it is the field's only chrome.
 *
 * The label is a real `<label>` bound by id, the error is announced, and
 * `aria-invalid` marks the field — so the state is never carried by the red line
 * alone.
 */
const Input = React.forwardRef(
    ({ className, type = 'text', error, label, helperText, size = 'default', id, ...props }, ref) => {
        const generated = React.useId();
        const fieldId = id ?? generated;
        const noteId = `${fieldId}-note`;
        const note = error || helperText;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={fieldId} className="t-label t-label--ink block">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={fieldId}
                    type={type}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={note ? noteId : undefined}
                    className={cn('field', size !== 'default' && 'field-sm', label && 'mt-1', className)}
                    {...props}
                />
                {note && (
                    <p
                        id={noteId}
                        className={cn(
                            'mt-2 text-[0.8125rem] leading-[1.5]',
                            error ? 'text-alarm' : 'text-ink-quiet',
                        )}
                    >
                        {note}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
