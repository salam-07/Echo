import React from 'react';
import { cn } from '../../lib/utils';

const Card = ({ className, children, hover = false, variant = 'default', ...props }) => {
    const variants = {
        default: 'bg-base-100',
        bordered: 'bg-base-100 border border-base-200/60',
        ghost: 'bg-transparent'
    };

    const classes = cn(
        'rounded-lg',
        variants[variant],
        hover && 'hover:bg-base-200/30 transition-colors cursor-pointer',
        className
    );

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

const CardHeader = ({ className, children, ...props }) => {
    return (
        <div className={cn('px-4 pt-4 pb-2', className)} {...props}>
            {children}
        </div>
    );
};

const CardBody = ({ className, children, ...props }) => {
    return (
        <div className={cn('px-4 py-3', className)} {...props}>
            {children}
        </div>
    );
};

const CardFooter = ({ className, children, ...props }) => {
    return (
        <div className={cn('px-4 pt-2 pb-4 border-t border-base-200/40', className)} {...props}>
            {children}
        </div>
    );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;