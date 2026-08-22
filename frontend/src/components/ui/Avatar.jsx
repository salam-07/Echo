import React from 'react';
import { cn } from '../../lib/utils';

/**
 * An initial, set on a square plate. A circle is the one shape this world does
 * not have, and a round avatar is how every social product signals that a person
 * is a profile picture. Here a person is a name — the plate is used only where a
 * name needs a mark beside it at scale, chiefly the account masthead.
 */
const SIZES = {
    xs: 'h-6 w-6 text-[0.625rem]',
    sm: 'h-8 w-8 text-[0.75rem]',
    md: 'h-10 w-10 text-[0.875rem]',
    lg: 'h-12 w-12 text-[1rem]',
    xl: 'h-16 w-16 text-[1.25rem]',
};

const Avatar = ({ src, alt = 'Avatar', size = 'md', className, fallback, ...props }) => {
    const classes = cn(
        'flex shrink-0 items-center justify-center overflow-hidden border border-ink bg-ink font-medium tracking-[0.06em] text-paper',
        SIZES[size] ?? SIZES.md,
        className,
    );

    return (
        <div className={classes} {...props}>
            {src ? (
                <img src={src} alt={alt} className="h-full w-full object-cover" />
            ) : (
                <span aria-hidden="true">{fallback || alt.charAt(0).toUpperCase()}</span>
            )}
        </div>
    );
};

export default Avatar;
