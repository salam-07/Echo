import React from 'react';
import { cn } from '../../lib/utils';

const Badge = ({
    className,
    variant = 'default',
    size = 'default',
    children,
    ...props
}) => {
    const baseClasses = 'badge';

    const variants = {
        default: 'badge-neutral',
        primary: 'badge-primary',
        secondary: 'badge-secondary',
        accent: 'badge-accent',
        ghost: 'badge-ghost',
        outline: 'badge-outline',
        success: 'badge-success',
        warning: 'badge-warning',
        error: 'badge-error'
    };

    const sizes = {
        xs: 'badge-xs',
        sm: 'badge-sm',
        default: '',
        lg: 'badge-lg'
    };

    const classes = cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
    );

    return (
        <span className={classes} {...props}>
            {children}
        </span>
    );
};

export default Badge;