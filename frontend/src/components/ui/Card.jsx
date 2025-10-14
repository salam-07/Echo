import React from 'react';
import { cn } from '../../lib/utils';

const Card = ({ className, children, hover = false, ...props }) => {
    const classes = cn(
        'card bg-base-100 shadow-sm border border-base-300',
        hover && 'hover:shadow-md transition-shadow cursor-pointer',
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
        <div className={cn('card-header p-4 border-b border-base-300', className)} {...props}>
            {children}
        </div>
    );
};

const CardBody = ({ className, children, ...props }) => {
    return (
        <div className={cn('card-body p-4', className)} {...props}>
            {children}
        </div>
    );
};

const CardFooter = ({ className, children, ...props }) => {
    return (
        <div className={cn('card-footer p-4 border-t border-base-300', className)} {...props}>
            {children}
        </div>
    );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;