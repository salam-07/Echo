import React from 'react';
import { cn } from '../../lib/utils';

const SectionHeader = ({
    title,
    action,
    className,
    titleClassName = 'text-sm font-semibold text-base-content/60 uppercase tracking-wide',
    ...props
}) => {
    return (
        <div className={cn('flex items-center justify-between mb-3', className)} {...props}>
            <h3 className={titleClassName}>
                {title}
            </h3>
            {action && (
                <div className="flex-shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
};

export default SectionHeader;