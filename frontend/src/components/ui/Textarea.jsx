import React from 'react';
import { cn } from '../../lib/utils';

const Textarea = React.forwardRef(({
    className,
    error,
    label,
    helperText,
    size = 'default',
    rows = 3,
    ...props
}, ref) => {
    const sizes = {
        xs: 'textarea-xs',
        sm: 'textarea-sm',
        default: '',
        lg: 'textarea-lg'
    };

    const textareaClasses = cn(
        'textarea textarea-bordered w-full transition-colors resize-none',
        error && 'textarea-error',
        sizes[size],
        className
    );

    return (
        <div className="form-control w-full">
            {label && (
                <label className="label">
                    <span className="label-text font-medium">{label}</span>
                </label>
            )}
            <textarea
                className={textareaClasses}
                rows={rows}
                ref={ref}
                {...props}
            />
            {(error || helperText) && (
                <label className="label">
                    <span className={cn(
                        'label-text-alt',
                        error ? 'text-error' : 'text-base-content/60'
                    )}>
                        {error || helperText}
                    </span>
                </label>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

export default Textarea;