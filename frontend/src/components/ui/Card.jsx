import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Not a card: a block of the sheet, separated by a hairline. Radius is zero
 * everywhere in this world, so the only thing that can mark a region is a rule
 * and the space around it.
 *
 * `hover` shades the paper instead of raising the block.
 */
const VARIANTS = {
    default: '',
    bordered: 'border border-rule',
    ghost: '',
    ruled: 'border-t border-rule',
};

const Card = ({ className, children, hover = false, variant = 'default', ...props }) => (
    <div
        className={cn(
            VARIANTS[variant] ?? '',
            hover && 'cursor-pointer transition-colors duration-200 hover:bg-paper-shade',
            className,
        )}
        {...props}
    >
        {children}
    </div>
);

const CardHeader = ({ className, children, ...props }) => (
    <div className={cn('px-5 pt-5 pb-3', className)} {...props}>
        {children}
    </div>
);

const CardBody = ({ className, children, ...props }) => (
    <div className={cn('px-5 py-4', className)} {...props}>
        {children}
    </div>
);

const CardFooter = ({ className, children, ...props }) => (
    <div className={cn('border-t border-rule px-5 pt-3 pb-5', className)} {...props}>
        {children}
    </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
