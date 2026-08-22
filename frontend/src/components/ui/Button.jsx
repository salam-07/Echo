import React from 'react';
import { cn } from '../../lib/utils';

/**
 * An action, printed. Solid ink by default; hover inverts rather than lifts,
 * because this world has no elevation to lift into.
 *
 * The variant names are the old ones so that no caller has to change to get the
 * new world — `danger` is the only variant that admits colour, and it is the only
 * one the design allows to.
 */
const VARIANTS = {
    default: 'act',
    primary: 'act',
    secondary: 'act act-outline',
    outline: 'act act-outline',
    ghost: 'act act-quiet',
    quiet: 'act act-quiet',
    danger: 'act act-alarm',
    success: 'act',
};

/* Every size except `xs` clears the 44px touch target. `xs` exists for the
   inline controls inside a row of type and is never the only way to do a thing. */
const SIZES = {
    xs: 'h-8 px-3',
    sm: 'h-10 px-4',
    default: 'h-11 px-6',
    lg: 'h-12 px-8',
};

const Button = React.forwardRef(
    ({ className, variant = 'default', size = 'default', type = 'button', children, ...props }, ref) => (
        <button
            ref={ref}
            type={type}
            className={cn(VARIANTS[variant] ?? VARIANTS.default, SIZES[size] ?? SIZES.default, className)}
            {...props}
        >
            {children}
        </button>
    ),
);

Button.displayName = 'Button';

export default Button;
