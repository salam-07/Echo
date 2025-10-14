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
    const baseClasses = 'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors';

    const variants = {
        default: 'hover:bg-base-200 text-base-content/80 hover:text-base-content',
        primary: 'bg-secondary hover:bg-primary/80 text-base-100',
        active: 'bg-base-200 text-base-content'
    };

    const sizes = {
        sm: 'px-2 py-1 text-sm',
        default: 'px-3 py-2',
        lg: 'px-4 py-3 text-lg'
    };

    const classes = cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
    );

    const content = (
        <>
            {Icon && <Icon className="w-5 h-5" />}
            <span className="font-medium">{children}</span>
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