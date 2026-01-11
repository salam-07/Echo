import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const NavigationItem = ({
    to,
    icon: Icon,
    children,
    className,
    variant = 'default',
    size = 'default',
    ...props
}) => {
    const baseClasses = 'flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors text-sm';

    const variants = {
        default: 'text-base-content/60 hover:text-base-content hover:bg-base-200/50',
        primary: 'text-base-content font-medium bg-base-200/80 hover:bg-base-300/80',
        active: 'text-base-content bg-base-200/60'
    };

    const sizes = {
        sm: 'px-2 py-1 text-xs',
        default: 'px-2 py-1.5 text-sm',
        lg: 'px-3 py-2 text-base'
    };

    const classes = cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
    );

    const content = (
        <>
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />}
            <span>{children}</span>
        </>
    );

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <button className={cn(classes, 'w-full text-left')} {...props}>
            {content}
        </button>
    );
};

export default NavigationItem;