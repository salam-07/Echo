import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({
    className,
    variant = 'default',
    size = 'default',
    children,
    ...props
}, ref) => {
    const baseClasses = 'btn transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        default: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        outline: 'btn-outline',
        danger: 'btn-error',
        success: 'btn-success'
    };

    const sizes = {
        xs: 'btn-xs',
        sm: 'btn-sm',
        default: '',
        lg: 'btn-lg'
    };

    const classes = cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
    );

    return (
        <button
            className={classes}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;