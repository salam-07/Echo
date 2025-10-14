import React from 'react';
import { cn } from '../../lib/utils';

const IconButton = React.forwardRef(({
    className,
    size = 'default',
    variant = 'ghost',
    children,
    ...props
}, ref) => {
    const baseClasses = 'btn btn-circle transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        ghost: 'btn-ghost',
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline'
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

IconButton.displayName = 'IconButton';

export default IconButton;