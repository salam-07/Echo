import React from 'react';
import { cn } from '../../lib/utils';

/**
 * The same field, taller. Composition is the one place this world lets type run
 * long, so the box grows downward off one hairline and never scrolls inside
 * itself if it can be avoided.
 */
const Textarea = React.forwardRef(
    ({ className, error, label, helperText, size = 'default', rows = 4, id, ...props }, ref) => {
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
                <textarea
                    ref={ref}
                    id={fieldId}
                    rows={rows}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={note ? noteId : undefined}
                    className={cn(
                        'field resize-none',
                        size !== 'default' && 'field-sm',
                        label && 'mt-1',
                        className,
                    )}
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

Textarea.displayName = 'Textarea';

export default Textarea;
