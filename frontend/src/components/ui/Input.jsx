import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({
    className,
    type = 'text',
    error,
    label,
    helperText,
    size = 'default',
    ...props
}, ref) => {
    const sizes = {
        xs: 'input-xs',
        sm: 'input-sm',
        default: '',
        lg: 'input-lg'
    };

    const inputClasses = cn(
        'input input-bordered w-full transition-colors',
        error && 'input-error',
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
            <input
                type={type}
                className={inputClasses}
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

Input.displayName = 'Input';

export default Input;