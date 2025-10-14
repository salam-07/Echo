import React from 'react';
import { cn } from '../../lib/utils';

const Avatar = ({
    src,
    alt = 'Avatar',
    size = 'md',
    className,
    fallback,
    ...props
}) => {
    const sizes = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl'
    };

    const classes = cn(
        'avatar rounded-full flex items-center justify-center bg-base-300 text-base-content/60 font-medium',
        sizes[size],
        className
    );

    if (src) {
        return (
            <div className={classes} {...props}>
                <img src={src} alt={alt} className="rounded-full w-full h-full object-cover" />
            </div>
        );
    }

    return (
        <div className={classes} {...props}>
            {fallback || alt.charAt(0).toUpperCase()}
        </div>
    );
};

export default Avatar;